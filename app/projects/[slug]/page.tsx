import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { projects } from "@/lib/data"
import { TechTag } from "@/components/tech-tag"

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-3">{project.name}</h1>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <TechTag key={tag} label={tag} />
            ))}
          </div>
          {project.link && (
            <Link
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              {project.link.label}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          )}
        </header>

        <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
          {project.longDescription}
        </p>
      </article>
    </main>
  )
}
