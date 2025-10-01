import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePerformance } from '../../contexts/PerformanceContext'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Award, 
  Trophy,
  Flame,
  Eye,
  X,
  BarChart3
} from 'lucide-react'
const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }) => {
  const { theme } = useTheme()
  
  return (
    <motion.div
      className="p-6 rounded-xl border"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: theme.colors.text }}>
          {value}
        </div>
        <div className="text-sm" style={{ color: theme.colors.textMuted }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

const TestHistoryCard = ({ tests, onViewTest }) => {
  const { theme } = useTheme()
  
  if (tests.length === 0) {
    return (
      <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.colors.surface }}>
        <BarChart3 size={48} style={{ color: theme.colors.textMuted }} className="mx-auto mb-3" />
        <p style={{ color: theme.colors.textMuted }}>No tests found for this timeframe</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tests.slice(0, 10).map((test, index) => (
        <motion.div
          key={test.id}
          className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
          style={{ backgroundColor: theme.colors.surface }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onViewTest(test)}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ 
                backgroundColor: test.accuracy >= 95 ? theme.colors.correct : 
                               test.accuracy >= 85 ? theme.colors.accent : theme.colors.incorrect 
              }} />
              <div className="text-sm" style={{ color: theme.colors.textMuted }}>
                {new Date(test.timestamp).toLocaleDateString()} {new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="font-medium" style={{ color: theme.colors.text }}>
              {test.wpm} WPM
            </div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {test.accuracy}% accuracy
            </div>
            <div className="text-xs px-2 py-1 rounded" style={{ 
              backgroundColor: theme.colors.primary + '20',
              color: theme.colors.primary 
            }}>
              {test.mode}
            </div>
          </div>
          <Eye size={16} style={{ color: theme.colors.textMuted }} />
        </motion.div>
      ))}
    </div>
  )
}

const PerformanceTrendChart = ({ trends }) => {
  const { theme } = useTheme()
  
  if (!trends || trends.length === 0) return null

  const maxWPM = Math.max(...trends.map(t => t.wpm))
  const minWPM = Math.min(...trends.map(t => t.wpm))
  const range = maxWPM - minWPM || 1

  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.surface }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
        Performance Trend
      </h3>
      <div className="relative h-32">
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient id="wpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* WPM Line - only show if more than one point */}
          {trends.length > 1 && (
            <polyline
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
              points={trends.map((trend, index) => {
                const x = trends.length === 1 ? 50 : (index / (trends.length - 1)) * 100
                const y = 100 - ((trend.wpm - minWPM) / range) * 80
                return `${x},${y}`
              }).join(' ')}
            />
          )}
          
          {/* Data points */}
          {trends.map((trend, index) => {
            const x = trends.length === 1 ? 50 : (index / (trends.length - 1)) * 100
            const y = 100 - ((trend.wpm - minWPM) / range) * 80
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={theme.colors.primary}
              />
            )
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs mt-2" style={{ color: theme.colors.textMuted }}>
        <span>{trends[0]?.date || 'N/A'}</span>
        {trends.length > 1 && <span>{trends[trends.length - 1]?.date || 'N/A'}</span>}
      </div>
    </div>
  )
}

