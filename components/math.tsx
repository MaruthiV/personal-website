"use client"

import katex from "katex"
import "katex/dist/katex.min.css"

interface MathProps {
  children: string
  block?: boolean
}

export function Math({ children, block = false }: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: block,
  })

  if (block) {
    return (
      <div
        className="my-6 overflow-x-auto py-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <span
      className="mx-0.5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Inline math shorthand
export function M({ children }: { children: string }) {
  return <Math>{children}</Math>
}

// Block math shorthand
export function MathBlock({ children }: { children: string }) {
  return <Math block>{children}</Math>
}
