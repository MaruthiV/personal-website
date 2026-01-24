import Link from "next/link"
import { posts } from "@/lib/data"

export function PostsColumn() {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Posts
      </h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] group-hover:underline">
                  {post.title}
                </span>
                <span className="text-sm text-muted-foreground flex-shrink-0">
                  {post.date}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
