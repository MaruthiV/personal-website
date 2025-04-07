"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import SocialLinks from "@/components/social-links"

export default function BlogPost() {
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoaded(true)

    // Add ESC key handler to go back
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/blog")
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
            href="/blog"
            className="flex items-center font-press-start text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Blog Content */}
        <div className={`transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <article className="prose prose-invert max-w-none">
            <h1 className="font-press-start text-3xl text-center mb-8">Balancing Freshman Year</h1>
            
            <div className="flex items-center text-sm text-gray-400 gap-4 mb-8">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                April 7, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                5 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                personal
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              As I sit here in my dorm room, surrounded by textbooks and half-finished coding projects, I can't help but reflect on how much has changed since I first stepped onto campus. Freshman year has been a whirlwind of new experiences, challenges, and self-discovery.
            </p>

            <p className="text-gray-300 mb-4">
              One of the biggest realizations I've had is how different college life is from what I expected. The freedom to choose your own path is both exhilarating and daunting. I came in with so many ideas - I wanted to start a SaaS company, dive deep into research, maybe even launch a startup. But reality has a way of tempering those ambitions with the practicalities of daily life.
            </p>

            <p className="text-gray-300 mb-4">
              Right now, with finals looming on the horizon, I find myself in a constant battle between my academic responsibilities and my entrepreneurial aspirations. There are so many ideas I want to pursue, so many projects I want to build, but time seems to slip through my fingers like sand. The more I learn about the tech industry and business world, the more I realize how much there is to explore.
            </p>

            <p className="text-gray-300 mb-4">
              I'm at a crossroads in terms of my career path. On one hand, I'm drawn to the analytical and strategic aspects of consulting and business research. The idea of helping companies solve complex problems and optimize their operations is fascinating. On the other hand, my passion for technology and coding keeps pulling me towards the more technical side of things. Building something from scratch, seeing code come to life, and solving technical challenges is incredibly rewarding.
            </p>

            <p className="text-gray-300 mb-4">
              What I've learned most this year is that it's okay not to have everything figured out. The pressure to have a clear career path can be overwhelming, but I'm starting to see that the journey of exploration is just as important as the destination. Each class I take, each project I work on, and each conversation I have with professors and peers helps me understand a little more about what truly excites me.
            </p>

            <p className="text-gray-300 mb-4">
              As I look ahead to the rest of my college journey, I'm trying to embrace the uncertainty. Maybe I don't need to choose between business and tech right now. Maybe the best path forward is to continue exploring both, to build a foundation that combines technical skills with business acumen. After all, some of the most successful people I've met didn't follow a straight path - they embraced the twists and turns, learning from each experience.
            </p>

            <p className="text-gray-300">
              For now, I'll focus on getting through finals, but I'm keeping my entrepreneurial spirit alive. The ideas will still be there when I have more time to pursue them. And who knows? Maybe the perfect opportunity to combine my interests in business and technology will present itself when I least expect it.
            </p>
          </article>
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