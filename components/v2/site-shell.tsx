import type React from "react"
import { V2Nav } from "@/components/v2/v2-nav"

// Shared shell for the top-level pages (home, projects, media, blogs): the
// centered column + the header (social icons, name, section nav). Detail pages
// (project / blog) intentionally do not use this — they're clean reading pages.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[840px] px-6 pb-16 pt-16">
      <V2Nav />
      {children}
    </div>
  )
}
