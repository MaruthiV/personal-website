"use client"

import { useEffect, useRef } from "react"

interface TetrisCanvasProps {
  started: boolean
}

// Tetris block shapes and colors
const SHAPES = [
  { shape: [[1, 1, 1, 1]], color: "#06b6d4" }, // I - Cyan
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#eab308",
  }, // O - Yellow
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#a855f7",
  }, // T - Purple
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#22c55e",
  }, // S - Green
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#ef4444",
  }, // Z - Red
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#3b82f6",
  }, // J - Blue
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#f97316",
  }, // L - Orange
]

export default function TetrisCanvas({ started }: TetrisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Grid settings
    const blockSize = 30
    const cols = Math.ceil(canvas.width / blockSize)
    const rows = Math.ceil(canvas.height / blockSize)

    // Create grid
    const grid: number[][] = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))

    // Tetris pieces
    const pieces: {
      shape: number[][]
      color: string
      x: number
      y: number
      speed: number
    }[] = []

    // Add new piece
    const addPiece = () => {
      if (pieces.length > 15) return // Limit number of pieces

      const shapeIndex = Math.floor(Math.random() * SHAPES.length)
      const { shape, color } = SHAPES[shapeIndex]

      const x = Math.floor(Math.random() * (cols - shape[0].length))
      const y = -shape.length
      const speed = 0.5 + Math.random() * 1.5 // Random speed

      pieces.push({ shape, color, x, y, speed })
    }

    // Draw a single block
    const drawBlock = (x: number, y: number, color: string) => {
      const borderWidth = 2

      // Main block
      ctx.fillStyle = color
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)

      // Highlight (top-left)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, borderWidth)
      ctx.fillRect(x * blockSize, y * blockSize, borderWidth, blockSize)

      // Shadow (bottom-right)
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.fillRect(x * blockSize, (y + 1) * blockSize - borderWidth, blockSize, borderWidth)
      ctx.fillRect((x + 1) * blockSize - borderWidth, y * blockSize, borderWidth, blockSize)
    }

    // Draw a piece
    const drawPiece = (piece: (typeof pieces)[0]) => {
      const { shape, color, x, y } = piece

      shape.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell) {
            drawBlock(x + cellIndex, y + rowIndex, color)
          }
        })
      })
    }

    // Draw the grid
    const drawGrid = () => {
      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            drawBlock(x, y, SHAPES[cell - 1].color)
          }
        })
      })
    }

    // Update game state
    let lastTime = 0
    let pieceTimer = 0

    const update = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new pieces periodically
      pieceTimer += deltaTime
      if (pieceTimer > (started ? 800 : 1500)) {
        addPiece()
        pieceTimer = 0
      }

      // Update pieces
      pieces.forEach((piece, index) => {
        piece.y += (piece.speed * deltaTime) / 1000

        // Remove piece if it's out of bounds
        if (piece.y > rows) {
          pieces.splice(index, 1)
        }
      })

      // Draw grid and pieces
      drawGrid()
      pieces.forEach(drawPiece)

      // Continue animation
      animationRef.current = requestAnimationFrame(update)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(update)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [started])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
}

