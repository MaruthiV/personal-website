"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type TOCItem = {
  id: string
  title: string
  level: number
}

interface BlogLayoutProps {
  title: string
  date: string
  toc: TOCItem[]
  children: React.ReactNode
}

export function BlogLayout({ title, date, toc, children }: BlogLayoutProps) {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-16">
      {/* Table of contents — fixed to the left of the column on wide screens */}
      <nav className="fixed left-[calc(50%-40rem)] top-40 hidden w-48 xl:block">
        <ul className="space-y-2 text-sm">
          {toc.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
              <button
                onClick={() => handleScrollTo(item.id)}
                className="text-left text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-[840px]">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mb-12 mt-12">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{date}</p>
        </header>

        <article className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold">
          {children}
        </article>
      </div>
    </main>
  )
}
