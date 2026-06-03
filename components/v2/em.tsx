import type React from "react"

// Serif-italic emphasis, exactly like ekzhang.com's "interactive software".
// Uses Newsreader (loaded in the /v2 layout) for the italic words.
export function Em({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="italic"
      style={{ fontFamily: "var(--font-newsreader), ui-serif, Georgia, serif" }}
    >
      {children}
    </span>
  )
}
