import { art, type ArtItem } from "@/lib/data"
import { SiteShell } from "@/components/v2/site-shell"

const groups: { label: string; type: ArtItem["type"] }[] = [
  { label: "Books", type: "book" },
  { label: "Movies", type: "movie" },
  { label: "TV", type: "tv" },
]

export default function MediaPage() {
  return (
    <SiteShell>
      <main className="text-lg leading-relaxed text-foreground">
        <h1 className="mb-10 text-3xl font-bold">Media</h1>
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.type}>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {group.label}
              </h2>
              <ul className="space-y-1">
                {art
                  .filter((item) => item.type === group.type)
                  .map((item) => (
                    <li
                      key={item.title}
                      className="flex items-baseline justify-between gap-6"
                    >
                      <span>{item.title}</span>
                      <span className="flex-shrink-0 text-base tabular-nums text-muted-foreground">
                        {item.rating.toFixed(1)}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </SiteShell>
  )
}
