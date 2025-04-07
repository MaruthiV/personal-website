import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface NowPlaying {
  isPlaying: boolean
  title?: string
  artist?: string
  albumImageUrl?: string
  songUrl?: string
}

export default function SpotifyNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({ isPlaying: false })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing")
        const data = await response.json()
        setNowPlaying(data)
      } catch (error) {
        console.error("Error fetching now playing:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    )
  }

  if (!nowPlaying.isPlaying) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-400">not listening to anything right now - either sleeping or contemplating dostoevsky :)</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center space-x-4">
        {nowPlaying.albumImageUrl && (
          <div className="relative w-16 h-16">
            <Image
              src={nowPlaying.albumImageUrl}
              alt="Album cover"
              fill
              className="rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <Link
            href={nowPlaying.songUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <h3 className="font-press-start text-sm text-cyan-400 mb-1">
              {nowPlaying.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm">{nowPlaying.artist}</p>
        </div>
      </div>
    </div>
  )
} 