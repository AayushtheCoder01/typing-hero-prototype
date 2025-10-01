import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { useContent } from '../../contexts/ContentContext'
import { usePerformance } from '../../contexts/PerformanceContext'
import { Clock, Play, Pause, RotateCcw, Settings, BarChart3 } from 'lucide-react'

const TimedTest = ({ onShowAnalytics, onShowDetailedAnalytics }) => {
  const { theme } = useTheme()
  const { getRandomText, currentCategory, setCurrentCategory, contentLibrary } = useContent()
  const { updatePerformance } = usePerformance()
  
  // Test settings with localStorage persistence
  const [duration, setDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('timedTestSettings')
      return saved ? JSON.parse(saved).duration || 60 : 60
    } catch (error) {
      console.warn('Error loading duration from localStorage:', error)
      return 60
    }
  })
  const [contentType, setContentType] = useState(() => {
    try {
      const saved = localStorage.getItem('timedTestSettings')
      return saved ? JSON.parse(saved).contentType || 'mixed' : 'mixed'
    } catch (error) {
      console.warn('Error loading contentType from localStorage:', error)
      return 'mixed'
    }
  })
  const [includeNumbers, setIncludeNumbers] = useState(() => {
    try {
      const saved = localStorage.getItem('timedTestSettings')
      return saved ? JSON.parse(saved).includeNumbers !== false : true
    } catch (error) {
      console.warn('Error loading includeNumbers from localStorage:', error)
      return true
    }
  })
  const [includePunctuation, setIncludePunctuation] = useState(() => {
    try {
      const saved = localStorage.getItem('timedTestSettings')
      return saved ? JSON.parse(saved).includePunctuation !== false : true
    } catch (error) {
      console.warn('Error loading includePunctuation from localStorage:', error)
      return true
    }
  })
  const [includeCapitals, setIncludeCapitals] = useState(() => {
    try {
      const saved = localStorage.getItem('timedTestSettings')
      return saved ? JSON.parse(saved).includeCapitals !== false : true
    } catch (error) {
      console.warn('Error loading includeCapitals from localStorage:', error)
      return true
    }
  })
  const [showSettings, setShowSettings] = useState(false)
  
  // Test state
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This is a sample text for typing practice.')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState(null)
  
  // Performance metrics
  const [wpm, setWpm] = useState(0)
  const [rawWpm, setRawWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(0)
  const [testResults, setTestResults] = useState(null)
  const [showQuickResults, setShowQuickResults] = useState(false)
  
  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    try {
      const settings = {
        duration,
        contentType,
        includeNumbers,
        includePunctuation,
        includeCapitals
      }
      localStorage.setItem('timedTestSettings', JSON.stringify(settings))
    } catch (error) {
      console.warn('Error saving settings to localStorage:', error)
    }
  }, [duration, contentType, includeNumbers, includePunctuation, includeCapitals])

  // Save settings whenever they change
  useEffect(() => {
    saveSettings()
  }, [saveSettings])

  // Duration options
  const durationOptions = [15, 30, 60, 120, 300] // seconds

  // Content type options
  const contentTypes = {
    mixed: 'Mixed Content',
    words: 'Common Words',
    numbers: 'Numbers Only',
    punctuation: 'With Punctuation',
    programming: 'Programming',
    quotes: 'Famous Quotes'
  }

  // Generate test text based on settings
  const generateTestText = useCallback(() => {
    let baseText = ''
    try {
      switch (contentType) {
        case 'numbers':
          baseText = generateNumberText()
          break
        case 'programming':
          baseText = contentLibrary?.programming?.length > 0 
            ? contentLibrary.programming[Math.floor(Math.random() * contentLibrary.programming.length)]
            : generateCommonWords()
          break
        case 'quotes':
          baseText = contentLibrary?.quotes?.length > 0
            ? contentLibrary.quotes[Math.floor(Math.random() * contentLibrary.quotes.length)]
            : generateCommonWords()
          break
        case 'words':
          baseText = generateCommonWords()
          break
        default:
          try {
            baseText = getRandomText() || generateCommonWords()
          } catch (err) {
            console.warn('getRandomText failed, using fallback:', err)
            baseText = generateCommonWords()
          }
      }
    } catch (error) {
      console.warn('Error generating text, using fallback:', error)
      baseText = generateCommonWords()
    }
    
    // Fallback if baseText is empty
    if (!baseText || baseText.trim().length === 0) {
      console.warn('Generated text is empty, using fallback')
      baseText = generateCommonWords()
    }
    
    // Apply modifiers safely
    try {
      if (!includeNumbers) {
        baseText = baseText.replace(/\d/g, '')
      }
      if (!includePunctuation) {
        baseText = baseText.replace(/[^\w\s]/g, '')
      }
      if (!includeCapitals) {
        baseText = baseText.toLowerCase()
      }
      
      // Clean up any double spaces
      baseText = baseText.replace(/\s+/g, ' ').trim()
      
      // Ensure minimum length by repeating the base text
      if (baseText.length < 500) {
        const repeatText = baseText.substring(0, Math.min(100, baseText.length))
        while (baseText.length < 500 && repeatText.length > 0) {
          baseText += ' ' + repeatText
        }
      }
    } catch (error) {
      console.warn('Error applying modifiers, using simple fallback:', error)
      baseText = generateCommonWords()
    }
    
    return baseText.trim() || generateCommonWords()
  }, [contentType, includeNumbers, includePunctuation, includeCapitals, getRandomText, contentLibrary])

  const generateNumberText = () => {
    const numbers = []
    for (let i = 0; i < 100; i++) {
      numbers.push(Math.floor(Math.random() * 10000))
    }
    return numbers.join(' ')
  }

  const generatePunctuationText = () => {
    const sentences = [
      "Hello, world! How are you today?",
      "It's a beautiful day; isn't it amazing?",
      "The quick brown fox jumps over the lazy dog.",
      "Programming is fun: variables, functions, and objects!",
      "Don't forget to use proper punctuation marks.",
      "What time is it? It's 3:45 PM on a Tuesday.",
      "She said, \"This is incredible!\" with excitement.",
      "The price is $19.99 (including tax & shipping)."
    ]
    return sentences.join(' ').repeat(10)
  }
  const generateCommonWords = () => {
    const words = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will',
      'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
      'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
      'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into',
      'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
      'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
      'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
      'most', 'us'
    ]
    const result = []
    for (let i = 0; i < 150; i++) {
      result.push(words[Math.floor(Math.random() * words.length)])
    }
    return result.join(' ')
  }

  // Reset test - defined early to avoid hoisting issues
  const resetTest = useCallback(() => {
    setUserInput('')
    setCurrentIndex(0)
    setTimeLeft(duration)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setStartTime(null)
    setWpm(0)
    setRawWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCorrectChars(0)
    setIncorrectChars(0)
    setTestResults(null)
    setShowQuickResults(false)
    setText(generateTestText())
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [duration, generateTestText])

  // Initialize test
  useEffect(() => {
    try {
      console.log('Initializing test with duration:', duration, 'contentType:', contentType)
      const newText = generateTestText()
      console.log('Generated text length:', newText?.length)
      if (newText && newText.length > 0) {
        setText(newText)
      } else {
        // Fallback text if generation fails
        console.warn('Using fallback text due to empty generation')
        setText(generateCommonWords())
      }
    } catch (error) {
      console.error('Error initializing test:', error)
      setText(generateCommonWords())
    }
    setTimeLeft(duration)
  }, [duration, generateTestText, contentType])

  // Focus input on mount and when settings change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Refocus input when settings panel is closed
  useEffect(() => {
    if (!showSettings && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [showSettings])

  // Global keyboard event handler to ensure input focus and handle Tab key
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't interfere with settings panel inputs
      if (showSettings) return
      
      // Handle Tab key for auto-reset
      if (e.key === 'Tab') {
        e.preventDefault()
        
        // If test is complete or results are showing, reset the test
        if (isComplete || showQuickResults) {
          setShowQuickResults(false)
          resetTest()
          return
        }
        
        // If test is active or paused, reset the test
        if (isActive || isPaused) {
          resetTest()
          return
        }
        
        // If test hasn't started, reset anyway to regenerate text
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
  }, [showSettings, isComplete, showQuickResults, isActive, isPaused, resetTest])

  // Ensure we have text on component mount
  useEffect(() => {
    if (!text || text.length === 0) {
      setText(generateCommonWords())
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, isPaused, timeLeft])

  // Calculate metrics in real-time
  useEffect(() => {
    if (isActive && userInput.length > 0) {
      const timeElapsed = (duration - timeLeft) || 1
      const minutes = timeElapsed / 60
      
      // Count correct and incorrect characters
      let correct = 0
      let incorrect = 0
      
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === text[i]) {
          correct++
        } else {
          incorrect++
        }
      }
      
      setCorrectChars(correct)
      setIncorrectChars(incorrect)
      setErrors(incorrect)
      setAccuracy(userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100)
      
      // Calculate WPM (words per minute)
      const wordsTyped = correct / 5 // Standard: 5 characters = 1 word
      const rawWordsTyped = userInput.length / 5
      
      setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
      setRawWpm(minutes > 0 ? Math.round(rawWordsTyped / minutes) : 0)
    }
  }, [userInput, timeLeft, duration, text, isActive])

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    
    // Start test on first keystroke
    if (!isActive && value.length === 1) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    // Prevent typing beyond text length
    if (value.length > text.length) {
      completeTest()
      return
    }

    setUserInput(value)
    setCurrentIndex(value.length)

    // Check if all text is completed
    if (value === text) {
      completeTest()
    }
  }, [text, isActive])

  // Complete test
  const completeTest = () => {
    setIsActive(false)
    setIsComplete(true)
    clearInterval(intervalRef.current)
    
    const timeElapsed = duration - timeLeft
    
    // Only save test if user has made meaningful progress
    // Criteria: typed at least 10 characters OR spent at least 10 seconds
    const hasMinimumProgress = userInput.length >= 10 || timeElapsed >= 10
    
    const finalResults = {
      wpm,
      rawWpm,
      accuracy,
      errors,
      correctChars,
      incorrectChars,
      timeElapsed,
      totalCharacters: userInput.length,
      targetCharacters: text.length,
      mode: 'timed',
      duration,
      contentType,
      settings: {
        includeNumbers,
        includePunctuation,
        includeCapitals
      },
      // Additional data for detailed analytics
      startTime,
      endTime: Date.now(),
      testText: text.substring(0, userInput.length),
      userText: userInput,
      keystrokesPerMinute: Math.round((userInput.length / (timeElapsed || 1)) * 60),
      correctKeystrokesPerMinute: Math.round((correctChars / (timeElapsed || 1)) * 60),
      errorRate: userInput.length > 0 ? (errors / userInput.length) * 100 : 0,
      consistency: userInput.length > 0 ? Math.max(0, 100 - (errors / userInput.length * 100 * 2)) : 0,
      efficiency: Math.round((wpm * accuracy) / 100),
      wasSkipped: !hasMinimumProgress
    }
    
    setTestResults(finalResults)
    
    // Only save to dashboard if test has meaningful progress
    if (hasMinimumProgress) {
      updatePerformance(finalResults)
    }
    
    // Show quick results immediately
    setShowQuickResults(true)
  }


  // Toggle pause
  const togglePause = () => {
    if (isActive) {
      setIsPaused(!isPaused)
    }
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
            className="absolute top-0 left-0 w-0.5 h-full bg-caret"
            animate={{ opacity: isPaused ? 0.3 : [1, 0, 1] }}
            transition={{ duration: isPaused ? 0 : 1, repeat: isPaused ? 0 : Infinity }}
            style={{ backgroundColor: theme.colors.caret }}
          />
        )}
      </motion.span>
    )
  }

  // Show loading state if no text is available
  if (!text || text.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                 style={{ borderColor: theme.colors.primary }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: theme.colors.text }}>
              Loading Timed Test
            </h2>
            <p style={{ color: theme.colors.textSecondary }}>
              Preparing your typing test...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="max-w-5xl mx-auto p-6"
      onClick={() => {
        if (inputRef.current && !showSettings) {
          inputRef.current.focus()
        }
      }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
            Timed Test
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Test your typing speed with time pressure
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
            className="mb-6 p-6 rounded-lg"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
              Test Settings
            </h3>
            
            {/* Duration Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                Test Duration
              </label>
              <div className="flex space-x-2">
                {durationOptions.map((dur) => (
                  <motion.button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      duration === dur ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: duration === dur 
                        ? theme.colors.primary + '20' 
                        : theme.colors.background,
                      color: duration === dur 
                        ? theme.colors.primary 
                        : theme.colors.textSecondary,
                      ringColor: duration === dur ? theme.colors.primary : 'transparent'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {dur < 60 ? `${dur}s` : `${dur / 60}m`}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                Content Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(contentTypes).map(([key, label]) => (
                  <motion.button
                    key={key}
                    onClick={() => setContentType(key)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      contentType === key ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: contentType === key 
                        ? theme.colors.primary + '20' 
                        : theme.colors.background,
                      color: contentType === key 
                        ? theme.colors.primary 
                        : theme.colors.textSecondary,
                      ringColor: contentType === key ? theme.colors.primary : 'transparent'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Modifiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded"
                />
                <span style={{ color: theme.colors.textSecondary }}>Include Numbers</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includePunctuation}
                  onChange={(e) => setIncludePunctuation(e.target.checked)}
                  className="rounded"
                />
                <span style={{ color: theme.colors.textSecondary }}>Include Punctuation</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeCapitals}
                  onChange={(e) => setIncludeCapitals(e.target.checked)}
                  className="rounded"
                />
                <span style={{ color: theme.colors.textSecondary }}>Include Capitals</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer and Stats */}
      <motion.div 
        className="flex justify-between items-center mb-8 p-6 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: timeLeft <= 10 ? theme.colors.incorrect : theme.colors.primary }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm" style={{ color: theme.colors.textMuted }}>Time Left</div>
          </div>
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
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Text Display */}
      <motion.div
        className="relative p-8 rounded-lg mb-6 text-xl leading-relaxed font-mono max-h-64 overflow-y-auto cursor-text"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          opacity: isPaused ? 0.6 : 1
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isPaused ? 0.6 : 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }}
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
        className="fixed top-0 left-0 opacity-0 w-1 h-1 border-none outline-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        disabled={isPaused || isComplete}
        style={{ zIndex: -1 }}
      />

      {/* Instructions */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p style={{ color: theme.colors.textMuted }}>
          {!isActive 
            ? "Click here and start typing to begin the timed test" 
            : isPaused 
            ? "Test is paused - click Resume to continue"
            : isComplete
            ? "Test completed! Analyzing results..."
            : `Keep typing! ${timeLeft} seconds remaining`
          }
        </p>
        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
          Press <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text
          }}>Tab</kbd> to reset test at any time
        </p>
      </motion.div>

      {/* Quick Results Modal */}
      {showQuickResults && testResults && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowQuickResults(false)}
        >
          <motion.div
            className="max-w-md w-full rounded-2xl p-6"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                Test Complete!
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>
                Here's how you performed
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.primary }}>
                  {testResults.wpm}
                </div>
                <div className="text-sm" style={{ color: theme.colors.textMuted }}>WPM</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.correct }}>
                  {testResults.accuracy}%
                </div>
                <div className="text-sm" style={{ color: theme.colors.textMuted }}>Accuracy</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Time</span>
                <span style={{ color: theme.colors.text }}>{testResults.timeElapsed?.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Errors</span>
                <span style={{ color: theme.colors.incorrect }}>{testResults.errors}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Characters</span>
                <span style={{ color: theme.colors.text }}>{testResults.totalCharacters}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                onClick={() => {
                  setShowQuickResults(false)
                  onShowAnalytics(testResults)
                }}
                className="flex-1 py-3 px-4 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Analytics
              </motion.button>
              
              {onShowDetailedAnalytics && (
                <motion.button
                  onClick={() => {
                    setShowQuickResults(false)
                    onShowDetailedAnalytics(testResults)
                  }}
                  className="flex-1 py-3 px-4 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: theme.colors.secondary + '20',
                    color: theme.colors.secondary 
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Detailed View
                </motion.button>
              )}
              
              <motion.button
                onClick={() => {
                  setShowQuickResults(false)
                  resetTest()
                }}
                className="px-4 py-3 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.colors.accent + '20',
                  color: theme.colors.accent 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

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

export default TimedTest
