"use client"

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

export function SpotifyNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing")
        const data = await response.json()
        setNowPlaying(data)
      } catch (error) {
        console.error("Error fetching now playing:", error)
        setNowPlaying({ isPlaying: false })
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 text-[15px] text-muted-foreground">
        <span>Loading...</span>
      </div>
    )
  }

  if (!nowPlaying) {
    return (
      <div className="flex items-center gap-3 text-[15px] text-muted-foreground">
        <span>Loading...</span>
      </div>
    )
  }

  // If we have track info (either playing or last played)
  if (nowPlaying.title) {
    return (
      <div className="flex items-center gap-3 text-[15px]">
        {nowPlaying.albumImageUrl && (
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={nowPlaying.albumImageUrl}
              alt="Album cover"
              fill
              className="rounded object-cover"
            />
          </div>
        )}
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-muted-foreground flex-shrink-0">
            {nowPlaying.isPlaying ? "Listening to" : "Last played"}
          </span>
          <Link
            href={nowPlaying.songUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate"
          >
            <span className="font-medium">{nowPlaying.title}</span>
            <span className="text-muted-foreground"> by {nowPlaying.artist}</span>
          </Link>
        </div>
      </div>
    )
  }

  // Fallback if no track data at all
  return (
    <div className="flex items-center gap-3 text-[15px]">
      <span className="text-muted-foreground">Not playing anything right now</span>
    </div>
  )
}
