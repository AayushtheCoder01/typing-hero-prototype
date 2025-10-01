import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { useContent } from '../../contexts/ContentContext'
import { usePerformance } from '../../contexts/PerformanceContext'
import { Upload, FileText, Trash2, Plus, Play, Pause, RotateCcw } from 'lucide-react'

const CustomText = ({ onShowAnalytics, onShowDetailedAnalytics }) => {
  const { theme } = useTheme()
  const { customTexts, addCustomText, removeCustomText } = useContent()
  const { updatePerformance } = usePerformance()
  
  // Text management
  const [selectedTextIndex, setSelectedTextIndex] = useState(0)
  const [customTextInput, setCustomTextInput] = useState('')
  const [showAddText, setShowAddText] = useState(false)
  const [textTitle, setTextTitle] = useState('')
  
  // Test state
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  
  // Performance metrics
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(0)
  
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Sample custom texts for demonstration
  const sampleTexts = [
    {
      title: "Programming Concepts",
      content: "Object-oriented programming is a programming paradigm based on the concept of objects, which can contain data and code: data in the form of fields, and code, in the form of procedures. A feature of objects is that an object's own procedures can access and often modify the data fields of itself."
    },
    {
      title: "Web Development",
      content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components. React components implement a render method that takes input data and returns what to display."
    }
  ]

  // Initialize with sample texts if no custom texts exist
  useEffect(() => {
    if (customTexts.length === 0) {
      sampleTexts.forEach(sample => addCustomText({ ...sample, id: Date.now() + Math.random() }))
    }
  }, [])

  // Set initial text
  useEffect(() => {
    const allTexts = [...customTexts, ...sampleTexts]
    if (allTexts.length > 0) {
      setText(allTexts[selectedTextIndex]?.content || allTexts[0]?.content || '')
    }
  }, [customTexts, selectedTextIndex])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isActive && !isPaused && !isComplete) {
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
  }, [isActive, isPaused, isComplete, startTime, userInput])

  // Global keyboard event handler for Tab key reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't interfere with text input areas
      if (showAddText && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return
      
      // Handle Tab key for auto-reset
      if (e.key === 'Tab') {
        e.preventDefault()
        
        // Reset the test
        resetTest()
        return
      }
      
      // Focus the hidden input if it's not already focused
      if (inputRef.current && document.activeElement !== inputRef.current && !showAddText) {
        inputRef.current.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showAddText])

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

    // Count correct and incorrect characters
    let correct = 0
    let incorrect = 0
    
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correct++
      } else {
        incorrect++
      }
    }
    
    setCorrectChars(correct)
    setIncorrectChars(incorrect)
    setErrors(incorrect)
    setAccuracy(value.length > 0 ? Math.round((correct / value.length) * 100) : 100)

    // Check completion
    if (value === text) {
      completeTest()
    }
  }, [text, isActive])

  // Complete test
  const completeTest = () => {
    setIsComplete(true)
    setIsActive(false)
    
    // Only save if user has made meaningful progress (at least 10 characters)
    const hasMinimumProgress = userInput.length >= 10
    
    const finalResults = {
      wpm,
      accuracy,
      errors,
      correctChars,
      incorrectChars,
      timeElapsed,
      totalCharacters: userInput.length,
      targetCharacters: text.length,
      mode: 'custom',
      textTitle: (customTexts[selectedTextIndex] || sampleTexts[selectedTextIndex])?.title || 'Custom Text',
      wasSkipped: !hasMinimumProgress
    }
    
    // Only save to dashboard if test has meaningful progress
    if (hasMinimumProgress) {
      updatePerformance(finalResults)
    }
    
    // Show analytics after a brief delay
    setTimeout(() => {
      onShowAnalytics(finalResults)
    }, 1500)
  }

  // Reset test
  const resetTest = () => {
    setUserInput('')
    setCurrentIndex(0)
    setStartTime(null)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setTimeElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCorrectChars(0)
    setIncorrectChars(0)
    inputRef.current?.focus()
  }

  // Toggle pause
  const togglePause = () => {
    if (isActive) {
      setIsPaused(!isPaused)
      if (isPaused) {
        // Resume - adjust start time
        setStartTime(Date.now() - timeElapsed * 1000)
      }
    }
  }

  // Add custom text
  const handleAddCustomText = () => {
    if (customTextInput.trim() && textTitle.trim()) {
      const newText = {
        id: Date.now(),
        title: textTitle.trim(),
        content: customTextInput.trim(),
        dateAdded: new Date().toISOString()
      }
      addCustomText(newText)
      setCustomTextInput('')
      setTextTitle('')
      setShowAddText(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        if (content.length > 50) {
          const newText = {
            id: Date.now(),
            title: file.name.replace('.txt', ''),
            content: content.substring(0, 2000), // Limit to 2000 characters
            dateAdded: new Date().toISOString()
          }
          addCustomText(newText)
        }
      }
      reader.readAsText(file)
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

  const allTexts = [...customTexts, ...sampleTexts]

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
            Custom Text Practice
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Practice with your own texts and documents
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowAddText(true)}
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            <span>Add Text</span>
          </motion.button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.accent,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload size={16} />
            <span>Upload File</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Text Selection */}
      <motion.div
        className="mb-6 p-4 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-3" style={{ color: theme.colors.text }}>
          Select Text to Practice
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allTexts.map((textItem, index) => (
            <motion.div
              key={textItem.id || index}
              onClick={() => {
                setSelectedTextIndex(index)
                setText(textItem.content)
                resetTest()
              }}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTextIndex === index ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: selectedTextIndex === index 
                  ? theme.colors.primary + '10' 
                  : theme.colors.background,
                borderColor: selectedTextIndex === index 
                  ? theme.colors.primary 
                  : theme.colors.border,
                ringColor: selectedTextIndex === index ? theme.colors.primary : 'transparent'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate" style={{ color: theme.colors.text }}>
                    {textItem.title}
                  </h4>
                  <p className="text-sm mt-1 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
                    {textItem.content.substring(0, 100)}...
                  </p>
                  <div className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>
                    {textItem.content.length} characters
                  </div>
                </div>
                
                {textItem.id && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCustomText(customTexts.findIndex(t => t.id === textItem.id))
                    }}
                    className="ml-2 p-1 rounded text-red-500 hover:bg-red-500/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Text Modal */}
      <AnimatePresence>
        {showAddText && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddText(false)}
          >
            <motion.div
              className="max-w-2xl w-full rounded-lg p-6"
              style={{ backgroundColor: theme.colors.surface }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Add Custom Text
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Text Title
                  </label>
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="Enter a title for your text..."
                    className="w-full p-3 rounded-lg border"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                    Text Content
                  </label>
                  <textarea
                    value={customTextInput}
                    onChange={(e) => setCustomTextInput(e.target.value)}
                    placeholder="Paste or type your custom text here..."
                    rows={8}
                    className="w-full p-3 rounded-lg border resize-none"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                  />
                  <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
                    {customTextInput.length} characters
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  onClick={() => setShowAddText(false)}
                  className="px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.background 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={handleAddCustomText}
                  disabled={!customTextInput.trim() || !textTitle.trim()}
                  className="px-4 py-2 rounded-lg disabled:opacity-50"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Text
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div 
        className="flex justify-between items-center mb-8 p-4 rounded-lg"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
        className="relative p-8 rounded-lg mb-6 text-xl leading-relaxed font-mono max-h-80 overflow-y-auto"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          opacity: isPaused ? 0.6 : 1
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isPaused ? 0.6 : 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
        disabled={isPaused || isComplete}
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
            ? "Select a text above and start typing to begin practice" 
            : isPaused 
            ? "Test is paused - click Resume to continue"
            : isComplete
            ? "Test completed! Analyzing results..."
            : "Keep typing to complete the text"
          }
        </p>
      </motion.div>

      <style jsx>{`
        .text-correct { color: ${theme.colors.correct}; }
        .text-incorrect { color: ${theme.colors.incorrect}; }
        .text-current { color: ${theme.colors.current}; }
        .text-muted { color: ${theme.colors.textMuted}; }
        .bg-caret { background-color: ${theme.colors.caret}; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default CustomText
