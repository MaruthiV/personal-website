"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import SocialLinks from "@/components/social-links"

// Sample blog posts data
const BLOG_POSTS = [
  {
    id: 1,
    title: "Balancing Freshman Year",
    excerpt: "A personal reflection on navigating college life, career aspirations, and finding the right path forward.",
    date: "April 7, 2025",
    readTime: "5 min read",
    tags: ["personal"],
    slug: "balancing-freshman-year",
  },
]

export default function BlogPage() {
  const [loaded, setLoaded] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const router = useRouter()

  // Get all unique tags
  const allTags = Array.from(new Set(BLOG_POSTS.flatMap((post) => post.tags)))

  // Filter posts by selected tag
  const filteredPosts = selectedTag ? BLOG_POSTS.filter((post) => post.tags.includes(selectedTag)) : BLOG_POSTS

  useEffect(() => {
    setLoaded(true)

    // Add ESC key handler to go back
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center font-press-start text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Link>
        </div>

        {/* Blog Content */}
        <div className={`transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <h1 className="font-press-start text-3xl text-center mb-8">BLOG</h1>

          {/* Tags Filter */}
          <div className="mb-8 animate-fall-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-press-start text-xl text-green-500 mb-4 border-b border-green-500 pb-2">
              FILTER BY TAG
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-press-start ${
                  selectedTag === null ? "bg-green-500 text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-press-start ${
                    selectedTag === tag ? "bg-green-500 text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="space-y-8">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-500 animate-fall-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="font-press-start text-lg text-green-400 mb-2 hover:text-green-300 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedTag(tag)
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-press-start">No posts found with the selected tag.</p>
              <button
                onClick={() => setSelectedTag(null)}
                className="mt-4 px-4 py-2 bg-green-500 text-black rounded font-press-start text-sm hover:bg-green-400 transition-colors"
              >
                Show All Posts
              </button>
            </div>
          )}

          {/* Easter Egg Hint */}
          <div className="mt-16 text-center text-gray-500 text-xs animate-pulse">
            <p>Try typing "KONAMI" to unlock a secret blog post...</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <SocialLinks />

      {/* Keyboard Instructions */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-10 text-gray-400 font-press-start text-xs">
        Press ESC to go back
      </div>
    </main>
  )
}

