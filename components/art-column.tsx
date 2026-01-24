import { art } from "@/lib/data"
import { BookOpen, Film, Tv } from "lucide-react"

const typeIcons = {
  book: BookOpen,
  movie: Film,
  tv: Tv,
}

const typeLabels = {
  book: "Book",
  movie: "Movie",
  tv: "TV Show",
}

export function ArtColumn() {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Art
      </h2>
      <ul className="space-y-3">
        {art.map((item) => {
          const Icon = typeIcons[item.type]
          return (
            <li key={item.title} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-[15px] truncate" title={item.title}>
                  {item.title}
                </span>
              </div>
              <span className="text-sm text-muted-foreground flex-shrink-0">
                {item.rating.toFixed(1)} / 10
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
