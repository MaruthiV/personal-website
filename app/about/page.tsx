"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import SocialLinks from "@/components/social-links"
import Image from "next/image"
import SpotifyNowPlaying from "@/components/spotify-now-playing"

export default function AboutPage() {
  const [loaded, setLoaded] = useState(false)
  const router = useRouter()

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

        {/* About Me Content */}
        <div className={`transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
          <h1 className="font-press-start text-3xl text-center mb-8">ABOUT ME</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Profile Image */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div
                className="relative w-60 h-60 overflow-hidden rounded-lg border-4 border-white animate-fall-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Image
                  src="/images/maruthi-profile.png"
                  alt="Maruthi taking a mirror selfie with a camera"
                  width={400}
                  height={400}
                  className="object-cover object-center"
                  style={{ objectPosition: "center 30%" }}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2 animate-fall-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-press-start text-xl text-white mb-4 border-b border-white pb-2">BIO</h2>
              <p className="text-gray-300 mb-4">
                Hello! I'm Maruthi, a student at the University of North Carolina at Chapel Hill pursuing a dual degree
                in Computer Science and Business Administration. I'm passionate about the intersection of technology,
                business, and artificial intelligence.
              </p>
              <p className="text-gray-300">
                My journey in tech began at the North Carolina School of Science and Mathematics, where I developed a
                strong foundation in machine learning, data structures, and cybersecurity. I've since gained
                professional experience through internships at Lenovo and Bumper Investing, and co-founded SplitShare, a
                platform for splitting subscription costs.
              </p>
            </div>
          </div>

          {/* Now Playing Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-pink-500 mb-4 border-b border-pink-500 pb-2">LISTENING TO</h2>
            <div className="animate-fall-in" style={{ animationDelay: "0.3s" }}>
              <SpotifyNowPlaying />
            </div>
          </section>

          {/* Fun Facts Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-purple-500 mb-4 border-b border-purple-500 pb-2">FUN FACTS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fall-in" style={{ animationDelay: "0.3s" }}>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-press-start text-sm text-purple-400 mb-2">AI Enthusiast</h3>
                <p className="text-gray-300 text-sm">
                  I've designed AI curriculum for national implementation and developed an AI agriculture robot using
                  NVIDIA Jetson Nano and TensorFlow.
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-press-start text-sm text-purple-400 mb-2">Published Researcher</h3>
                <p className="text-gray-300 text-sm">
                  I've co-authored research papers on cryptocurrency price prediction and cancer-drug efficacy
                  prediction using advanced machine learning techniques.
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-press-start text-sm text-purple-400 mb-2">Hackathon Organizer</h3>
                <p className="text-gray-300 text-sm">
                  I helped organize "SMathHacks", a state-wide hackathon with over 200+ high school participants, fostering
                  innovation in artificial intelligence.
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-press-start text-sm text-purple-400 mb-2">Competitive Programmer</h3>
                <p className="text-gray-300 text-sm">
                  I've achieved USACO Gold Division status and won 1st place at the Anaconda Data Science Expo among 56
                  competitors.
                </p>
              </div>
            </div>
          </section>

          {/* Interests Section */}
          <section className="mb-12">
            <h2 className="font-press-start text-xl text-cyan-500 mb-4 border-b border-cyan-500 pb-2">INTERESTS</h2>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 animate-fall-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Poker</h3>
                <p className="text-gray-300 text-sm">Strategic thinking and reading opponents</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Bhangra</h3>
                <p className="text-gray-300 text-sm">Traditional Indian dance form</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Startups</h3>
                <p className="text-gray-300 text-sm">Innovation and entrepreneurship</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Philosophy</h3>
                <p className="text-gray-300 text-sm">Exploring ideas and critical thinking</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Algorithmic Trading</h3>
                <p className="text-gray-300 text-sm">Developing quantitative strategies</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <h3 className="font-press-start text-sm text-cyan-400 mb-2">Watches</h3>
                <p className="text-gray-300 text-sm">Collecting and building timepieces</p>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section>
            <h2 className="font-press-start text-xl text-green-500 mb-4 border-b border-green-500 pb-2">MY JOURNEY</h2>

            <div
              className="relative border-l-2 border-green-500 pl-8 ml-4 space-y-10 animate-fall-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="font-press-start text-sm text-green-400">2025</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Working at Humanity Unleashed, developing AI models in generative AI, learning about building products, and exploring myself.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="font-press-start text-sm text-green-400">2024</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Graduated from NCSSM and began my journey at UNC Chapel Hill, pursuing dual degrees in Computer
                  Science and Business Administration.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="font-press-start text-sm text-green-400">2023</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Co-founded SplitShare and published research papers on cryptocurrency price prediction and cancer-drug
                  efficacy prediction.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="font-press-start text-sm text-green-400">2022</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Started my journey at North Carolina School of Science and Mathematics, diving deep into computer
                  science and mathematics.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <h3 className="font-press-start text-sm text-green-400">2021</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Completed my first software engineering internship at Bumper Investing, working on React Native
                  applications for teenage investors.
                </p>
              </div>
            </div>
          </section>
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

