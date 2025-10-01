import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires patience, logic, and creativity.",
  "In the midst of winter, I found there was, within me, an invincible summer. And that makes me happy. For it says that no matter how hard the world pushes against me, within me, there's something stronger.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it."
]

const TypingTest = () => {
  const { theme } = useTheme()
  const [text, setText] = useState(sampleTexts[0])
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errors, setErrors] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  const inputRef = useRef(null)
  const caretRef = useRef(null)

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setTimeElapsed(elapsed)
        
        // Calculate WPM
        const wordsTyped = userInput.trim().split(' ').length
        const minutes = elapsed / 60
        setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isActive, isComplete, startTime, userInput])

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    
    // Start timer on first keystroke
    if (!isActive && value.length === 1) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    // Prevent typing beyond text length
    if (value.length > text.length) return

    setUserInput(value)
    setCurrentIndex(value.length)

    // Count errors
    let errorCount = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)
    setAccuracy(value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100)

    // Check completion
    if (value === text) {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [text, isActive])

  // Reset test
  const resetTest = () => {
    setUserInput('')
    setCurrentIndex(0)
    setStartTime(null)
    setIsActive(false)
    setIsComplete(false)
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setTimeElapsed(0)
    inputRef.current?.focus()
  }

  // Generate new text
  const generateNewText = () => {
    const newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    setText(newText)
    resetTest()
  }

  // Render character with styling
  const renderCharacter = (char, index) => {
    let className = 'relative inline-block transition-all duration-150'
    let bgColor = 'transparent'
    
    if (index < userInput.length) {
      if (userInput[index] === char) {
        className += ' text-correct'
        bgColor = theme.colors.correct + '20'
      } else {
        className += ' text-incorrect bg-incorrect/20'
        bgColor = theme.colors.incorrect + '20'
      }
    } else if (index === currentIndex) {
      className += ' text-current'
      bgColor = theme.colors.current + '20'
    } else {
      className += ' text-muted'
    }

    return (
      <motion.span
        key={index}
        className={className}
        style={{ backgroundColor: bgColor }}
        initial={{ opacity: 0.7 }}
        animate={{ 
          opacity: index <= currentIndex ? 1 : 0.7,
          scale: index === currentIndex ? 1.05 : 1
        }}
        transition={{ duration: 0.1 }}
      >
        {char === ' ' ? '\u00A0' : char}
        {index === currentIndex && (
          <motion.div
            ref={caretRef}
            className="absolute top-0 left-0 w-0.5 h-full bg-caret"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ backgroundColor: theme.colors.caret }}
          />
        )}
      </motion.span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stats Bar */}
      <motion.div 
        className="flex justify-between items-center mb-8 p-4 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
              {wpm}
            </div>
            <div className="text-sm" style={{ color: theme.colors.textMuted }}>WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme.colors.accent }}>
              {accuracy}%
            </div>
            <div className="text-sm" style={{ color: theme.colors.textMuted }}>Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme.colors.secondary }}>
              {timeElapsed.toFixed(1)}s
            </div>
            <div className="text-sm" style={{ color: theme.colors.textMuted }}>Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: theme.colors.incorrect }}>
              {errors}
            </div>
            <div className="text-sm" style={{ color: theme.colors.textMuted }}>Errors</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={resetTest}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
          <motion.button
            onClick={generateNewText}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{ 
              backgroundColor: theme.colors.accent,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            New Text
          </motion.button>
        </div>
      </motion.div>

      {/* Text Display */}
      <motion.div
        className="relative p-8 rounded-lg mb-6 text-xl leading-relaxed font-mono"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {text.split('').map((char, index) => renderCharacter(char, index))}
      </motion.div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Completion Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="p-8 rounded-lg max-w-md w-full mx-4"
              style={{ backgroundColor: theme.colors.surface }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Test Complete! 🎉
              </h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>WPM:</span>
                  <span className="font-bold" style={{ color: theme.colors.primary }}>{wpm}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Accuracy:</span>
                  <span className="font-bold" style={{ color: theme.colors.accent }}>{accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Time:</span>
                  <span className="font-bold" style={{ color: theme.colors.secondary }}>{timeElapsed.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Errors:</span>
                  <span className="font-bold" style={{ color: theme.colors.incorrect }}>{errors}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={resetTest}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background 
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
                <motion.button
                  onClick={generateNewText}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.background 
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  New Text
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p style={{ color: theme.colors.textMuted }}>
          Click here and start typing to begin the test
        </p>
      </motion.div>

      <style jsx>{`
        .text-correct { color: ${theme.colors.correct}; }
        .text-incorrect { color: ${theme.colors.incorrect}; }
        .text-current { color: ${theme.colors.current}; }
        .text-muted { color: ${theme.colors.textMuted}; }
        .bg-caret { background-color: ${theme.colors.caret}; }
      `}</style>
    </div>
  )
}

export default TypingTest
