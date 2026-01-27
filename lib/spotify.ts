const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async () => {
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

  return response.json()
}

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

export const getNowPlayingItem = async () => {
  const response = await getNowPlaying()

  // If currently playing something
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