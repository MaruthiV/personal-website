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
  { slug: "spectra", line: "in-browser LLM inference with EAGLE-3 speculative decoding" },
  { slug: "mini-vllm", line: "a fast LLM inference engine with PagedAttention" },
]
  .map((s) => ({ ...s, project: projects.find((p) => p.slug === s.slug)! }))
  .filter((s) => s.project)

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ disc?: string }>
}) {
  const sp = await searchParams
  const disc = sp.disc != null && sp.disc !== "" ? Number(sp.disc) : null
  // Default: most-recent record (index 0) popped open.
  const initialActive = disc != null && Number.isFinite(disc) ? disc : 0

  // Fetch the shelf server-side so the first paint already shows real albums —
  // no flash of the hardcoded fallback. The client still refreshes on mount.
  // (Accessing searchParams above already opts this page into dynamic rendering,
  // so this runs fresh per request.)
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
              href="https://careset.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              CareSet
            </Link>{" "}
            and{" "}
            <Link
              href="https://humun.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Humanity Unleashed
            </Link>
            , and I’m now focused on diffusion models.
          </p>
          <p>
            I’m most interested in building <Em>intelligent systems</Em> that make hard decisions
            feel simple, and in helping people see the forces quietly shaping their lives.
          </p>
          <p>
            I tend to think about the world macroeconomically. Being curious about a piece of
            technology quickly turns into being curious about the <Em>supply chains</Em> behind it
            and the <Em>markets</Em> it reshapes, and following that thread is the part I enjoy most.
          </p>
        </div>

        {/* Latest work */}
        <p className="mb-4 mt-16">Latest work:</p>
        <ul className="space-y-2 text-base">
          {latest.map(({ project, line }) => (
            <li
              key={project.slug}
              className="grid grid-cols-1 items-baseline gap-x-6 sm:grid-cols-[150px_1fr]"
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
