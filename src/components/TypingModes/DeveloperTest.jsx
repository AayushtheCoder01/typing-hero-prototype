import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { usePerformance } from '../../contexts/PerformanceContext'
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  Code2,
  Lightbulb
} from 'lucide-react'

const developerSnippets = {
  javascript: {
    label: 'JavaScript',
    description: 'Modern syntax, helper functions, and async basics',
    difficulties: {
      beginner: [
        {
          title: 'Map and Log',
          description: 'Duplicate values and print them.',
          code: [
            'const nums = [1, 2, 3]',
            'const doubled = nums.map(n => n * 2)',
            'for (const value of doubled) {',
            '  console.log(value)',
            '}'
          ].join('\n'),
          concepts: ['Array.map', 'Loops'],
          hints: [
            'Remember arrow function parentheses.',
            'Use const for immutable references.'
          ]
        },
        {
          title: 'Template Greeting',
          description: 'Return a templated greeting string.',
          code: [
            'function greet(name) {',
            '  return `Hi ${name}!`',
            '}',
            'console.log(greet("dev"))'
          ].join('\n'),
          concepts: ['Template literals', 'Functions'],
          hints: [
            'Backticks enable interpolation.',
            'Match braces around expressions.'
          ]
        },
        {
          title: 'Default URL',
          description: 'Set fallback parameters.',
          code: [
            'function buildUrl(path = "/") {',
            '  return `https://api.dev${path}`',
            '}',
            'console.log(buildUrl())'
          ].join('\n'),
          concepts: ['Default parameters', 'Template literals'],
          hints: [
            'Provide defaults in the parameter list.',
            'Return the computed string directly.'
          ]
        }
      ],
      intermediate: [
        {
          title: 'Reducer Counter',
          description: 'Handle basic reducer actions.',
          code: [
            'const reducer = (state, action) => {',
            '  if (action === "inc") return state + 1',
            '  if (action === "dec") return state - 1',
            '  return state',
            '}'
          ].join('\n'),
          concepts: ['Reducers', 'Pure functions'],
          hints: [
            'Return new state each time.',
            'Use strict equality for action types.'
          ]
        },
        {
          title: 'Simple Fetch',
          description: 'Await a JSON payload.',
          code: [
            'async function loadTodo() {',
            '  const res = await fetch("/api/todo")',
            '  return res.json()',
            '}',
            'loadTodo()'
          ].join('\n'),
          concepts: ['Async/await', 'fetch'],
          hints: [
            'Await both fetch and json.',
            'Return the parsed promise.'
          ]
        },
        {
          title: 'Array Reduce Sum',
          description: 'Sum numbers with reduce.',
          code: [
            'const total = [1, 2, 3].reduce((sum, value) => sum + value, 0)',
            'console.log(total)'
          ].join('\n'),
          concepts: ['Array.reduce', 'Arrow functions'],
          hints: [
            'Provide an initial accumulator.',
            'Return the updated sum each step.'
          ]
        }
      ],
      advanced: [
        {
          title: 'Promise Pool',
          description: 'Run jobs with a limit.',
          code: [
            'export async function run(jobs) {',
            '  const [first, ...rest] = jobs',
            '  const head = await first()',
            '  return Promise.all(rest.map(job => job(head)))',
            '}'
          ].join('\n'),
          concepts: ['Promises', 'Await'],
          hints: [
            'Destructure arrays carefully.',
            'Return the combined promise.'
          ]
        },
        {
          title: 'Memo Utility',
          description: 'Cache results by key.',
          code: [
            'const memo = fn => {',
            '  const cache = new Map()',
            '  return key => cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key)',
            '}',
            'export default memo'
          ].join('\n'),
          concepts: ['Closures', 'Maps'],
          hints: [
            'Initialize Map once.',
            'Leverage the ternary for lookup.'
          ]
        }
      ]
    }
  },
  python: {
    label: 'Python',
    description: 'Comprehensions, dataclasses, and async helpers',
    difficulties: {
      beginner: [
        {
          title: 'Normalize Scores',
          description: 'Scale numbers to percentages.',
          code: [
            'def normalize(values):',
            '    total = sum(values)',
            '    return [v / total for v in values]',
            '',
            'print(normalize([2, 3, 5]))'
          ].join('\n'),
          concepts: ['Comprehensions', 'Lists'],
          hints: [
            'Guard against zero totals.',
            'Use consistent indentation.'
          ]
        },
        {
          title: 'Greeting F-string',
          description: 'Format f-strings cleanly.',
          code: [
            'def greet(name):',
            '    return f"Hello {name}!"',
            '',
            'print(greet("dev"))'
          ].join('\n'),
          concepts: ['f-strings', 'Functions'],
          hints: [
            'Prefix with f before quotes.',
            'Return a value from the function.'
          ]
        },
        {
          title: 'Dict Default',
          description: 'Pull values with fallbacks.',
          code: [
            'def get_port(settings):',
            '    return settings.get("port", 8080)',
            '',
            'print(get_port({}))'
          ].join('\n'),
          concepts: ['Dictionaries', 'Defaults'],
          hints: [
            'Use dict.get to provide fallback.',
            'Return the computed value.'
          ]
        }
      ],
      intermediate: [
        {
          title: 'Dataclass Note',
          description: 'Expose computed properties.',
          code: [
            'from dataclasses import dataclass',
            '',
            '@dataclass',
            'class Note:',
            '    body: str',
            '',
            '    def words(self):',
            '        return self.body.split()'
          ].join('\n'),
          concepts: ['Dataclasses', 'Methods'],
          hints: [
            'Decorators sit above classes.',
            'Use self within methods.'
          ]
        },
        {
          title: 'Async Sleep',
          description: 'Await inside a coroutine.',
          code: [
            'import asyncio',
            '',
            'async def ping():',
            '    await asyncio.sleep(0.1)',
            '    return "pong"'
          ].join('\n'),
          concepts: ['Asyncio', 'Coroutines'],
          hints: [
            'Mark coroutine with async def.',
            'Use await for sleep.'
          ]
        },
        {
          title: 'Chunk Builder',
          description: 'Group items into fixed sizes.',
          code: [
            'def chunk(items, size=2):',
            '    return [items[i:i + size] for i in range(0, len(items), size)]',
            '',
            'print(chunk([1, 2, 3, 4]))'
          ].join('\n'),
          concepts: ['List slicing', 'Comprehensions'],
          hints: [
            'Step through the list with range.',
            'Return the full sliced list.'
          ]
        }
      ],
      advanced: [
        {
          title: 'Context Timer',
          description: 'Time a block using contextlib.',
          code: [
            'from contextlib import contextmanager',
            'from time import perf_counter',
            '@contextmanager',
            'def timer():',
            '    start = perf_counter()',
            '    try:',
            '        yield',
            '    finally:',
            '        print(perf_counter() - start)'
          ].join('\n'),
          concepts: ['Context managers', 'Timing'],
          hints: [
            'Yield inside the try block.',
            'Print elapsed on exit.'
          ]
        },
        {
          title: 'Async Gather',
          description: 'Run tasks concurrently.',
          code: [
            'import asyncio',
            '',
            'async def main():',
            '    await asyncio.gather(asyncio.sleep(0.1), asyncio.sleep(0.2))',
            '',
            'asyncio.run(main())'
          ].join('\n'),
          concepts: ['Gather', 'Async run'],
          hints: [
            'Await gather to resolve.',
            'Wrap entry with asyncio.run.'
          ]
        },
        {
          title: 'Bounded Semaphore',
          description: 'Guard concurrent access with a semaphore.',
          code: [
            'import asyncio',
            '',
            'async def limited(limit=2):',
            '    sem = asyncio.Semaphore(limit)',
            '    async with sem:',
            '        await asyncio.sleep(0.1)'
          ].join('\n'),
          concepts: ['Semaphore', 'Asyncio'],
          hints: [
            'Instantiate the semaphore once.',
            'Use async with to acquire it.'
          ]
        }
      ]
    }
  },
  go: {
    label: 'Go',
    description: 'Idiomatic Go snippets with channels and generics',
    difficulties: {
      beginner: [
        {
          title: 'Struct Summary',
          description: 'Embed a struct and format output.',
          code: [
            'package main',
            '',
            'import "fmt"',
            '',
            'type Note struct { Title string }',
            '',
            'func main() {',
            '    fmt.Println(Note{Title: "dev"}.Title)',
            '}'
          ].join('\n'),
          concepts: ['Structs', 'fmt'],
          hints: [
            'Exported fields need capitals.',
            'Use short struct literals.'
          ]
        },
        {
          title: 'Loop Channel',
          description: 'Read values from a channel.',
          code: [
            'package main',
            '',
            'func main() {',
            '    ch := make(chan int, 2)',
            '    ch <- 1; ch <- 2',
            '    close(ch)',
            '    for v := range ch { println(v) }',
            '}'
          ].join('\n'),
          concepts: ['Channels', 'Range loops'],
          hints: [
            'Close channels before ranging.',
            'Buffers allow non-blocking writes.'
          ]
        },
        {
          title: 'Slice Append',
          description: 'Append items to a slice.',
          code: [
            'package main',
            'import "fmt"',
            'func main() {',
            '    nums := []int{1}',
            '    nums = append(nums, 2)',
            '    fmt.Println(nums)',
            '}'
          ].join('\n'),
          concepts: ['Slices', 'Append'],
          hints: [
            'Slices grow via append.',
            'Print results to verify state.'
          ]
        }
      ],
      intermediate: [
        {
          title: 'Generics Merge',
          description: 'Merge maps safely.',
          code: [
            'package main',
            '',
            'func Merge[K comparable, V any](a, b map[K]V) map[K]V {',
            '    out := map[K]V{}',
            '    for k, v := range a { out[k] = v }',
            '    for k, v := range b { out[k] = v }',
            '    return out',
            '}'
          ].join('\n'),
          concepts: ['Generics', 'Maps'],
          hints: [
            'Declare new map before writes.',
            'Range copies key/value pairs.'
          ]
        },
        {
          title: 'Ticker Loop',
          description: 'Receive ticks until done.',
          code: [
            'package main',
            '',
            'import "time"',
            '',
            'func main() {',
            '    t := time.NewTicker(time.Second)',
            '    defer t.Stop()',
            '    <-t.C',
            '}'
          ].join('\n'),
          concepts: ['Tickers', 'Defer'],
          hints: [
            'Always stop tickers.',
            'Use receive syntax on channels.'
          ]
        },
        {
          title: 'Sorted Keys',
          description: 'Collect and sort map keys.',
          code: [
            'package main',
            'import "sort"',
            'func keys(m map[string]int) []string {',
            '    out := make([]string, 0, len(m))',
            '    for k := range m { out = append(out, k) }',
            '    sort.Strings(out)',
            '    return out',
            '}'
          ].join('\n'),
          concepts: ['Maps', 'Sorting'],
          hints: [
            'Allocate capacity from len.',
            'Sort after collecting keys.'
          ]
        }
      ],
      advanced: [
        {
          title: 'Context Cancel',
          description: 'Cancel work with context.',
          code: [
            'package main',
            'import "context"',
            'import "time"',
            'func main() {',
            '    ctx, cancel := context.WithCancel(context.Background())',
            '    go func() { <-time.After(time.Millisecond); cancel() }()',
            '    <-ctx.Done()',
            '}'
          ].join('\n'),
          concepts: ['Context', 'Cancellation'],
          hints: [
            'Call cancel when finished.',
            'Wait on ctx.Done for signal.'
          ]
        },
        {
          title: 'Worker Channel',
          description: 'Fan out jobs to a channel.',
          code: [
            'package main',
            'func run(jobs <-chan int) <-chan int {',
            '    out := make(chan int)',
            '    go func() {',
            '        for job := range jobs { out <- job }',
            '        close(out)',
            '    }()',
            '    return out',
            '}'
          ].join('\n'),
          concepts: ['Channels', 'Goroutines'],
          hints: [
            'Return the output channel.',
            'Close when producers finish.'
          ]
        },
        {
          title: 'WaitGroup Sync',
          description: 'Wait for goroutines to finish.',
          code: [
            'package main',
            'import "sync"',
            'func main() {',
            '    var wg sync.WaitGroup',
            '    wg.Add(1)',
            '    go func() { defer wg.Done() }()',
            '    wg.Wait()',
            '}'
          ].join('\n'),
          concepts: ['WaitGroup', 'Concurrency'],
          hints: [
            'Add before launching goroutines.',
            'Always call Done in defer.'
          ]
        }
      ]
    }
  }
}

