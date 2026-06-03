import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { projects } from "@/lib/data"

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
    <main className="mx-auto min-h-screen max-w-[840px] px-6 pb-24 pt-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <article className="mt-12">
        <h1 className="text-3xl font-bold sm:text-4xl">{project.name}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{project.tags.join("  ·  ")}</p>
        {project.link && (
          <Link
            href={project.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-base underline decoration-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground"
          >
            {project.link.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground">
          {project.longDescription}
        </p>
      </article>
    </main>
  )
}
