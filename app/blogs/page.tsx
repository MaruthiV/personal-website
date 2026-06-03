import Link from "next/link"
import { posts } from "@/lib/data"
import { SiteShell } from "@/components/v2/site-shell"

export default function BlogsPage() {
  return (
    <SiteShell>
      <main className="text-lg leading-relaxed text-foreground">
        <h1 className="mb-10 text-3xl font-bold">Blogs</h1>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-baseline justify-between gap-6">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:underline hover:underline-offset-2"
              >
                {post.title}
              </Link>
              <span className="flex-shrink-0 text-base tabular-nums text-muted-foreground">
                {post.date}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  )
}
