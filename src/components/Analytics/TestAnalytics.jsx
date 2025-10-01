import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
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
  Download
} from 'lucide-react'

const TestAnalytics = ({ results, onBack, onShowDetailed }) => {
  const { theme } = useTheme()

  if (!results) return null

  // Calculate additional metrics
  const consistency = Math.max(0, 100 - (results.errors / results.totalCharacters * 100 * 2))
  const speed = results.wpm
  const precision = results.accuracy
  const efficiency = Math.round((results.wpm * results.accuracy) / 100)
  
  // Performance rating
  const getPerformanceRating = () => {
    const score = (speed * 0.4) + (precision * 0.4) + (consistency * 0.2)
    if (score >= 90) return { rating: 'Excellent', color: theme.colors.correct, icon: '🏆' }
    if (score >= 75) return { rating: 'Great', color: theme.colors.primary, icon: '⭐' }
    if (score >= 60) return { rating: 'Good', color: theme.colors.accent, icon: '👍' }
    if (score >= 40) return { rating: 'Fair', color: theme.colors.secondary, icon: '📈' }
    return { rating: 'Needs Work', color: theme.colors.incorrect, icon: '💪' }
  }

  const performance = getPerformanceRating()

  // Insights and recommendations
  const getInsights = () => {
    const insights = []
    
    if (results.accuracy < 90) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle size={20} />,
        title: 'Focus on Accuracy',
        message: 'Your accuracy is below 90%. Try slowing down to improve precision.',
        color: theme.colors.incorrect
      })
    }
    
    if (results.wpm > 60 && results.accuracy > 95) {
      insights.push({
        type: 'success',
        icon: <CheckCircle size={20} />,
        title: 'Excellent Performance',
        message: 'Great balance of speed and accuracy! Keep up the excellent work.',
        color: theme.colors.correct
      })
    }
    
    if (results.wpm < 30) {
      insights.push({
        type: 'tip',
        icon: <TrendingUp size={20} />,
        title: 'Speed Improvement',
        message: 'Practice regularly to increase your typing speed. Focus on finger placement.',
        color: theme.colors.primary
      })
    }
    
    if (results.errors > results.totalCharacters * 0.1) {
      insights.push({
        type: 'warning',
        icon: <Target size={20} />,
        title: 'Reduce Errors',
        message: 'High error rate detected. Practice common letter combinations.',
        color: theme.colors.incorrect
      })
    }
    
    return insights
  }

  const insights = getInsights()

  // Character analysis
  const getCharacterBreakdown = () => {
    const breakdown = {
      correct: results.correctChars || 0,
      incorrect: results.incorrectChars || 0,
      total: results.totalCharacters || 0
    }
    
    return breakdown
  }

  const charBreakdown = getCharacterBreakdown()

  // Progress comparison (mock data for now)
  const getProgressComparison = () => {
    return {
      previousWPM: Math.max(0, results.wpm - Math.floor(Math.random() * 10) + 5),
      previousAccuracy: Math.max(0, results.accuracy - Math.floor(Math.random() * 5) + 2),
      improvement: Math.floor(Math.random() * 20) - 5
    }
  }

  const progress = getProgressComparison()

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
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
              Test Analytics
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Detailed analysis of your typing performance
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onShowDetailed && (
            <motion.button
              onClick={() => onShowDetailed(results)}
              className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              style={{ 
                backgroundColor: theme.colors.secondary + '20',
                color: theme.colors.secondary 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={16} />
              <span>Detailed View</span>
            </motion.button>
          )}
          
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          <Clock size={32} style={{ color: theme.colors.accent }} className="mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
            {results.timeElapsed ? results.timeElapsed.toFixed(1) : results.duration}s
          </div>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>
            {results.mode === 'timed' ? 'Test Duration' : 'Time Taken'}
          </div>
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {results.mode} mode
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
            Overall Performance
          </div>
        </div>
      </motion.div>

      {/* Detailed Metrics */}
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
                {charBreakdown.total}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Correct Characters</span>
              <span className="font-bold" style={{ color: theme.colors.correct }}>
                {charBreakdown.correct}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Incorrect Characters</span>
              <span className="font-bold" style={{ color: theme.colors.incorrect }}>
                {charBreakdown.incorrect}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Consistency Score</span>
              <span className="font-bold" style={{ color: theme.colors.accent }}>
                {consistency.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Efficiency Score</span>
              <span className="font-bold" style={{ color: theme.colors.primary }}>
                {efficiency}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: theme.colors.textSecondary }}>Progress</span>
              <span style={{ color: theme.colors.text }}>
                {Math.round((charBreakdown.total / (results.targetCharacters || charBreakdown.total)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.round((charBreakdown.total / (results.targetCharacters || charBreakdown.total)) * 100)}%` 
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Progress Comparison */}
        <motion.div
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Progress Comparison
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Current WPM</span>
              <span className="font-bold" style={{ color: theme.colors.primary }}>
                {results.wpm}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Previous WPM</span>
              <span className="font-bold" style={{ color: theme.colors.textMuted }}>
                {progress.previousWPM}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>WPM Change</span>
              <span 
                className={`font-bold ${results.wpm > progress.previousWPM ? 'text-green-500' : 'text-red-500'}`}
              >
                {results.wpm > progress.previousWPM ? '+' : ''}{results.wpm - progress.previousWPM}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Current Accuracy</span>
              <span className="font-bold" style={{ color: theme.colors.correct }}>
                {results.accuracy}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Previous Accuracy</span>
              <span className="font-bold" style={{ color: theme.colors.textMuted }}>
                {progress.previousAccuracy}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: theme.colors.textSecondary }}>Accuracy Change</span>
              <span 
                className={`font-bold ${results.accuracy > progress.previousAccuracy ? 'text-green-500' : 'text-red-500'}`}
              >
                {results.accuracy > progress.previousAccuracy ? '+' : ''}{(results.accuracy - progress.previousAccuracy).toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights and Recommendations */}
      {insights.length > 0 && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Insights & Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
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
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: theme.colors.text }}>
                      {insight.title}
                    </h4>
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
          Test Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block font-medium" style={{ color: theme.colors.textSecondary }}>
              Test Mode
            </span>
            <span style={{ color: theme.colors.text }}>
              {results.mode.charAt(0).toUpperCase() + results.mode.slice(1)}
            </span>
          </div>
          
          {results.contentType && (
            <div>
              <span className="block font-medium" style={{ color: theme.colors.textSecondary }}>
                Content Type
              </span>
              <span style={{ color: theme.colors.text }}>
                {results.contentType.charAt(0).toUpperCase() + results.contentType.slice(1)}
              </span>
            </div>
          )}
          
          {results.textTitle && (
            <div>
              <span className="block font-medium" style={{ color: theme.colors.textSecondary }}>
                Text
              </span>
              <span style={{ color: theme.colors.text }}>
                {results.textTitle}
              </span>
            </div>
          )}
          
          <div>
            <span className="block font-medium" style={{ color: theme.colors.textSecondary }}>
              Date
            </span>
            <span style={{ color: theme.colors.text }}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {results.settings && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
            <span className="block font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
              Test Settings
            </span>
            <div className="flex flex-wrap gap-2">
              {results.settings.includeNumbers && (
                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}>
                  Numbers
                </span>
              )}
              {results.settings.includePunctuation && (
                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}>
                  Punctuation
                </span>
              )}
              {results.settings.includeCapitals && (
                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.colors.secondary + '20', color: theme.colors.secondary }}>
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

export default TestAnalytics
