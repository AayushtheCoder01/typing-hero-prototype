import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { PerformanceProvider } from './contexts/PerformanceContext'
import { ContentProvider } from './contexts/ContentContext'
import Sidebar from './components/Navigation/Sidebar'
import PerformanceDashboard from './components/Dashboard/PerformanceDashboard'
import PracticeMode from './components/TypingModes/PracticeMode'
import TimedTest from './components/TypingModes/TimedTest'
import CustomText from './components/TypingModes/CustomText'
import TestAnalytics from './components/Analytics/TestAnalytics'
import DetailedTestAnalytics from './components/Analytics/DetailedTestAnalytics'
import ThemeSelector from './components/ThemeSelector'
import PremiumModal from './components/PremiumModal'

function AppContent() {
  const { theme } = useTheme()
  const [activeView, setActiveView] = useState('dashboard')
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false)
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)

  const handleShowAnalytics = (results) => {
    setAnalyticsData(results)
    setShowAnalytics(true)
  }

  const handleShowDetailedAnalytics = (results) => {
    setAnalyticsData(results)
    setShowDetailedAnalytics(true)
  }

  const handleBackFromAnalytics = () => {
    setShowAnalytics(false)
    setShowDetailedAnalytics(false)
    setAnalyticsData(null)
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <PerformanceDashboard />
      case 'practice':
        return <PracticeMode onShowAnalytics={handleShowAnalytics} onShowDetailedAnalytics={handleShowDetailedAnalytics} />
      case 'timed':
        return <TimedTest onShowAnalytics={handleShowAnalytics} onShowDetailedAnalytics={handleShowDetailedAnalytics} />
      case 'custom':
        return <CustomText onShowAnalytics={handleShowAnalytics} onShowDetailedAnalytics={handleShowDetailedAnalytics} />
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Advanced Analytics
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Detailed performance analytics and insights.
              </p>
            </div>
          </div>
        )
      case 'leaderboard':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Global Leaderboard
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Compete with typists worldwide. Premium feature.
              </p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Settings
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                Customize your typing experience.
              </p>
            </div>
          </div>
        )
      default:
        return <PerformanceDashboard />
    }
  }

  return (
    <motion.div
      className="min-h-screen flex transition-all duration-500"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        onThemeClick={() => setIsThemeSelectorOpen(true)}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {showDetailedAnalytics ? (
              <DetailedTestAnalytics 
                results={analyticsData} 
                onBack={handleBackFromAnalytics}
              />
            ) : showAnalytics ? (
              <TestAnalytics 
                results={analyticsData} 
                onBack={handleBackFromAnalytics}
                onShowDetailed={handleShowDetailedAnalytics}
              />
            ) : (
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderMainContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <ThemeSelector 
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />
      
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />

      {/* Background Gradient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-3 -z-10"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${theme.colors.primary}20, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${theme.colors.accent}20, transparent 50%)`
        }}
      />
    </motion.div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PerformanceProvider>
        <ContentProvider>
          <AppContent />
        </ContentProvider>
      </PerformanceProvider>
    </ThemeProvider>
  )
}

export default App
