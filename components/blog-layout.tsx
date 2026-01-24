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
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="min-h-screen px-6 py-12">
      {/* Table of Contents - Fixed position on the left */}
      <nav className="hidden xl:block fixed left-[calc(50%-28rem-12rem)] top-[280px] w-48">
        <ul className="space-y-2 text-sm">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <button
                onClick={() => handleScrollTo(item.id)}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-2xl mx-auto">
        {/* Home link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-16"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>

        {/* Title */}
        <header className="text-center mb-20">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">{date}</p>
        </header>

        {/* Main Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {children}
        </article>
      </div>
    </main>
  )
}
