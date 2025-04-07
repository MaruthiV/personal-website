"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw, X } from "lucide-react"

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

// Game constants
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 30
const GAME_SPEED = 500 // ms per drop

interface TetrisGameProps {
  onClose: () => void
  onUnlock?: (score: number) => void
}

export default function TetrisGame({ onClose, onUnlock }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)

  // Game state
  const boardRef = useRef<number[][]>(
    Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0)),
  )
  const currentPieceRef = useRef<{
    shape: number[][]
    color: string
    x: number
    y: number
  } | null>(null)
  const gameSpeedRef = useRef(GAME_SPEED)
  const scoreRef = useRef(0)
  const levelRef = useRef(1)

  // Create a new piece
  const createPiece = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SHAPES.length)
    const { shape, color } = SHAPES[randomIndex]

    // Center the piece at the top of the board
    const x = Math.floor((COLS - shape[0].length) / 2)
    const y = 0

    currentPieceRef.current = { shape, color, x, y }

    // Check if the new piece can be placed
    if (!isValidMove(0, 0, shape)) {
      setGameOver(true)
    }
  }, [])

  // Check if a move is valid
  const isValidMove = useCallback((offsetX: number, offsetY: number, shape = currentPieceRef.current?.shape) => {
    if (!currentPieceRef.current || !shape) return false

    const { x, y } = currentPieceRef.current

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col + offsetX
          const newY = y + row + offsetY

          // Check boundaries
          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return false
          }

          // Check collision with existing blocks (but not if we're above the board)
          if (newY >= 0 && boardRef.current[newY][newX]) {
            return false
          }
        }
      }
    }

    return true
  }, [])

  // Move the current piece
  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!currentPieceRef.current || gameOver || paused) return

      if (isValidMove(dx, dy)) {
        currentPieceRef.current.x += dx
        currentPieceRef.current.y += dy
        return true
      }
      return false
    },
    [gameOver, isValidMove, paused],
  )

  // Rotate the current piece
  const rotatePiece = useCallback(() => {
    if (!currentPieceRef.current || gameOver || paused) return

    const { shape } = currentPieceRef.current

    // Create a new rotated shape
    const newShape = Array(shape[0].length)
      .fill(0)
      .map(() => Array(shape.length).fill(0))

    // Rotate 90 degrees clockwise
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        newShape[col][shape.length - 1 - row] = shape[row][col]
      }
    }

    // Check if the rotation is valid
    if (isValidMove(0, 0, newShape)) {
      currentPieceRef.current.shape = newShape
    } else {
      // Try wall kicks (move left or right if rotation is blocked)
      for (const offset of [-1, 1, -2, 2]) {
        if (isValidMove(offset, 0, newShape)) {
          currentPieceRef.current.x += offset
          currentPieceRef.current.shape = newShape
          break
        }
      }
    }
  }, [gameOver, isValidMove, paused])

  // Lock the current piece in place
  const lockPiece = useCallback(() => {
    if (!currentPieceRef.current) return

    const { shape, color, x, y } = currentPieceRef.current
    const colorIndex = SHAPES.findIndex((s) => s.color === color) + 1

    // Add the piece to the board
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardY = y + row
          const boardX = x + col

          if (boardY >= 0) {
            // Only add if it's on the board
            boardRef.current[boardY][boardX] = colorIndex
          }
        }
      }
    }

    // Check for completed lines
    let linesCleared = 0
    for (let row = ROWS - 1; row >= 0; row--) {
      if (boardRef.current[row].every((cell) => cell > 0)) {
        // Remove the line
        boardRef.current.splice(row, 1)
        // Add a new empty line at the top
        boardRef.current.unshift(Array(COLS).fill(0))
        linesCleared++
        row++ // Check the same row again
      }
    }

    // Update score
    if (linesCleared > 0) {
      const points = [0, 40, 100, 300, 1200][linesCleared] * levelRef.current
      scoreRef.current += points
      setScore(scoreRef.current)

      // Check for level up (every 10 lines)
      const newLevel = Math.floor(scoreRef.current / 1000) + 1
      if (newLevel > levelRef.current) {
        levelRef.current = newLevel
        setLevel(newLevel)
        gameSpeedRef.current = Math.max(100, GAME_SPEED - (newLevel - 1) * 50)

        // Unlock hidden content at certain scores
        if (onUnlock && scoreRef.current >= 2000) {
          onUnlock(scoreRef.current)
        }
      }
    }

    // Create a new piece
    createPiece()
  }, [createPiece, onUnlock])

  // Drop the piece faster
  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      lockPiece()
    }
  }, [lockPiece, movePiece])

  // Hard drop the piece
  const hardDrop = useCallback(() => {
    if (!currentPieceRef.current || gameOver || paused) return

    let dropDistance = 0
    while (isValidMove(0, dropDistance + 1)) {
      dropDistance++
    }

    if (dropDistance > 0) {
      currentPieceRef.current.y += dropDistance
      lockPiece()
    }
  }, [gameOver, isValidMove, lockPiece, paused])

  // Draw the game
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background grid
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE)

    // Draw grid lines
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    for (let row = 0; row < ROWS; row++) {
      ctx.beginPath()
      ctx.moveTo(0, row * BLOCK_SIZE)
      ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE)
      ctx.stroke()
    }

    for (let col = 0; col < COLS; col++) {
      ctx.beginPath()
      ctx.moveTo(col * BLOCK_SIZE, 0)
      ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE)
      ctx.stroke()
    }

    // Draw the board
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cellValue = boardRef.current[row][col]
        if (cellValue > 0) {
          const color = SHAPES[cellValue - 1].color
          drawBlock(ctx, col, row, color)
        }
      }
    }

    // Draw the current piece
    if (currentPieceRef.current && !gameOver) {
      const { shape, color, x, y } = currentPieceRef.current

      // Draw ghost piece (preview of where it will land)
      let ghostY = 0
      while (isValidMove(0, ghostY + 1)) {
        ghostY++
      }

      if (ghostY > 0) {
        ctx.globalAlpha = 0.3
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
              drawBlock(ctx, x + col, y + row + ghostY, color)
            }
          }
        }
        ctx.globalAlpha = 1
      }

      // Draw actual piece
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            drawBlock(ctx, x + col, y + row, color)
          }
        }
      }
    }

    // Draw game over or paused text
    if (gameOver || paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE)

      ctx.font = '20px "Press Start 2P"'
      ctx.fillStyle = "white"
      ctx.textAlign = "center"

      if (gameOver) {
        ctx.fillText("GAME OVER", (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2 - 30)
        ctx.fillText(`SCORE: ${scoreRef.current}`, (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2 + 10)
        ctx.font = '12px "Press Start 2P"'
        ctx.fillText("PRESS R TO RESTART", (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2 + 50)
      } else if (paused) {
        ctx.fillText("PAUSED", (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2)
        ctx.font = '12px "Press Start 2P"'
        ctx.fillText("PRESS P TO RESUME", (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2 + 40)
      }
    }
  }, [gameOver, isValidMove, paused])

  // Draw a single block
  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const borderWidth = 2

    // Main block
    ctx.fillStyle = color
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)

    // Highlight (top-left)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, borderWidth)
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, borderWidth, BLOCK_SIZE)

    // Shadow (bottom-right)
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.fillRect(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE - borderWidth, BLOCK_SIZE, borderWidth)
    ctx.fillRect((x + 1) * BLOCK_SIZE - borderWidth, y * BLOCK_SIZE, borderWidth, BLOCK_SIZE)
  }

  // Reset the game
  const resetGame = useCallback(() => {
    boardRef.current = Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0))
    scoreRef.current = 0
    setScore(0)
    levelRef.current = 1
    setLevel(1)
    gameSpeedRef.current = GAME_SPEED
    setGameOver(false)
    setPaused(false)
    createPiece()
  }, [createPiece])

  // Game loop
  useEffect(() => {
    if (!canvasRef.current) return

    // Set canvas size
    canvasRef.current.width = COLS * BLOCK_SIZE
    canvasRef.current.height = ROWS * BLOCK_SIZE

    // Start the game
    if (!currentPieceRef.current) {
      createPiece()
    }

    // Game loop
    let lastTime = 0
    let dropCounter = 0

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      if (!gameOver && !paused) {
        dropCounter += deltaTime

        if (dropCounter > gameSpeedRef.current) {
          dropPiece()
          dropCounter = 0
        }
      }

      draw()
      requestAnimationFrame(gameLoop)
    }

    const animationId = requestAnimationFrame(gameLoop)

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === "r" || e.key === "R") {
          resetGame()
        }
        return
      }

      if (e.key === "p" || e.key === "P") {
        setPaused(!paused)
        return
      }

      if (paused) return

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1, 0)
          break
        case "ArrowRight":
          movePiece(1, 0)
          break
        case "ArrowDown":
          dropPiece()
          break
        case "ArrowUp":
          rotatePiece()
          break
        case " ":
          hardDrop()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [createPiece, draw, dropPiece, gameOver, hardDrop, movePiece, paused, resetGame, rotatePiece])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 p-6 rounded-lg shadow-2xl border-2 border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-press-start text-white text-xl">TETRIS</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <canvas ref={canvasRef} className="border-4 border-gray-700 bg-gray-900" />

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-press-start text-gray-400 text-xs mb-2">SCORE</h3>
                <p className="font-press-start text-white text-xl">{score}</p>
              </div>

              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-press-start text-gray-400 text-xs mb-2">LEVEL</h3>
                <p className="font-press-start text-white text-xl">{level}</p>
              </div>

              <div className="bg-gray-800 p-4 rounded">
                <h3 className="font-press-start text-gray-400 text-xs mb-2">CONTROLS</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center">
                    <ChevronLeft className="h-4 w-4 text-white mr-2" />
                    <span className="text-white text-xs">Move Left</span>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-white mr-2" />
                    <span className="text-white text-xs">Move Right</span>
                  </div>
                  <div className="flex items-center">
                    <ChevronDown className="h-4 w-4 text-white mr-2" />
                    <span className="text-white text-xs">Move Down</span>
                  </div>
                  <div className="flex items-center">
                    <RotateCw className="h-4 w-4 text-white mr-2" />
                    <span className="text-white text-xs">Rotate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={resetGame}
                className="w-full font-press-start bg-purple-600 text-white px-4 py-2 text-sm rounded hover:bg-purple-700 transition-colors"
              >
                RESTART
              </button>
              <button
                onClick={() => setPaused(!paused)}
                className="w-full font-press-start bg-gray-700 text-white px-4 py-2 text-sm rounded hover:bg-gray-600 transition-colors"
              >
                {paused ? "RESUME" : "PAUSE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

