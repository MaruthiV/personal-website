"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface NavBlockProps {
  type: "L" | "T" | "O" | "I" | "S"
  label: string
  color: string
  href: string
}

export default function NavBlock({ type, label, color, href }: NavBlockProps) {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [isDropping, setIsDropping] = useState(false)

  // Define block shapes
  const getBlockShape = () => {
    switch (type) {
      case "L":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className="aspect-square w-6 h-6 md:w-8 md:h-8 bg-transparent"></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
          </div>
        )
      case "T":
        return (
          <div className="grid grid-cols-3 gap-1">
            <div className="aspect-square w-6 h-6 md:w-8 md:h-8 bg-transparent"></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className="aspect-square w-6 h-6 md:w-8 md:h-8 bg-transparent"></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
          </div>
        )
      case "O":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
          </div>
        )
      case "I":
        return (
          <div className="grid grid-cols-1 gap-1">
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
          </div>
        )
      case "S":
        return (
          <div className="grid grid-cols-3 gap-1">
            <div className="aspect-square w-6 h-6 md:w-8 md:h-8 bg-transparent"></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className={`${color} aspect-square w-6 h-6 md:w-8 md:h-8`}></div>
            <div className="aspect-square w-6 h-6 md:w-8 md:h-8 bg-transparent"></div>
          </div>
        )
      default:
        return null
    }
  }

  const handleClick = () => {
    setIsDropping(true)

    // Navigate after animation completes
    setTimeout(() => {
      router.push(href)
    }, 500)
  }

  return (
    <div
      className="flex flex-col items-center transition-all duration-300 transform cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      style={{
        transform: isDropping
          ? "translateY(100px) rotate(0)"
          : isHovering
            ? "translateY(-10px) rotate(5deg)"
            : "translateY(0) rotate(0)",
        opacity: isDropping ? 0 : 1,
        transition: isDropping ? "transform 0.5s ease-in, opacity 0.5s ease-in" : "transform 0.3s ease-out",
      }}
    >
      <div className="mb-2">{getBlockShape()}</div>
      <span className="font-press-start text-white text-xs md:text-sm">{label}</span>
    </div>
  )
}

