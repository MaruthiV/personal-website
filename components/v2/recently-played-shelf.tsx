"use client"

import { useEffect, useRef, useState } from "react"

// ---- Configurable dimensions ----
const CLOSED_WIDTH = 19 // px — thin sleeve edge
const ACTIVE_SIZE = 140 // px — open cover is square, same height as spines
const RECORD_HEIGHT = 140 // px — active cover height
const SPINE_HEIGHT = 140 // px — matches the cover so opening only widens (no height jump)
const GAP = 7 // px
const ANIMATION_DURATION = 0.9 // s — slow premium open + neighbor slide
const HOVER_DURATION = 180 // ms
const DISC_PEEK = 46 // px — black disc peeks this far right of the active cover
const TILT_NEIGHBOR = 5 // deg — immediate neighbor leans away this much
const TILT_FALLOFF = 1.2 // deg lost per extra step from the active item

// Uniform dark spine color for every spine (only the accent strip differs per album).
const SPINE_GRAY = "#0d1b2a"

type Disc = {
  track: string
  artist: string
  album: string
  cover: string
  url?: string
  isPlaying?: boolean
}

// Fallback used during load / if the Spotify API fails (one per album).
const FALLBACK: Disc[] = [
  { track: "Self Control", artist: "Frank Ocean", album: "Blonde", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/600x600bb.jpg" },
  { track: "The Less I Know the Better", artist: "Tame Impala", album: "Currents", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/64/48/5c/64485cc9-968c-68cc-764e-9a7c71733def/00602567155454.rgb.jpg/600x600bb.jpg" },
  { track: "Snooze", artist: "SZA", album: "SOS", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/600x600bb.jpg" },
  { track: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg" },
  { track: "Dreams", artist: "Fleetwood Mac", album: "Rumours", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/600x600bb.jpg" },
  { track: "Money Trees", artist: "Kendrick Lamar", album: "good kid, m.A.A.d city", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/36/86/ec/3686ec99-dec4-0a01-8b74-2d8a9a0263a7/12UMGIM52988.rgb.jpg/600x600bb.jpg" },
  { track: "Pink + White", artist: "Frank Ocean", album: "channel ORANGE", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a4/4b/c0/a44bc0c3-3866-7fad-8ba1-a145fcc9e92b/191773449094.jpg/600x600bb.jpg" },
  { track: "Out of Time", artist: "The Weeknd", album: "After Hours", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg" },
  { track: "SICKO MODE", artist: "Travis Scott", album: "Astroworld", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/600x600bb.jpg" },
  { track: "Good Life", artist: "Kanye West", album: "Graduation", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/39/25/2d/39252d65-2d50-b991-0962-f7a98a761271/00602517483507.rgb.jpg/600x600bb.jpg" },
]

function hashOf(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

// Extract a representative (saturation-weighted) color from an album cover.
// Both Spotify and Apple CDNs send Access-Control-Allow-Origin: *, so the canvas
// isn't tainted. Falls back to a deterministic hue if anything fails.
function extractColor(url: string): Promise<[number, number, number]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        const size = 24
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("no ctx"))
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        let ar = 0, ag = 0, ab = 0, aw = 0
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
          if (mx < 24 || mn > 232) continue // skip near-black / near-white
          const sat = mx === 0 ? 0 : (mx - mn) / mx
          const w = sat * sat * 3 + 0.05 // favor saturated, representative pixels
          ar += r * w
          ag += g * w
          ab += b * w
          aw += w
        }
        if (aw === 0) return reject(new Error("no color"))
        resolve([Math.round(ar / aw), Math.round(ag / aw), Math.round(ab / aw)])
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () => reject(new Error("load error"))
    img.src = url
  })
}

// Lean AWAY from the active item: left side leans left (−), right side leans
// right (+); the immediate neighbor leans most, falling off with distance.
function tiltFor(i: number, active: number) {
  if (i === active) return 0
  const d = i - active
  const mag = Math.max(0, TILT_NEIGHBOR - (Math.abs(d) - 1) * TILT_FALLOFF)
  return (d < 0 ? -1 : 1) * mag
}

export function RecentlyPlayedShelf({ initialActive = 0 }: { initialActive?: number }) {
  const [discs, setDiscs] = useState<Disc[]>(FALLBACK)
  const [active, setActive] = useState(initialActive)
  const [hovered, setHovered] = useState<number | null>(null)
  const [accents, setAccents] = useState<Record<number, [number, number, number]>>({})
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    let cancelled = false
    fetch("/api/spotify/recent-albums", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.items) && d.items.length > 0) {
          setDiscs(d.items)
          setActive((a) => Math.min(a, d.items.length - 1))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Pull the real dominant color from each cover for the accent strip.
  useEffect(() => {
    let cancelled = false
    setAccents({})
    discs.forEach((d, i) => {
      extractColor(d.cover)
        .then((rgb) => {
          if (!cancelled) setAccents((prev) => ({ ...prev, [i]: rgb }))
        })
        .catch(() => {})
    })
    return () => {
      cancelled = true
    }
  }, [discs])

  const shown = discs[active]

  const open = (i: number) => {
    if (i === active && discs[i]?.url) {
      window.open(discs[i].url, "_blank", "noopener,noreferrer")
    } else {
      setActive(i)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const next =
        e.key === "ArrowRight"
          ? Math.min(i + 1, discs.length - 1)
          : Math.max(i - 1, 0)
      setActive(next)
      btnRefs.current[next]?.focus()
    }
  }

  const shelfVars = {
    ["--closed-w"]: `${CLOSED_WIDTH}px`,
    ["--active-size"]: `${ACTIVE_SIZE}px`,
    ["--rec-h"]: `${RECORD_HEIGHT}px`,
    ["--spine-h"]: `${SPINE_HEIGHT}px`,
    ["--gap"]: `${GAP}px`,
    ["--anim"]: `${ANIMATION_DURATION}s`,
    ["--hover-anim"]: `${HOVER_DURATION}ms`,
    ["--disc-peek"]: `${DISC_PEEK}px`,
    ["--gray-bg"]: SPINE_GRAY,
  } as React.CSSProperties

  return (
    <div>
      <div className="shelf" style={shelfVars} role="listbox" aria-label="Recently played">
        {discs.map((disc, i) => {
          const h = hashOf(disc.album + disc.artist)
          const hue = h % 360
          // Subtle deterministic tilt so closed spines look naturally askew.
          const jitter = ((h % 5) - 2) * 0.7 // −1.4°..1.4°
          const lean = i === active ? 0 : tiltFor(i, active) + jitter
          const rgb = accents[i]
          const accent = rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : `hsl(${hue} 64% 48%)`
          const accentSoft = rgb
            ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.32)`
            : `hsla(${hue} 64% 48% / 0.32)`
          return (
            <button
              key={`${disc.album}-${i}`}
              ref={(el) => {
                btnRefs.current[i] = el
              }}
              type="button"
              role="option"
              aria-selected={i === active}
              aria-label={`${disc.track} — ${disc.artist}, from ${disc.album}${disc.isPlaying ? " (now playing)" : ""}${i === active ? " (open)" : ""}`}
              className={`vinyl${i === active ? " is-open" : ""}${hovered === i ? " is-hover" : ""}`}
              style={
                {
                  ["--lean"]: `${lean}deg`,
                  ["--accent"]: accent,
                  ["--accent-soft"]: accentSoft,
                } as React.CSSProperties
              }
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => open(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="vinyl__lift">
                {/* Closed: flat gray sleeve edge with a thin album-color accent */}
                <span className="vinyl__spine" />
                {/* Active only: disc + hinged cover */}
                <span className="vinyl__cover-wrap">
                  <span className="vinyl__disc" aria-hidden="true" />
                  <img className="vinyl__cover" src={disc.cover} alt={`${disc.album} cover`} />
                </span>
              </span>
              <span className="vinyl__tooltip" aria-hidden="true">
                {disc.track} — {disc.artist}
              </span>
            </button>
          )
        })}
      </div>

      <div className="shelf-line" aria-hidden="true" />

      <p className="shelf-caption" key={active}>
        {shown &&
          (shown.url ? (
            <a
              href={shown.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <span className="text-foreground">♪ {shown.track}</span> — {shown.artist}
            </a>
          ) : (
            <>
              <span className="text-foreground">♪ {shown.track}</span> — {shown.artist}
            </>
          ))}
      </p>
    </div>
  )
}