const difficultyOrder = ['beginner', 'intermediate', 'advanced']

const ToggleButton = ({ active, onClick, children, theme }) => (
  <motion.button
    onClick={onClick}
    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
    style={{
      backgroundColor: active ? theme.colors.primary + '20' : theme.colors.surface,
      color: active ? theme.colors.primary : theme.colors.textSecondary,
      border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.button>
)

const DeveloperTest = ({ onShowAnalytics, onShowDetailedAnalytics }) => {
  const { theme } = useTheme()
  const { updatePerformance } = usePerformance()

  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [difficulty, setDifficulty] = useState('beginner')
  const [snippetIndex, setSnippetIndex] = useState(0)

  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(0)

  const [showHints, setShowHints] = useState(true)
  const [showSolution, setShowSolution] = useState(true)
  const [focusMode, setFocusMode] = useState(false)

  const textareaRef = useRef(null)

  const [testResults, setTestResults] = useState(null)

  const currentSnippets = useMemo(() => {
    const language = developerSnippets[selectedLanguage]
    if (!language) return []
    return language.difficulties[difficulty] || []
  }, [selectedLanguage, difficulty])

  const activeSnippet = useMemo(() => {
    if (currentSnippets.length === 0) return null
    return currentSnippets[snippetIndex] || currentSnippets[0]
  }, [currentSnippets, snippetIndex])

  const targetCode = useMemo(() => {
    if (!activeSnippet) return ''
    return activeSnippet.code.replace(/\s+$/, '')
  }, [activeSnippet])

  const languageMeta = developerSnippets[selectedLanguage]

  useEffect(() => {
    setSnippetIndex(0)
  }, [selectedLanguage, difficulty])

  useEffect(() => {
    setUserInput('')
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setStartTime(null)
    setTimeElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCorrectChars(0)
    setIncorrectChars(0)
    setCurrentIndex(0)
    setTestResults(null)
    textareaRef.current?.focus()
  }, [targetCode])

  useEffect(() => {
    let interval = null
    if (isActive && !isPaused && !isComplete) {
      interval = setInterval(() => {
        if (!startTime) return
        const elapsed = (Date.now() - startTime) / 1000
        setTimeElapsed(elapsed)

        const wordsTyped = userInput.trim().length > 0 ? userInput.trim().split(/\s+/).length : 0
        const minutes = elapsed / 60
        setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
      }, 120)
    }
    return () => clearInterval(interval)
  }, [isActive, isPaused, isComplete, startTime, userInput])

  const completeTest = useCallback(({ finalCorrect, finalIncorrect, finalAccuracy, finalInputLength }) => {
    const now = Date.now()
    const elapsed = startTime ? (now - startTime) / 1000 : timeElapsed
    const adjustedElapsed = elapsed > 0 ? elapsed : 0.1
    const grossWords = targetCode.length / 5
    const finalWpm = adjustedElapsed > 0 ? Math.round((grossWords / adjustedElapsed) * 60) : wpm

    setIsComplete(true)
    setIsActive(false)
    setIsPaused(false)
    setTimeElapsed(adjustedElapsed)
    setWpm(finalWpm)

    const results = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: finalIncorrect,
      correctChars: finalCorrect,
      incorrectChars: finalIncorrect,
      timeElapsed: adjustedElapsed,
      totalCharacters: finalInputLength,
      targetCharacters: targetCode.length,
      mode: 'developer',
      language: languageMeta?.label || selectedLanguage,
      difficulty,
      snippetTitle: activeSnippet?.title,
      wasSkipped: finalInputLength < Math.min(10, targetCode.length)
    }

    setTestResults(results)

    if (results.totalCharacters >= 10) {
      updatePerformance(results)
    }

    if (onShowDetailedAnalytics) {
      onShowDetailedAnalytics(results)
    } else if (onShowAnalytics) {
      onShowAnalytics(results)
    }
  }, [activeSnippet, difficulty, languageMeta, onShowAnalytics, onShowDetailedAnalytics, selectedLanguage, startTime, targetCode.length, timeElapsed, updatePerformance, wpm])

  const applyUserInput = useCallback((value) => {
    if (isComplete) {
      return
    }

    if (!isActive && value.length > 0) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    setUserInput(value)
    setCurrentIndex(value.length)

    let correct = 0
    const limit = value.length
    for (let i = 0; i < limit; i += 1) {
      if (value[i] === targetCode[i]) {
        correct += 1
      }
    }
    const incorrect = Math.max(0, limit - correct)

    setCorrectChars(correct)
    setIncorrectChars(incorrect)
    setErrors(incorrect)

    const calculatedAccuracy = limit > 0 ? Math.round((correct / limit) * 100) : 100
    setAccuracy(calculatedAccuracy)

    if (value === targetCode) {
      completeTest({
        finalCorrect: correct,
        finalIncorrect: incorrect,
        finalAccuracy: calculatedAccuracy,
        finalInputLength: limit
      })
    }
  }, [completeTest, isActive, isComplete, targetCode])

  const handleInputChange = (event) => {
    if (isPaused || isComplete) {
      return
    }
    applyUserInput(event.target.value)
  }

  const finalizeTest = useCallback(({ aborted = false } = {}) => {
    if (isComplete && !aborted) {
      return
    }

    const finalCorrect = correctChars
    const finalIncorrect = incorrectChars
    const finalAccuracy = userInput.length > 0 ? Math.round((finalCorrect / userInput.length) * 100) : 100

    completeTest({
      finalCorrect,
      finalIncorrect,
      finalAccuracy,
      finalInputLength: userInput.length
    })

    if (aborted && textareaRef.current) {
      textareaRef.current.blur()
    }
  }, [completeTest, correctChars, incorrectChars, isComplete, userInput.length])

  const adjustSelection = (position) => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = position
        textareaRef.current.selectionEnd = position
      }
    })
  }

  const handleKeyDown = (event) => {
    if (isPaused || isComplete) {
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const element = event.target
      const { selectionStart, selectionEnd, value } = element
      const insertion = '  '
      const newValue = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd)
      applyUserInput(newValue)
      adjustSelection(selectionStart + insertion.length)
      return
    }

    if (event.key === 'Enter') {
      const element = event.target
      const { selectionStart, selectionEnd, value } = element
      const currentLine = value.slice(0, selectionStart).split('\n').pop() || ''
      const indentationMatch = currentLine.match(/^\s+/)
      const indentation = indentationMatch ? indentationMatch[0] : ''

      event.preventDefault()
      const insertion = `\n${indentation}`
      const newValue = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd)
      applyUserInput(newValue)
      adjustSelection(selectionStart + insertion.length)
    }
  }

  const togglePause = () => {
    if (!isActive) {
      return
    }
    const paused = !isPaused
    setIsPaused(paused)
    if (!paused) {
      setStartTime(Date.now() - timeElapsed * 1000)
    }
  }

  const resetTest = () => {
    setUserInput('')
    setCurrentIndex(0)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setStartTime(null)
    setTimeElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setCorrectChars(0)
    setIncorrectChars(0)
    setTestResults(null)
    textareaRef.current?.focus()
  }

  const handleNewSnippet = () => {
    if (currentSnippets.length < 2) {
      resetTest()
      return
    }

    const availableIndices = currentSnippets.map((_, index) => index).filter((index) => index !== snippetIndex)
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setSnippetIndex(randomIndex)
  }

  const progress = targetCode.length > 0 ? Math.min(100, Math.round((userInput.length / targetCode.length) * 100)) : 0
  const characters = useMemo(() => targetCode.split(''), [targetCode])

  const shouldHideSnippet = focusMode && isActive

  const hintItems = activeSnippet?.hints || []
  const conceptItems = activeSnippet?.concepts || []

  const renderCharacter = useCallback((char, index) => {
    const typedChar = userInput[index]
    const isTyped = index < userInput.length
    const isCorrect = isTyped && typedChar === char
    const isCurrent = index === currentIndex
    const isLineBreak = char === '\n'

    let textColor = theme.colors.textMuted
    let bgColor = 'transparent'

    if (isTyped) {
      if (isCorrect) {
        textColor = theme.colors.correct
        bgColor = theme.colors.correct + '20'
      } else {
        textColor = theme.colors.incorrect
        bgColor = theme.colors.incorrect + '20'
      }
    } else if (isCurrent) {
      textColor = theme.colors.current
      bgColor = theme.colors.current + '20'
    }

    const caret = isCurrent ? (
      <motion.div
        className="absolute top-0 left-0 w-0.5 h-full"
        animate={{ opacity: isPaused ? 0.3 : [1, 0, 1] }}
        transition={{ duration: isPaused ? 0 : 1, repeat: isPaused ? 0 : Infinity }}
        style={{ backgroundColor: theme.colors.caret }}
      />
    ) : null

    if (isLineBreak) {
      return (
        <motion.span
          key={`lb-${index}`}
          className="relative block"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            minHeight: '1.25rem'
          }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isTyped || isCurrent ? 1 : 0.7 }}
          transition={{ duration: 0.1 }}
        >
          <span className="invisible">\u00A0</span>
          {caret}
        </motion.span>
      )
    }

    const displayChar = char === ' ' ? '\u00A0' : char

    return (
      <motion.span
        key={index}
        className="relative inline-flex"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          whiteSpace: 'pre'
        }}
        initial={{ opacity: 0.7 }}
        animate={{
          opacity: isTyped || isCurrent ? 1 : 0.7,
          scale: isCurrent ? 1.05 : 1
        }}
        transition={{ duration: 0.1 }}
      >
        <span>{displayChar}</span>
        {caret}
      </motion.span>
    )
  }, [currentIndex, isPaused, theme.colors, userInput])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        className="flex items-start justify-between flex-wrap gap-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center space-x-3">
            <Code2 size={28} style={{ color: theme.colors.primary }} />
            <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
              Developer Test
            </h1>
          </div>
          <p className="mt-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            Master syntax by selecting a language, difficulty, and targeted snippet. Track speed, accuracy, and precision for real-world code samples.
          </p>
        </div>
        {languageMeta && (
          <motion.div
            className="px-4 py-3 rounded-xl border max-w-xs"
            style={{
              backgroundColor: focusMode ? theme.colors.background : theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.textMuted }}>
              Focus Area
            </p>
            <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
              {languageMeta.label}
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.colors.textSecondary }}>
              {languageMeta.description}
            </p>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            Choose your language
          </h2>
          <div className="flex items-center space-x-2">
            <ToggleButton
              theme={theme}
              active={showHints}
              onClick={() => setShowHints((prev) => !prev)}
            >
              <Lightbulb size={16} />
              <span>Hints</span>
            </ToggleButton>
            <ToggleButton
              theme={theme}
              active={focusMode}
              onClick={() => setFocusMode((prev) => !prev)}
            >
              <Shuffle size={16} />
              <span>Focus mode</span>
            </ToggleButton>
            <ToggleButton
              theme={theme}
              active={showSolution}
              onClick={() => setShowSolution((prev) => !prev)}
            >
              {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showSolution ? 'Hide snippet' : 'Show snippet'}</span>
            </ToggleButton>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(developerSnippets).map(([languageKey, meta]) => {
            const isActiveLanguage = languageKey === selectedLanguage
            return (
              <motion.button
                key={languageKey}
                onClick={() => setSelectedLanguage(languageKey)}
                className="p-3 rounded-lg text-left h-full"
                style={{
                  backgroundColor: isActiveLanguage ? theme.colors.primary + '25' : theme.colors.surface,
                  border: `2px solid ${isActiveLanguage ? theme.colors.primary : theme.colors.border}`,
                  color: theme.colors.text
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-semibold text-sm mb-1" style={{ color: theme.colors.text }}>
                  {meta.label}
                </div>
                <p className="text-xs leading-snug" style={{ color: theme.colors.textSecondary }}>
                  {meta.description}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
          Select difficulty
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {difficultyOrder.map((level) => (
            <ToggleButton
              key={level}
              theme={theme}
              active={difficulty === level}
              onClick={() => setDifficulty(level)}
            >
              <span className="capitalize">{level}</span>
            </ToggleButton>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            Snippet library
          </h2>
          <button
            onClick={handleNewSnippet}
            className="text-sm font-medium"
            style={{ color: theme.colors.primary }}
          >
            Shuffle snippet
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentSnippets.map((snippet, index) => {
            const isSelected = activeSnippet?.title === snippet.title
            return (
              <motion.div
                key={snippet.title}
                onClick={() => setSnippetIndex(index)}
                className="p-4 rounded-lg border cursor-pointer transition-all"
                style={{
                  backgroundColor: isSelected ? theme.colors.primary + '15' : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  color: theme.colors.text
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                      {snippet.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      {snippet.description}
                    </p>
                  </div>
                  <span className="text-[11px] uppercase tracking-wide" style={{ color: theme.colors.textMuted }}>
                    {difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(snippet.concepts || []).slice(0, 3).map((concept) => (
                    <span
                      key={concept}
                      className="text-[10px] font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: theme.colors.accent + '25',
                        color: theme.colors.accent
                      }}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div
        className="flex flex-wrap gap-6 items-center justify-between rounded-xl p-5 border"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-6 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
              {wpm}
            </div>
            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
              WPM
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: theme.colors.accent }}>
              {accuracy}%
            </div>
            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: theme.colors.secondary }}>
              {timeElapsed.toFixed(1)}s
            </div>
            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
              Time elapsed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: theme.colors.incorrect }}>
              {errors}
            </div>
            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
              Errors
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: theme.colors.current }}>
              {progress}%
            </div>
            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
              Progress
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isActive && (
            <motion.button
              onClick={togglePause}
              className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
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
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
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

          {isActive && (
            <motion.button
              onClick={() => finalizeTest({ aborted: true })}
              className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              style={{
                backgroundColor: theme.colors.incorrect,
                color: theme.colors.background
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Abort & save</span>
            </motion.button>
          )}

          {(!isActive && !isComplete && userInput.length > 0) && (
            <motion.button
              onClick={() => finalizeTest({ aborted: true })}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.background
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save partial result
            </motion.button>
          )}

          <motion.button
            onClick={handleNewSnippet}
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.background
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shuffle size={16} />
            <span>New snippet</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {showHints && hintItems.length > 0 && (
          <motion.div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>
              Practice cues
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {conceptItems.map((concept) => (
                <span
                  key={concept}
                  className="text-[11px] font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: theme.colors.correct + '20',
                    color: theme.colors.correct
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>
            <ul className="space-y-1 text-sm list-disc list-inside" style={{ color: theme.colors.textSecondary }}>
              {hintItems.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="text-sm font-semibold" style={{ color: theme.colors.text }}>
          Start typing the snippet below
        </label>
        <div
          className="rounded-xl border font-mono text-sm md:text-base leading-relaxed p-6"
          style={{
            backgroundColor: focusMode ? theme.colors.background : theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            minHeight: '22rem',
            position: 'relative',
            transition: 'opacity 0.3s ease',
            opacity: isPaused ? 0.6 : 1,
            overflowY: 'auto'
          }}
        >
          <div className="whitespace-pre-wrap break-words">
            {characters.map((char, index) => renderCharacter(char, index))}
          </div>
          {isPaused && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <Pause size={32} style={{ color: theme.colors.primary }} className="mx-auto mb-2" />
                <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                  Test Paused
                </p>
              </div>
            </motion.div>
          )}
          {shouldHideSnippet && !showSolution && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center px-6 text-sm" style={{ color: theme.colors.text }}>
                Snippet hidden in focus mode. Toggle "Show snippet" to peek again.
              </div>
            </motion.div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 pointer-events-none"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={isPaused || !activeSnippet}
        />
        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
          Use <kbd className="px-2 py-1 rounded border" style={{ borderColor: theme.colors.border }}>Tab</kbd> for indentation and press <kbd className="px-2 py-1 rounded border" style={{ borderColor: theme.colors.border }}>Enter</kbd> to auto-align with the previous line.
        </p>
      </motion.div>

      <motion.div
        className="text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: theme.colors.textMuted }}
      >
        {isComplete
          ? 'Snippet complete! Review your analytics in the dashboard.'
          : isPaused
          ? 'Test paused. Resume when you are ready.'
          : isActive
          ? 'Keep your focus steady—accuracy over speed delivers clean code.'
          : 'When you begin typing, the timer starts automatically.'}
      </motion.div>
    </div>
  )
}

export default DeveloperTest
