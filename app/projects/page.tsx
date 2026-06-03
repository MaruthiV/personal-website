import Link from "next/link"
import { projects } from "@/lib/data"
import { SiteShell } from "@/components/v2/site-shell"

export default function ProjectsPage() {
  return (
    <SiteShell>
      <main className="text-lg leading-relaxed text-foreground">
        <h1 className="mb-10 text-3xl font-bold">Projects</h1>
        <ul className="space-y-6">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="grid grid-cols-1 items-baseline gap-x-6 gap-y-1 sm:grid-cols-[170px_1fr]"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="font-semibold hover:underline hover:underline-offset-2"
              >
                {project.name}
              </Link>
              <span>{project.description}</span>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  )
}