const PerformanceDashboard = () => {
  try {
    const { 
      stats, 
      sessionStats, 
      getInsights, 
      getTestsByTimeframe, 
      getStatsForTimeframe,
      getPerformanceTrends,
      getStatsByMode 
    } = usePerformance()
    const { theme } = useTheme()
    const [selectedTest, setSelectedTest] = useState(null)

  // Use only 1 day (last 24 hours) data with error handling
  const todayStats = useMemo(() => {
    try {
      return getStatsForTimeframe('1day') || {
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        totalTime: 0,
        totalErrors: 0,
        improvementRate: 0
      }
    } catch (error) {
      console.error('Error getting today stats:', error)
      return {
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        totalTime: 0,
        totalErrors: 0,
        improvementRate: 0
      }
    }
  }, [getStatsForTimeframe])

  const todayTests = useMemo(() => {
    try {
      return getTestsByTimeframe('1day') || []
    } catch (error) {
      console.error('Error getting today tests:', error)
      return []
    }
  }, [getTestsByTimeframe])

  const performanceTrends = useMemo(() => {
    try {
      return getPerformanceTrends('1day') || []
    } catch (error) {
      console.error('Error getting performance trends:', error)
      return []
    }
  }, [getPerformanceTrends])

  const modeStats = useMemo(() => {
    try {
      return getStatsByMode('1day') || {}
    } catch (error) {
      console.error('Error getting mode stats:', error)
      return {}
    }
  }, [getStatsByMode])

  const insights = getInsights() || []

  const handleViewTest = (test) => {
    setSelectedTest(test)
  }

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  // Show loading state if theme is not available
  if (!theme) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your performance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
            Today's Performance
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Your typing progress from the last 24 hours
          </p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatCard
          title="Average WPM"
          value={todayStats.averageWPM || 0}
          subtitle={`Best: ${todayStats.bestWPM || 0} WPM`}
          icon={Zap}
          trend={todayStats.improvementRate}
          color={theme.colors.primary}
        />
        
        <StatCard
          title="Average Accuracy"
          value={`${todayStats.averageAccuracy || 0}%`}
          subtitle={`${todayStats.totalErrors || 0} total errors`}
          icon={Target}
          color={theme.colors.correct}
        />
        
        <StatCard
          title="Tests Completed"
          value={todayStats.totalTests || 0}
          subtitle={`${Math.round((todayStats.totalTime || 0) / 60)}min practiced`}
          icon={Trophy}
          color={theme.colors.accent}
        />
        
        <StatCard
          title="Current Streak"
          value={stats.streak}
          subtitle="Consecutive good tests"
          icon={Flame}
          color={theme.colors.secondary}
        />
      </motion.div>

      {/* Performance Trend Chart */}
      {performanceTrends.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PerformanceTrendChart trends={performanceTrends} />
        </motion.div>
      )}

      {/* Mode Statistics */}
      {Object.keys(modeStats).length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {Object.entries(modeStats).map(([mode, stats]) => (
            <div key={mode} className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.surface }}>
              <h3 className="text-lg font-semibold mb-4 capitalize" style={{ color: theme.colors.text }}>
                {mode} Mode
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Tests</span>
                  <span className="font-bold" style={{ color: theme.colors.text }}>{stats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Avg WPM</span>
                  <span className="font-bold" style={{ color: theme.colors.primary }}>{stats.averageWPM}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Best WPM</span>
                  <span className="font-bold" style={{ color: theme.colors.accent }}>{stats.bestWPM}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Avg Accuracy</span>
                  <span className="font-bold" style={{ color: theme.colors.correct }}>{stats.averageAccuracy}%</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            Performance Insights
          </h3>
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderLeftColor: insight.type === 'success' ? theme.colors.correct : theme.colors.primary
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{insight.icon}</span>
                <p style={{ color: theme.colors.text }}>{insight.message}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Test History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>
          Today's Test History
        </h3>
        <TestHistoryCard tests={todayTests} onViewTest={handleViewTest} />
      </motion.div>

      {/* Single Test Detail Modal */}
      {selectedTest && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedTest(null)}
        >
          <motion.div
            className="max-w-2xl w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: theme.colors.text }}>
                Test Details
              </h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: theme.colors.textMuted }}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <div className="text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
                  {selectedTest.wpm}
                </div>
                <div className="text-sm" style={{ color: theme.colors.textMuted }}>WPM</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                <div className="text-2xl font-bold mb-1" style={{ color: theme.colors.correct }}>
                  {selectedTest.accuracy}%
                </div>
                <div className="text-sm" style={{ color: theme.colors.textMuted }}>Accuracy</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Date & Time</span>
                <span style={{ color: theme.colors.text }}>
                  {new Date(selectedTest.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Mode</span>
                <span style={{ color: theme.colors.text }}>{selectedTest.mode}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Duration</span>
                <span style={{ color: theme.colors.text }}>{selectedTest.timeElapsed?.toFixed(1) || selectedTest.duration}s</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Characters Typed</span>
                <span style={{ color: theme.colors.text }}>{selectedTest.totalCharacters}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Errors</span>
                <span style={{ color: theme.colors.incorrect }}>{selectedTest.errors}</span>
              </div>
              {selectedTest.contentType && (
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Content Type</span>
                  <span style={{ color: theme.colors.text }}>{selectedTest.contentType}</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">Something went wrong loading the dashboard.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }
}

export default PerformanceDashboard
