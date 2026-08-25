import Link from "next/link"
import { projects } from "@/lib/data"
import { Em } from "@/components/v2/em"
import { RecentlyPlayedShelf } from "@/components/v2/recently-played-shelf"
import { SiteShell } from "@/components/v2/site-shell"
import { getShelfItems } from "@/lib/spotify"

const linkClass =
  "underline underline-offset-2 decoration-foreground/40 transition-colors hover:decoration-foreground"

// "Latest work" — the two most recent projects, each a one-liner.
const latest = [
  { slug: "eviction-as-estimation", line: "a fixed-lag smoothing view of KV cache eviction" },
  { slug: "nano-oasis", line: "a diffusion world model you play in the browser, Snake with no game engine" },
]
  .map((s) => ({ ...s, project: projects.find((p) => p.slug === s.slug)! }))
  .filter((s) => s.project)

// Prerender this page and refresh it in the background every 60s, matching the
// shelf cache in lib/spotify. Visitors are then served static HTML from the CDN
// instead of waiting on a server render: a cold render blocked on Spotify for
// ~800ms, and because the page previously read searchParams (for a `?disc=`
// param nothing ever linked to) it could never be cached at all.
export const revalidate = 60

export default async function Home() {
  // Default: most-recent record (index 0) popped open.
  const initialActive = 0

  // Fetch the shelf server-side so the first paint already shows real albums,
  // with no flash of the hardcoded fallback.
  let initialDiscs: Awaited<ReturnType<typeof getShelfItems>> = []
  try {
    initialDiscs = await getShelfItems(15)
  } catch {
    initialDiscs = []
  }

  return (
    <SiteShell>
      <main className="text-xl leading-relaxed text-foreground">
        {/* Intro */}
        <div className="space-y-6">
          <p>
            I’m a student at{" "}
            <Link
              href="https://www.unc.edu"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              UNC Chapel Hill
            </Link>{" "}
            studying computer science and business. I’ve previously worked at{" "}
            <Link
              href="https://www.eleuther.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              EleutherAI
            </Link>{" "}
            and{" "}
            <Link
              href="https://careset.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              CareSet
            </Link>
            , and I’m now focused on sequential decision making.
          </p>
          <p>
            I really like discerning the macroeconomic <Em>infrastructure</Em> that quietly shapes
            the world. Following how a single shift ripples outward into the <Em>markets</Em> and{" "}
            <Em>energy systems</Em> that get reshaped along with it is the part I enjoy most.
          </p>
        </div>

        {/* Latest work */}
        <p className="mb-4 mt-16">Latest work:</p>
        <ul className="space-y-2 text-base">
          {latest.map(({ project, line }) => (
            <li
              key={project.slug}
              className="grid grid-cols-1 items-baseline gap-x-6 sm:grid-cols-[195px_1fr]"
            >
              <Link
                href={project.link?.url ?? `/projects`}
                target={project.link ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-semibold hover:underline hover:underline-offset-2"
              >
                {project.name} <span className="font-normal text-muted-foreground">↗</span>
              </Link>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {/* Recently played — vinyl shelf. Breaks out wider than the text column. */}
        <div className="relative left-1/2 mt-12 w-[min(94vw,900px)] -translate-x-1/2">
          <RecentlyPlayedShelf initialActive={initialActive} initialDiscs={initialDiscs} />
        </div>
      </main>
    </SiteShell>
  )
}
