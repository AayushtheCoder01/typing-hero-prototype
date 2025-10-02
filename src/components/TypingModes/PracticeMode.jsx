import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { useContent } from '../../contexts/ContentContext'
import { usePerformance } from '../../contexts/PerformanceContext'
import { RefreshCw, Settings, Play, Pause } from 'lucide-react'

const PracticeMode = ({ onShowAnalytics, onShowDetailedAnalytics }) => {
  const { theme } = useTheme()
  const { getRandomText, currentCategory, setCurrentCategory, contentLibrary } = useContent()
  const { updatePerformance } = usePerformance()
  
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errors, setErrors] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [testResults, setTestResults] = useState(null)
  
  const inputRef = useRef(null)
  const textRef = useRef(null)

  // Initialize with random text
  useEffect(() => {
    try {
      const randomText = getRandomText()
      if (randomText && randomText.length > 0) {
        setText(randomText)
      } else {
        setText('The quick brown fox jumps over the lazy dog.')
      }
    } catch (error) {
      console.warn('Error getting random text:', error)
      setText('The quick brown fox jumps over the lazy dog.')
    }
  }, [currentCategory, getRandomText])

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Global keyboard event handler for Tab key reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't interfere with settings panel
      if (showSettings) return
      
      // Handle Tab key for auto-reset
      if (e.key === 'Tab') {
        e.preventDefault()

        // Reset regardless of completion state
        resetTest()
        return
      }

      // Focus the hidden input if it's not already focused
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isActive && !isPaused && !isComplete) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setTimeElapsed(elapsed)
        
        // Calculate WPM (words per minute)
        const wordsTyped = userInput.trim().split(' ').length
        const minutes = elapsed / 60
        setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isActive, isPaused, isComplete, startTime, userInput])

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
      
      // Only save if user has made meaningful progress (at least 10 characters)
      const hasMinimumProgress = value.length >= 10
      
      const finalResults = {
        wpm,
        accuracy: Math.round(((value.length - errorCount) / value.length) * 100),
        errors: errorCount,
        correctChars: value.length - errorCount,
        incorrectChars: errorCount,
        timeElapsed,
        totalCharacters: text.length,
        targetCharacters: text.length,
        mode: 'practice',
        contentType: currentCategory || 'mixed',
        startTime: startTime,
        endTime: Date.now(),
        wasSkipped: !hasMinimumProgress
      }
      
      setTestResults(finalResults)
      
      // Only save to dashboard if test has meaningful progress
      if (hasMinimumProgress) {
        updatePerformance(finalResults)
      }

      if (onShowDetailedAnalytics) {
        onShowDetailedAnalytics(finalResults)
      }
    }
  }, [
    text,
    isActive,
    wpm,
    timeElapsed,
    updatePerformance,
    currentCategory,
    startTime,
    onShowDetailedAnalytics
  ])

  // Reset test
  const resetTest = () => {
    setUserInput('')
    setCurrentIndex(0)
    setStartTime(null)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setTimeElapsed(0)
    setTestResults(null)
    inputRef.current?.focus()
  }

  // Generate new text
  const generateNewText = () => {
    setText(getRandomText())
    resetTest()
  }

  // Pause/Resume
  const togglePause = () => {
    if (isActive) {
      setIsPaused(!isPaused)
      if (isPaused) {
        // Resume - adjust start time
        setStartTime(Date.now() - timeElapsed * 1000)
      }
    }
  }

  // Render character with styling
  const renderCharacter = (char, index) => {
    let className = 'relative inline-block transition-all duration-150'
    let bgColor = 'transparent'
    let color = theme.colors.textMuted
    
    if (index < userInput.length) {
      if (userInput[index] === char) {
        bgColor = theme.colors.correct + '20'
        color = theme.colors.correct
      } else {
        bgColor = theme.colors.incorrect + '20'
        color = theme.colors.incorrect
      }
    } else if (index === currentIndex) {
      bgColor = theme.colors.current + '20'
      color = theme.colors.current
    }

    return (
      <motion.span
        key={index}
        className={className}
        style={{ backgroundColor: bgColor, color }}
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
            className="absolute top-0 left-0 w-0.5 h-full bg-caret"
            animate={{ opacity: isPaused ? 0.3 : [1, 0, 1] }}
            transition={{ duration: isPaused ? 0 : 1, repeat: isPaused ? 0 : Infinity }}
            style={{ backgroundColor: theme.colors.caret }}
          />
        )}
      </motion.span>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
            Practice Mode
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Improve your typing with customizable content
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.secondary + '20',
              color: theme.colors.secondary 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="mb-6 p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
              Content Settings
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(contentLibrary).map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setCurrentCategory(category)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    currentCategory === category ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: currentCategory === category 
                      ? theme.colors.primary + '20' 
                      : theme.colors.background,
                    color: currentCategory === category 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                    ringColor: currentCategory === category ? theme.colors.primary : 'transparent'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div 
        className="flex justify-between items-center mb-8 p-4 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
          {isActive && (
            <motion.button
              onClick={togglePause}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              style={{ 
                backgroundColor: theme.colors.secondary,
                color: theme.colors.background 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </motion.button>
          )}
          
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
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.accent,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            <span>New Text</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Text Display */}
      <motion.div
        ref={textRef}
        className="relative p-8 rounded-lg mb-6 text-xl leading-relaxed font-mono"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          opacity: isPaused ? 0.6 : 1
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isPaused ? 0.6 : 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {text.split('').map((char, index) => renderCharacter(char, index))}
        
        {isPaused && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <Pause size={48} style={{ color: theme.colors.primary }} className="mx-auto mb-2" />
              <p className="text-lg font-medium" style={{ color: theme.colors.text }}>
                Test Paused
              </p>
            </div>
          </motion.div>
        )}
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
        disabled={isPaused}
      />

      {/* Instructions */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p style={{ color: theme.colors.textMuted }}>
          {!isActive 
            ? "Click here and start typing to begin the test" 
            : isPaused 
            ? "Test is paused - click Resume to continue"
            : isComplete
            ? "Sentence completed! Great job!"
            : "Keep typing to complete the test"
          }
        </p>
        <p className="text-xs mt-2" style={{ color: theme.colors.textSecondary }}>
          Press <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text
          }}>Tab</kbd> to reset at any time
        </p>
      </motion.div>

    </div>
  )
}

export default PracticeMode
