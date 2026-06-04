import { unstable_cache } from "next/cache"

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

// Spotify access tokens are valid for ~1h. Cache the refresh result for 55m so we
// reuse one token across requests instead of minting a new one on every load.
const getAccessToken = unstable_cache(
  async (): Promise<{ access_token: string }> => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token!,
      }),
    })

    const json = await response.json()
    // Throw rather than return a bad token, so a failed refresh isn't cached for 55m.
    if (!json?.access_token) throw new Error("Spotify token refresh failed")
    return json
  },
  ["spotify-access-token"],
  { revalidate: 3300 },
)

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken()

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken()

  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export type ShelfItem = {
  track: string
  artist: string
  album: string
  cover: string
  url: string
  isPlaying: boolean
  playedAt: string | null
}

const mapTrack = (
  t: any,
  extra: { isPlaying?: boolean; playedAt?: string },
): ShelfItem => ({
  track: t?.name ?? "",
  artist: t?.artists?.map((a: any) => a.name).join(", ") ?? "",
  album: t?.album?.name ?? "",
  cover: t?.album?.images?.[0]?.url ?? "",
  url: t?.external_urls?.spotify ?? "",
  isPlaying: !!extra.isPlaying,
  playedAt: extra.playedAt ?? null,
})

// Shelf data: the currently-playing track (if any) first, then recently-played
// newest→oldest, deduped by album id, capped at `limit`.
const fetchShelfItems = async (limit = 15): Promise<ShelfItem[]> => {
  const { access_token } = await getAccessToken()
  const headers = { Authorization: `Bearer ${access_token}` }
  const items: ShelfItem[] = []
  const seen = new Set<string>()

  // The two reads are independent — fire them together; we only want
  // now-playing to sort first, which the processing order below preserves.
  const [npRes, rpRes] = await Promise.all([
    fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers,
      cache: "no-store",
    }).catch(() => null),
    fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
      headers,
      cache: "no-store",
    }).catch(() => null),
  ])

  try {
    if (npRes && npRes.status === 200) {
      const np = await npRes.json()
      if (np?.is_playing && np.item?.album?.id) {
        seen.add(np.item.album.id)
        items.push(mapTrack(np.item, { isPlaying: true }))
      }
    }
  } catch (error) {
    console.error("Error parsing currently-playing:", error)
  }

  try {
    if (rpRes && rpRes.status === 200) {
      const data = await rpRes.json()
      // One sleeve per album: keep the most recent track for each album.
      for (const it of data.items ?? []) {
        const t = it.track
        const albumId = t?.album?.id
        if (!albumId || seen.has(albumId)) continue
        seen.add(albumId)
        items.push(mapTrack(t, { playedAt: it.played_at }))
        if (items.length >= limit) break
      }
    }
  } catch (error) {
    console.error("Error parsing recently-played:", error)
  }

  return items.slice(0, limit)
}

// Cache the assembled shelf for 60s. The home page server-renders real albums on
// first paint (so no fallback flash), but pulls them from this cache instead of
// hitting Spotify on every visit. Recently-played is only ~60s stale, which is
// imperceptible to a visitor.
export const getShelfItems = unstable_cache(
  fetchShelfItems,
  ["spotify-shelf-items"],
  { revalidate: 60 },
)

export const getNowPlayingItem = async () => {
  // If currently playing something
  try {
    const response = await getNowPlaying()
    if (response.status === 200) {
      const song = await response.json()
      if (song.is_playing && song.item) {
        const title = song.item.name
        const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ')
        const albumImageUrl = song.item.album.images[0].url
        const songUrl = song.item.external_urls.spotify

        return {
          isPlaying: true,
          title,
          artist,
          albumImageUrl,
          songUrl,
        }
      }
    }
  } catch (error) {
    console.error("Error fetching now-playing:", error)
  }

  // If not playing, get the last played track
  try {
    const recentResponse = await getRecentlyPlayed()
    if (recentResponse.status === 200) {
      const data = await recentResponse.json()
      if (data.items && data.items.length > 0) {
        const track = data.items[0].track
        return {
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((_artist: any) => _artist.name).join(', '),
          albumImageUrl: track.album.images[0].url,
          songUrl: track.external_urls.spotify,
        }
      }
    }
  } catch (error) {
    console.error("Error fetching recently played:", error)
  }

  return { isPlaying: false }
} 