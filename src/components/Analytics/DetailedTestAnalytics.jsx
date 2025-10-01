import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { usePerformance } from '../../contexts/PerformanceContext'
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Award, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  ArrowLeft,
  Share2,
  Download,
  Activity,
  Eye,
  Calendar,
  Users,
  Trophy,
  Flame,
  Hash,
  Type,
  MousePointer
} from 'lucide-react'

const DetailedTestAnalytics = ({ results, onBack }) => {
  const { theme } = useTheme()
  const { getTestsByTimeframe, getStatsForTimeframe } = usePerformance()
  const [comparisonTimeframe, setComparisonTimeframe] = useState('1week')

  if (!results) return null

  // Calculate additional detailed metrics
  const totalChars = results.totalCharacters || 1 // Prevent division by zero
  const timeElapsed = results.timeElapsed || results.duration || 1 // Prevent division by zero
  const consistency = Math.max(0, 100 - (results.errors / totalChars * 100 * 2))
  const speed = results.wpm || 0
  const precision = results.accuracy || 0
  const efficiency = Math.round((speed * precision) / 100)
  const keystrokesPerMinute = Math.round((totalChars / timeElapsed) * 60)
  const errorRate = ((results.errors / totalChars) * 100).toFixed(2)
  const correctKeystrokesPerMinute = Math.round(((results.correctChars || 0) / timeElapsed) * 60)
  
  // Performance rating with more detailed breakdown
  const getPerformanceRating = () => {
    const speedScore = Math.min(speed / 100 * 100, 100) // Max 100 WPM = 100%
    const accuracyScore = precision
    const consistencyScore = consistency
    const overallScore = (speedScore * 0.4) + (accuracyScore * 0.4) + (consistencyScore * 0.2)
    
    if (overallScore >= 95) return { rating: 'Exceptional', color: theme.colors.correct, icon: '🏆', description: 'Outstanding performance!' }
    if (overallScore >= 85) return { rating: 'Excellent', color: theme.colors.primary, icon: '⭐', description: 'Great typing skills!' }
    if (overallScore >= 75) return { rating: 'Very Good', color: theme.colors.accent, icon: '👍', description: 'Above average performance' }
    if (overallScore >= 65) return { rating: 'Good', color: theme.colors.secondary, icon: '📈', description: 'Solid typing ability' }
    if (overallScore >= 50) return { rating: 'Fair', color: theme.colors.textSecondary, icon: '💪', description: 'Room for improvement' }
    return { rating: 'Needs Work', color: theme.colors.incorrect, icon: '🎯', description: 'Focus on practice' }
  }

  const performance = getPerformanceRating()

  // Get comparison data
  const comparisonStats = getStatsForTimeframe(comparisonTimeframe)
  const comparisonTests = getTestsByTimeframe(comparisonTimeframe)

  // Advanced insights and recommendations
  const getDetailedInsights = () => {
    const insights = []
    
    // Speed analysis
    if (results.wpm > comparisonStats.averageWPM) {
      insights.push({
        type: 'success',
        icon: <Zap size={20} />,
        title: 'Speed Excellence',
        message: `Your WPM (${results.wpm}) is ${results.wpm - comparisonStats.averageWPM} points above your ${comparisonTimeframe} average!`,
        color: theme.colors.correct,
        category: 'speed'
      })
    } else if (results.wpm < comparisonStats.averageWPM * 0.9) {
      insights.push({
        type: 'warning',
        icon: <TrendingUp size={20} />,
        title: 'Speed Below Average',
        message: `Your WPM is ${comparisonStats.averageWPM - results.wpm} points below your recent average. Consider warming up before tests.`,
        color: theme.colors.incorrect,
        category: 'speed'
      })
    }
    
    // Accuracy analysis
    if (results.accuracy >= 98) {
      insights.push({
        type: 'success',
        icon: <Target size={20} />,
        title: 'Exceptional Accuracy',
        message: 'Outstanding precision! Your accuracy is in the top tier of typists.',
        color: theme.colors.correct,
        category: 'accuracy'
      })
    } else if (results.accuracy < 90) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle size={20} />,
        title: 'Accuracy Needs Attention',
        message: 'Focus on accuracy over speed. Try slowing down to build muscle memory.',
        color: theme.colors.incorrect,
        category: 'accuracy'
      })
    }
    
    // Consistency analysis
    if (consistency >= 90) {
      insights.push({
        type: 'success',
        icon: <Activity size={20} />,
        title: 'Excellent Consistency',
        message: 'Your typing rhythm is very consistent throughout the test.',
        color: theme.colors.primary,
        category: 'consistency'
      })
    } else if (consistency < 70) {
      insights.push({
        type: 'tip',
        icon: <BarChart3 size={20} />,
        title: 'Improve Consistency',
        message: 'Work on maintaining steady typing rhythm. Practice with a metronome.',
        color: theme.colors.accent,
        category: 'consistency'
      })
    }
    
    // Error pattern analysis
    if (results.errors > results.totalCharacters * 0.15) {
      insights.push({
        type: 'warning',
        icon: <Hash size={20} />,
        title: 'High Error Rate',
        message: 'Consider practicing common letter combinations and difficult words.',
        color: theme.colors.incorrect,
        category: 'errors'
      })
    }
    
    // Performance balance
    if (results.wpm > 60 && results.accuracy > 95) {
      insights.push({
        type: 'success',
        icon: <Trophy size={20} />,
        title: 'Perfect Balance',
        message: 'Excellent balance of speed and accuracy. You\'re in the advanced tier!',
        color: theme.colors.correct,
        category: 'overall'
      })
    }
    
    return insights
  }

  const detailedInsights = getDetailedInsights()

  // Character-level analysis
  const getCharacterAnalysis = () => {
    const analysis = {
      correct: results.correctChars || 0,
      incorrect: results.incorrectChars || 0,
      total: totalChars,
      backspaces: Math.max(0, (totalChars + (results.errors || 0)) - totalChars), // Estimated
      netCharacters: totalChars - (results.errors || 0)
    }
    
    analysis.correctRate = totalChars > 0 ? ((analysis.correct / totalChars) * 100).toFixed(1) : '0.0'
    analysis.errorRate = totalChars > 0 ? ((analysis.incorrect / totalChars) * 100).toFixed(1) : '0.0'
    
    return analysis
  }

  const charAnalysis = getCharacterAnalysis()

  // Performance comparison with historical data
  const getPerformanceComparison = () => {
    if (!comparisonTests || comparisonTests.length === 0) return null
    
    const recentTests = comparisonTests.slice(0, 5)
    if (recentTests.length === 0) return null
    
    const avgWPM = recentTests.reduce((sum, test) => sum + (test.wpm || 0), 0) / recentTests.length
    const avgAccuracy = recentTests.reduce((sum, test) => sum + (test.accuracy || 0), 0) / recentTests.length
    
    return {
      wpmDiff: (results.wpm || 0) - avgWPM,
      accuracyDiff: (results.accuracy || 0) - avgAccuracy,
      avgWPM: Math.round(avgWPM),
      avgAccuracy: Math.round(avgAccuracy),
      testsCount: recentTests.length,
      percentile: calculatePercentile(results.wpm || 0, comparisonTests.map(t => t.wpm || 0))
    }
  }

  const calculatePercentile = (value, dataset) => {
    if (!dataset || dataset.length === 0) return 50
    const validData = dataset.filter(v => typeof v === 'number' && !isNaN(v))
    if (validData.length === 0) return 50
    
    const sorted = [...validData].sort((a, b) => a - b)
    const index = sorted.findIndex(v => v >= value)
    return index === -1 ? 100 : Math.round((index / sorted.length) * 100)
  }

  const comparison = getPerformanceComparison()

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.secondary + '20',
              color: theme.colors.secondary 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
              Detailed Test Analysis
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Comprehensive breakdown of your typing performance
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={comparisonTimeframe}
            onChange={(e) => setComparisonTimeframe(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <option value="1day">Compare to 1 Day</option>
            <option value="1week">Compare to 1 Week</option>
            <option value="1month">Compare to 1 Month</option>
            <option value="all">Compare to All Time</option>
          </select>
          
          <motion.button
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.accent + '20',
              color: theme.colors.accent 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={16} />
            <span>Share</span>
          </motion.button>
          
          <motion.button
            className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Performance Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
          <Zap size={32} style={{ color: theme.colors.primary }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {results.wpm}
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            Words Per Minute
          </div>
          {results.rawWpm && (
            <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
              Raw: {results.rawWpm} WPM
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
          <Target size={32} style={{ color: theme.colors.correct }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {results.accuracy}%
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            Accuracy
          </div>
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {results.errors} errors
          </div>
        </div>

        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
          <Activity size={32} style={{ color: theme.colors.accent }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {consistency.toFixed(1)}%
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            Consistency
          </div>
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            Rhythm Score
          </div>
        </div>

        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
          <BarChart3 size={32} style={{ color: theme.colors.secondary }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {efficiency}
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            Efficiency
          </div>
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            Speed × Accuracy
          </div>
        </div>

        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
          <Award size={32} style={{ color: performance.color }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {performance.icon}
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            {performance.rating}
          </div>
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {performance.description}
          </div>
        </div>
      </motion.div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Character Analysis */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Character Analysis
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Total Characters</span>
              <span className="font-bold" style={{ color: theme.colors.text }}>
                {charAnalysis.total}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Correct Characters</span>
              <span className="font-bold" style={{ color: theme.colors.correct }}>
                {charAnalysis.correct} ({charAnalysis.correctRate}%)
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Incorrect Characters</span>
              <span className="font-bold" style={{ color: theme.colors.incorrect }}>
                {charAnalysis.incorrect} ({charAnalysis.errorRate}%)
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Keystrokes/Min</span>
              <span className="font-bold" style={{ color: theme.colors.primary }}>
                {keystrokesPerMinute}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Correct Keystrokes/Min</span>
              <span className="font-bold" style={{ color: theme.colors.accent }}>
                {correctKeystrokesPerMinute}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Error Rate</span>
              <span className="font-bold" style={{ color: theme.colors.incorrect }}>
                {errorRate}%
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: theme.colors.textSecondary }}>Accuracy Breakdown</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: theme.colors.correct }}
                  initial={{ width: 0 }}
                  animate={{ width: `${charAnalysis.correctRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: theme.colors.incorrect }}
                  initial={{ width: 0 }}
                  animate={{ width: `${charAnalysis.errorRate}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span style={{ color: theme.colors.correct }}>Correct: {charAnalysis.correctRate}%</span>
              <span style={{ color: theme.colors.incorrect }}>Errors: {charAnalysis.errorRate}%</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Comparison */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Performance Comparison ({comparisonTimeframe})
          </h3>
          
          {comparison ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Current WPM</span>
                <span className="font-bold" style={{ color: theme.colors.primary }}>
                  {results.wpm}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Average WPM</span>
                <span className="font-bold" style={{ color: theme.colors.textMuted }}>
                  {comparison.avgWPM}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>WPM Difference</span>
                <span 
                  className={`font-bold ${comparison.wpmDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {comparison.wpmDiff >= 0 ? '+' : ''}{comparison.wpmDiff.toFixed(1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Current Accuracy</span>
                <span className="font-bold" style={{ color: theme.colors.correct }}>
                  {results.accuracy}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Average Accuracy</span>
                <span className="font-bold" style={{ color: theme.colors.textMuted }}>
                  {comparison.avgAccuracy}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Accuracy Difference</span>
                <span 
                  className={`font-bold ${comparison.accuracyDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {comparison.accuracyDiff >= 0 ? '+' : ''}{comparison.accuracyDiff.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Performance Percentile</span>
                <span className="font-bold" style={{ color: theme.colors.accent }}>
                  {comparison.percentile}th
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Tests Compared</span>
                <span className="font-bold" style={{ color: theme.colors.text }}>
                  {comparison.testsCount}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 size={48} style={{ color: theme.colors.textMuted }} className="mx-auto mb-3" />
              <p style={{ color: theme.colors.textMuted }}>
                No comparison data available for {comparisonTimeframe}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed Insights */}
      {detailedInsights.length > 0 && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Detailed Insights & Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailedInsights.map((insight, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: insight.color
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div style={{ color: insight.color }}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold" style={{ color: theme.colors.text }}>
                        {insight.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded" style={{ 
                        backgroundColor: insight.color + '20',
                        color: insight.color 
                      }}>
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Test Details */}
      <motion.div
        className="p-6 rounded-xl"
        style={{ backgroundColor: theme.colors.surface }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
          Test Configuration & Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="block font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
              Test Mode
            </span>
            <span style={{ color: theme.colors.text }}>
              {results.mode.charAt(0).toUpperCase() + results.mode.slice(1)}
            </span>
          </div>
          
          <div>
            <span className="block font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
              Duration
            </span>
            <span style={{ color: theme.colors.text }}>
              {results.timeElapsed ? results.timeElapsed.toFixed(1) : results.duration}s
            </span>
          </div>
          
          {results.contentType && (
            <div>
              <span className="block font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
                Content Type
              </span>
              <span style={{ color: theme.colors.text }}>
                {results.contentType.charAt(0).toUpperCase() + results.contentType.slice(1)}
              </span>
            </div>
          )}
          
          <div>
            <span className="block font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
              Date & Time
            </span>
            <span style={{ color: theme.colors.text }}>
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
        
        {results.settings && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
            <span className="block font-medium mb-3" style={{ color: theme.colors.textSecondary }}>
              Test Configuration
            </span>
            <div className="flex flex-wrap gap-2">
              {results.settings.includeNumbers && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                  backgroundColor: theme.colors.primary + '20', 
                  color: theme.colors.primary 
                }}>
                  <Hash size={12} className="inline mr-1" />
                  Numbers
                </span>
              )}
              {results.settings.includePunctuation && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                  backgroundColor: theme.colors.accent + '20', 
                  color: theme.colors.accent 
                }}>
                  <Type size={12} className="inline mr-1" />
                  Punctuation
                </span>
              )}
              {results.settings.includeCapitals && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                  backgroundColor: theme.colors.secondary + '20', 
                  color: theme.colors.secondary 
                }}>
                  <MousePointer size={12} className="inline mr-1" />
                  Capitals
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default DetailedTestAnalytics
