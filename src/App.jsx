import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PrivateRoute from './components/Auth/PrivateRoute';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';
import LandingPage from './pages/LandingPage';
import PerformanceDashboard from './components/Dashboard/PerformanceDashboard';
import PracticeMode from './components/TypingModes/PracticeMode';
import DeveloperTest from './components/TypingModes/DeveloperTest';
import TimedTest from './components/TypingModes/TimedTest';
import CustomText from './components/TypingModes/CustomText';
import TestAnalytics from './components/Analytics/TestAnalytics';
import DetailedTestAnalytics from './components/Analytics/DetailedTestAnalytics';
import ThemeSelector from './components/ThemeSelector';
import PremiumModal from './components/PremiumModal';

const AppRoutes = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    const validViews = ['dashboard', 'practice', 'developer', 'timed', 'custom', 'analytics', 'settings'];
    if (validViews.includes(path) && path !== activeView) {
      setActiveView(path);
    } else if (!validViews.includes(path) && activeView !== 'dashboard') {
      setActiveView('dashboard');
    }
  }, [location.pathname, activeView]);

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      {[
        {
          path: '/dashboard',
          element: <PerformanceDashboard />,
        },
        {
          path: '/practice',
          element: (
            <PracticeMode 
              onShowAnalytics={handleShowAnalytics} 
              onShowDetailedAnalytics={handleShowDetailedAnalytics} 
            />
          ),
        },
        {
          path: '/developer',
          element: (
            <DeveloperTest
              onShowAnalytics={handleShowAnalytics}
              onShowDetailedAnalytics={handleShowDetailedAnalytics}
            />
          ),
        },
        {
          path: '/timed',
          element: (
            <TimedTest 
              onShowAnalytics={handleShowAnalytics} 
              onShowDetailedAnalytics={handleShowDetailedAnalytics} 
            />
          ),
        },
        {
          path: '/custom',
          element: (
            <CustomText 
              onShowAnalytics={handleShowAnalytics} 
              onShowDetailedAnalytics={handleShowDetailedAnalytics} 
            />
          ),
        },
        {
          path: '/analytics',
          element: (
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
          ),
        },
        {
          path: '/settings',
          element: (
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
          ),
        }
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <AuthenticatedLayout
                activeView={activeView}
                setActiveView={setActiveView}
                analyticsData={analyticsData}
                showAnalytics={showAnalytics}
                showDetailedAnalytics={showDetailedAnalytics}
                onBackFromAnalytics={handleBackFromAnalytics}
                onShowAnalytics={handleShowAnalytics}
                onShowDetailedAnalytics={handleShowDetailedAnalytics}
                isThemeSelectorOpen={isThemeSelectorOpen}
                onThemeClick={() => setIsThemeSelectorOpen(true)}
                onCloseThemeSelector={() => setIsThemeSelectorOpen(false)}
                isPremiumModalOpen={isPremiumModalOpen}
                onClosePremiumModal={() => setIsPremiumModalOpen(false)}
              >
                {element}
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
      ))}
      
      {/* Catch all other routes and redirect to appropriate page */}
      <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <PerformanceProvider>
            <ContentProvider>
              <AppRoutes />
            </ContentProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
