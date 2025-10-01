import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const PerformanceContext = createContext()

export const usePerformance = () => {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}

export const PerformanceProvider = ({ children }) => {
  const [stats, setStats] = useState({
    currentWPM: 0,
    averageWPM: 0,
    accuracy: 100,
    errorRate: 0,
    streak: 0,
    totalTests: 0,
    totalTime: 0,
    bestWPM: 0,
    recentTests: []
  })

  const [sessionStats, setSessionStats] = useState({
    testsCompleted: 0,
    timeSpent: 0,
    averageAccuracy: 0,
    improvementRate: 0
  })

  // All test history stored separately
  const [allTests, setAllTests] = useState([])

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('typingStats')
    const savedSession = localStorage.getItem('sessionStats')
    const savedAllTests = localStorage.getItem('allTypingTests')
    
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
    if (savedSession) {
      setSessionStats(JSON.parse(savedSession))
    }
    if (savedAllTests) {
      setAllTests(JSON.parse(savedAllTests))
    }
  }, [])

  // Save stats to localStorage
  const saveStats = (newStats) => {
    setStats(newStats)
    localStorage.setItem('typingStats', JSON.stringify(newStats))
  }

  const saveSessionStats = (newSessionStats) => {
    setSessionStats(newSessionStats)
    localStorage.setItem('sessionStats', JSON.stringify(newSessionStats))
  }

  // Update performance after a test
  const updatePerformance = (testResult) => {
    const {
      wpm,
      rawWpm,
      accuracy,
      errors,
      timeElapsed,
      totalCharacters,
      correctChars,
      incorrectChars,
      mode = 'practice',
      contentType,
      textTitle,
      settings,
      duration
    } = testResult

    const now = Date.now()
    const newTest = {
      id: now,
      date: new Date().toISOString(),
      timestamp: now,
      wpm,
      rawWpm: rawWpm || wpm,
      accuracy,
      errors,
      timeElapsed: timeElapsed || duration || 0,
      totalCharacters,
      correctChars: correctChars || 0,
      incorrectChars: incorrectChars || 0,
      mode,
      contentType: contentType || 'mixed',
      textTitle: textTitle || null,
      settings: settings || null,
      duration: duration || null
    }

    // Save to all tests history
    const updatedAllTests = [newTest, ...allTests]
    setAllTests(updatedAllTests)
    localStorage.setItem('allTypingTests', JSON.stringify(updatedAllTests))

    const newStats = {
      ...stats,
      currentWPM: wpm,
      totalTests: stats.totalTests + 1,
      totalTime: stats.totalTime + timeElapsed,
      bestWPM: Math.max(stats.bestWPM, wpm),
      recentTests: [newTest, ...stats.recentTests.slice(0, 9)], // Keep last 10 tests
      errorRate: calculateErrorRate([newTest, ...stats.recentTests])
    }

    // Calculate average WPM from recent tests
    const recentWPMs = [newTest, ...stats.recentTests.slice(0, 9)].map(test => test.wpm)
    newStats.averageWPM = Math.round(recentWPMs.reduce((a, b) => a + b, 0) / recentWPMs.length)

    // Update streak
    if (accuracy >= 95 && wpm >= newStats.averageWPM * 0.9) {
      newStats.streak = stats.streak + 1
    } else {
      newStats.streak = 0
    }

    saveStats(newStats)

    // Update session stats
    const newSessionStats = {
      testsCompleted: sessionStats.testsCompleted + 1,
      timeSpent: sessionStats.timeSpent + timeElapsed,
      averageAccuracy: calculateSessionAccuracy(accuracy),
      improvementRate: calculateImprovementRate(wpm)
    }

    saveSessionStats(newSessionStats)
  }

  const calculateErrorRate = (tests) => {
    if (tests.length === 0) return 0
    const totalErrors = tests.reduce((sum, test) => sum + test.errors, 0)
    const totalCharacters = tests.reduce((sum, test) => sum + test.totalCharacters, 0)
    return totalCharacters > 0 ? Math.round((totalErrors / totalCharacters) * 100) : 0
  }

  const calculateSessionAccuracy = (newAccuracy) => {
    if (sessionStats.testsCompleted === 0) return newAccuracy
    return Math.round(
      (sessionStats.averageAccuracy * sessionStats.testsCompleted + newAccuracy) /
      (sessionStats.testsCompleted + 1)
    )
  }

  const calculateImprovementRate = (currentWPM) => {
    if (stats.recentTests.length < 2) return 0
    const oldWPM = stats.recentTests[stats.recentTests.length - 1]?.wpm || 0
    return oldWPM > 0 ? Math.round(((currentWPM - oldWPM) / oldWPM) * 100) : 0
  }

  // Get performance insights
  const getInsights = () => {
    const insights = []

    if (stats.streak >= 5) {
      insights.push({
        type: 'success',
        message: `Amazing! You're on a ${stats.streak} test streak!`,
        icon: '🔥'
      })
    }

    if (stats.currentWPM > stats.averageWPM * 1.1) {
      insights.push({
        type: 'success',
        message: 'Great job! You\'re typing faster than your average!',
        icon: '⚡'
      })
    }

    if (stats.recentTests.length >= 3) {
      const lastThree = stats.recentTests.slice(0, 3)
      const improving = lastThree.every((test, i) => 
        i === 0 || test.wpm >= lastThree[i - 1].wpm
      )
      
      if (improving) {
        insights.push({
          type: 'success',
          message: 'You\'re improving! Keep up the great work!',
          icon: '📈'
        })
      }
    }

    if (sessionStats.averageAccuracy < 90) {
      insights.push({
        type: 'tip',
        message: 'Focus on accuracy - slow down to improve precision',
        icon: '🎯'
      })
    }

    return insights
  }

  // Reset session stats (called daily or manually)
  const resetSession = () => {
    const newSessionStats = {
      testsCompleted: 0,
      timeSpent: 0,
      averageAccuracy: 0,
      improvementRate: 0
    }
    saveSessionStats(newSessionStats)
  }

  // Filter tests by timeframe
  const getTestsByTimeframe = useCallback((timeframe = 'all') => {
    const now = Date.now()
    const msPerDay = 24 * 60 * 60 * 1000
    
    let cutoffTime
    switch (timeframe) {
      case 'today':
      case '1day':
        cutoffTime = now - msPerDay
        break
      case '1week':
        cutoffTime = now - (7 * msPerDay)
        break
      case '1month':
        cutoffTime = now - (30 * msPerDay)
        break
      case 'all':
      default:
        return allTests
    }
    
    return allTests.filter(test => test.timestamp >= cutoffTime)
  }, [allTests])

  // Get aggregated stats for a timeframe
  const getStatsForTimeframe = useCallback((timeframe = 'all') => {
    const tests = getTestsByTimeframe(timeframe)
    
    if (tests.length === 0) {
      return {
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        totalTime: 0,
        totalCharacters: 0,
        totalErrors: 0,
        improvementRate: 0
      }
    }

    const totalWPM = tests.reduce((sum, test) => sum + test.wpm, 0)
    const totalAccuracy = tests.reduce((sum, test) => sum + test.accuracy, 0)
    const totalTime = tests.reduce((sum, test) => sum + test.timeElapsed, 0)
    const totalCharacters = tests.reduce((sum, test) => sum + test.totalCharacters, 0)
    const totalErrors = tests.reduce((sum, test) => sum + test.errors, 0)
    const bestWPM = Math.max(...tests.map(test => test.wpm))

    // Calculate improvement rate (compare first half vs second half)
    let improvementRate = 0
    if (tests.length >= 4) {
      const midPoint = Math.floor(tests.length / 2)
      const recentHalf = tests.slice(0, midPoint)
      const olderHalf = tests.slice(midPoint)
      
      const recentAvg = recentHalf.reduce((sum, test) => sum + test.wpm, 0) / recentHalf.length
      const olderAvg = olderHalf.reduce((sum, test) => sum + test.wpm, 0) / olderHalf.length
      
      if (olderAvg > 0) {
        improvementRate = Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
      }
    }

    return {
      totalTests: tests.length,
      averageWPM: Math.round(totalWPM / tests.length),
      bestWPM,
      averageAccuracy: Math.round(totalAccuracy / tests.length),
      totalTime,
      totalCharacters,
      totalErrors,
      improvementRate
    }
  }, [getTestsByTimeframe])

  // Get test history grouped by day
  const getTestHistoryByDay = useCallback((timeframe = '1week') => {
    const tests = getTestsByTimeframe(timeframe)
    const grouped = {}

    tests.forEach(test => {
      const date = new Date(test.timestamp).toLocaleDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(test)
    })

    return grouped
  }, [getTestsByTimeframe])

  // Get performance trends
  const getPerformanceTrends = useCallback((timeframe = '1week') => {
    const tests = getTestsByTimeframe(timeframe)
    
    if (tests.length === 0) return []

    // Sort by timestamp (oldest first for trend)
    const sortedTests = [...tests].sort((a, b) => a.timestamp - b.timestamp)
    
    return sortedTests.map(test => ({
      date: new Date(test.timestamp).toLocaleDateString(),
      wpm: test.wpm,
      accuracy: test.accuracy,
      timestamp: test.timestamp
    }))
  }, [getTestsByTimeframe])

  // Get mode-specific stats
  const getStatsByMode = useCallback((timeframe = 'all') => {
    const tests = getTestsByTimeframe(timeframe)
    const modeStats = {}

    tests.forEach(test => {
      const mode = test.mode || 'practice'
      if (!modeStats[mode]) {
        modeStats[mode] = {
          count: 0,
          totalWPM: 0,
          totalAccuracy: 0,
          bestWPM: 0
        }
      }
      
      modeStats[mode].count++
      modeStats[mode].totalWPM += test.wpm
      modeStats[mode].totalAccuracy += test.accuracy
      modeStats[mode].bestWPM = Math.max(modeStats[mode].bestWPM, test.wpm)
    })

    // Calculate averages
    Object.keys(modeStats).forEach(mode => {
      const stats = modeStats[mode]
      stats.averageWPM = Math.round(stats.totalWPM / stats.count)
      stats.averageAccuracy = Math.round(stats.totalAccuracy / stats.count)
    })

    return modeStats
  }, [getTestsByTimeframe])

  return (
    <PerformanceContext.Provider value={{
      stats,
      sessionStats,
      allTests,
      updatePerformance,
      getInsights,
      resetSession,
      getTestsByTimeframe,
      getStatsForTimeframe,
      getTestHistoryByDay,
      getPerformanceTrends,
      getStatsByMode
    }}>
      {children}
    </PerformanceContext.Provider>
  )
}
