import Link from "next/link"
import { projects } from "@/lib/data"
import { TechTag } from "./tech-tag"

export function ProjectsColumn() {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Projects
      </h2>
      <div className="relative">
        <ul className="space-y-4 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
          {projects.map((project) => (
            <li key={project.slug}>
              <div className="space-y-1">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-[15px] font-medium hover:underline"
                >
                  {project.name}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <TechTag key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
