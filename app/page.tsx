"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Gamepad2 } from "lucide-react"
import TetrisCanvas from "@/components/tetris-canvas"
import NavBlock from "@/components/nav-block"
import TetrisGame from "@/components/tetris-game"
import { useRouter } from "next/navigation"
import SocialLinks from "@/components/social-links"

// Konami code sequence
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

export default function Home() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const [unlockedContent, setUnlockedContent] = useState(false)
  const konamiSequence = useRef<string[]>([])

  // Check if user has already started the experience (for back navigation)
  useEffect(() => {
    const hasStarted = sessionStorage.getItem("hasStarted") === "true"
    if (hasStarted) {
      setStarted(true)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter key to start
      if (e.key === "Enter" && !started) {
        setStarted(true)
        sessionStorage.setItem("hasStarted", "true")
        return
      }

      // ESC key to reset
      if (e.key === "Escape") {
        setStarted(false)
        return
      }

      // Check for Konami code
      konamiSequence.current.push(e.key)
      if (konamiSequence.current.length > KONAMI_CODE.length) {
        konamiSequence.current.shift()
      }

      // Check if Konami code is complete
      if (konamiSequence.current.join(",") === KONAMI_CODE.join(",")) {
        setShowGame(true)
        konamiSequence.current = []
      }

      // Number keys for navigation
      if (started) {
        switch (e.key) {
          case "1":
            router.push("/resume")
            break
          case "2":
            router.push("/about")
            break
          case "3":
            router.push("/blog")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, started])

  const handleStart = () => {
    setStarted(true)
    sessionStorage.setItem("hasStarted", "true")
  }

  const handleGameUnlock = (score: number) => {
    if (score >= 2000) {
      setUnlockedContent(true)
    }
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-gray-900 flex flex-col items-center justify-center">
      {/* Tetris Canvas Background */}
      <TetrisCanvas started={started} />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {!started ? (
          <div className="flex flex-col items-center space-y-8 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-press-start text-white leading-tight">Hi, I&apos;m Maruthi ;)</h1>
            <button
              onClick={handleStart}
              className="font-press-start bg-cyan-500 text-white px-8 py-4 text-xl rounded-md border-b-4 border-cyan-700 hover:bg-cyan-600 hover:border-cyan-800 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 active:translate-y-1 active:border-b-2"
            >
              PRESS START
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-press-start text-white mb-12">SELECT YOUR DESTINATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 justify-items-center">
              <NavBlock type="L" label="Resume (1)" color="bg-cyan-500" href="/resume" />
              <NavBlock type="O" label="About Me (2)" color="bg-yellow-500" href="/about" />
              <NavBlock type="I" label="Blog (3)" color="bg-green-500" href="/blog" />
            </div>

            {unlockedContent && (
              <div className="mt-12 animate-pulse">
                <p className="font-press-start text-yellow-400 text-sm mb-4">SECRET UNLOCKED!</p>
                <Link
                  href="/secret-project"
                  className="font-press-start bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-400 transition-colors"
                >
                  VIEW SECRET PROJECT
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Button */}
      <button
        onClick={() => setShowGame(true)}
        className="absolute top-4 left-4 z-20 bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors"
        title="Play Tetris (or use Konami code)"
      >
        <Gamepad2 className="h-6 w-6 text-white" />
      </button>

      {/* Social Links */}
      <SocialLinks />

      {/* Tetris Game */}
      {showGame && <TetrisGame onClose={() => setShowGame(false)} onUnlock={handleGameUnlock} />}

      {/* Keyboard Instructions - Only shown after starting */}
      {started && (
        <div className="absolute bottom-12 z-10 text-gray-400 font-press-start text-xs">
          <p>Use number keys (1-3) for navigation</p>
          <p className="mt-1">Press ESC to reset | Try the Konami code!</p>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 z-10 text-gray-400 font-press-start text-xs">
        © {new Date().getFullYear()} Maruthi
      </div>
    </main>
  )
}

