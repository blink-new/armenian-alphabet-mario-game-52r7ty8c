import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react'

// Armenian alphabet for our game
const ARMENIAN_LETTERS = [
  'Ա', 'Բ', 'Գ', 'Դ', 'Ե', 'Զ', 'Է', 'Ը', 'Թ', 'Ժ', 'Ի', 'Լ', 'Խ', 'Ծ', 'Կ',
  'Հ', 'Ձ', 'Ղ', 'Ճ', 'Մ', 'Յ', 'Ն', 'Շ', 'Ո', 'Չ', 'Պ', 'Ջ', 'Ռ', 'Ս', 'Վ',
  'Տ', 'Ր', 'Ց', 'Ւ', 'Փ', 'Ք', 'Օ', 'Ֆ'
]

interface GameState {
  isPlaying: boolean
  score: number
  lives: number
  level: number
  marioPosition: { x: number; y: number }
  isJumping: boolean
  letters: Array<{ id: number; letter: string; x: number; y: number; collected: boolean }>
  boss: { x: number; y: number; health: number; isActive: boolean }
  gameWon: boolean
  gameOver: boolean
}

function App() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    lives: 3,
    level: 1,
    marioPosition: { x: 50, y: 400 },
    isJumping: false,
    letters: [],
    boss: { x: 700, y: 400, health: 3, isActive: false },
    gameWon: false,
    gameOver: false
  })

  const initializeGame = useCallback(() => {
    // Generate random Armenian letters to collect
    const newLetters = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      letter: ARMENIAN_LETTERS[Math.floor(Math.random() * ARMENIAN_LETTERS.length)],
      x: 150 + i * 80,
      y: Math.random() > 0.5 ? 300 : 350,
      collected: false
    }))

    setGameState({
      isPlaying: true,
      score: 0,
      lives: 3,
      level: 1,
      marioPosition: { x: 50, y: 400 },
      isJumping: false,
      letters: newLetters,
      boss: { x: 700, y: 400, health: 3, isActive: false },
      gameWon: false,
      gameOver: false
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameWon: false,
      gameOver: false
    }))
  }, [])

  // Game controls
  useEffect(() => {
    if (!gameState.isPlaying) return

    const handleKeyPress = (e: KeyboardEvent) => {
      setGameState(prev => {
        const newState = { ...prev }
        
        switch (e.key) {
          case 'ArrowLeft':
            newState.marioPosition.x = Math.max(0, prev.marioPosition.x - 20)
            break
          case 'ArrowRight':
            newState.marioPosition.x = Math.min(750, prev.marioPosition.x + 20)
            break
          case ' ':
          case 'ArrowUp':
            if (!prev.isJumping) {
              newState.isJumping = true
              setTimeout(() => {
                setGameState(current => ({ ...current, isJumping: false }))
              }, 600)
            }
            break
        }
        
        return newState
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.isPlaying])

  // Game logic
  useEffect(() => {
    if (!gameState.isPlaying) return

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev }
        const mario = prev.marioPosition

        // Check letter collection
        prev.letters.forEach((letter, index) => {
          if (!letter.collected && 
              Math.abs(mario.x - letter.x) < 30 && 
              Math.abs(mario.y - letter.y) < 30) {
            newState.letters[index].collected = true
            newState.score += 100
          }
        })

        // Check if all letters collected - activate boss
        const allLettersCollected = newState.letters.every(letter => letter.collected)
        if (allLettersCollected && !newState.boss.isActive) {
          newState.boss.isActive = true
        }

        // Boss fight logic
        if (newState.boss.isActive) {
          // Simple boss movement
          newState.boss.x += Math.sin(Date.now() * 0.002) * 2
          
          // Check boss collision during jump
          if (prev.isJumping && 
              Math.abs(mario.x - newState.boss.x) < 40 && 
              Math.abs(mario.y - newState.boss.y) < 40) {
            newState.boss.health -= 1
            newState.score += 500
            
            if (newState.boss.health <= 0) {
              newState.gameWon = true
              newState.isPlaying = false
            }
          }
        }

        return newState
      })
    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameState.isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Armenian Alphabet Super Mario
          </h1>
          <p className="text-white/90 text-lg">
            Help Ճ collect letters and defeat the boss Չ!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <Badge className="bg-yellow-500 text-black text-lg px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            Score: {gameState.score}
          </Badge>
          <Badge className="bg-red-500 text-white text-lg px-4 py-2">
            <Heart className="w-4 h-4 mr-2" />
            Lives: {gameState.lives}
          </Badge>
          <Badge className="bg-purple-500 text-white text-lg px-4 py-2">
            Level: {gameState.level}
          </Badge>
        </div>

        {/* Game Area */}
        <Card className="relative h-96 overflow-hidden bg-gradient-to-b from-sky-300 to-green-300 border-4 border-brown-600">
          <div ref={gameAreaRef} className="relative w-full h-full">
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-12 bg-green-600 border-t-4 border-green-700"></div>
            
            {/* Platforms */}
            <div className="absolute bottom-20 left-32 w-24 h-4 bg-brown-600 rounded"></div>
            <div className="absolute bottom-32 left-64 w-24 h-4 bg-brown-600 rounded"></div>
            <div className="absolute bottom-20 right-32 w-24 h-4 bg-brown-600 rounded"></div>

            {gameState.isPlaying && (
              <>
                {/* Mario Character (Ճ) */}
                <motion.div
                  className="absolute text-6xl font-bold text-red-600 drop-shadow-lg select-none"
                  style={{
                    left: gameState.marioPosition.x,
                    bottom: gameState.isJumping ? 120 : 60
                  }}
                  animate={{
                    bottom: gameState.isJumping ? 120 : 60,
                    scale: gameState.isJumping ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Ճ
                </motion.div>

                {/* Collectible Letters */}
                <AnimatePresence>
                  {gameState.letters.map((letter) => (
                    !letter.collected && (
                      <motion.div
                        key={letter.id}
                        className="absolute text-3xl font-bold text-yellow-400 drop-shadow-lg select-none cursor-pointer"
                        style={{
                          left: letter.x,
                          bottom: letter.y
                        }}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        {letter.letter}
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>

                {/* Boss Character (Չ) */}
                {gameState.boss.isActive && (
                  <motion.div
                    className="absolute text-8xl font-bold text-red-800 drop-shadow-lg select-none"
                    style={{
                      left: gameState.boss.x,
                      bottom: 60
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Չ
                  </motion.div>
                )}
              </>
            )}

            {/* Start Screen */}
            {!gameState.isPlaying && !gameState.gameWon && !gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Card className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
                  <p className="text-gray-600 mb-6">
                    Use arrow keys to move and spacebar to jump!
                    <br />Collect Armenian letters and defeat boss Չ!
                  </p>
                  <Button onClick={initializeGame} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                </Card>
              </div>
            )}

            {/* Game Won */}
            {gameState.gameWon && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Card className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-yellow-600 mb-4">
                    🎉 Victory! 🎉
                  </h2>
                  <p className="text-lg mb-4">
                    You defeated boss Չ and learned the Armenian alphabet!
                  </p>
                  <p className="text-2xl font-bold text-green-600 mb-6">
                    Final Score: {gameState.score}
                  </p>
                  <Button onClick={resetGame} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Controls */}
        <div className="mt-6 text-center">
          <Card className="inline-block p-4">
            <h3 className="font-bold mb-2">Controls</h3>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>← → Move</span>
              <span>↑ / Space Jump</span>
              <span>Jump on Չ to damage</span>
            </div>
          </Card>
        </div>

        {/* Armenian Alphabet Reference */}
        <Card className="mt-6 p-4">
          <h3 className="font-bold text-center mb-3">Armenian Alphabet</h3>
          <div className="grid grid-cols-10 gap-2 text-center">
            {ARMENIAN_LETTERS.map((letter, index) => (
              <div key={index} className="text-2xl font-bold text-blue-600">
                {letter}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App