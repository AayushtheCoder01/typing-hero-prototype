import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../Navigation/Sidebar';
import TestAnalytics from '../Analytics/TestAnalytics';
import DetailedTestAnalytics from '../Analytics/DetailedTestAnalytics';
import ThemeSelector from '../ThemeSelector';
import PremiumModal from '../PremiumModal';

const AuthenticatedLayout = ({
  activeView,
  setActiveView,
  children,
  analyticsData,
  showAnalytics,
  showDetailedAnalytics,
  onBackFromAnalytics,
  onShowAnalytics,
  onShowDetailedAnalytics,
  isThemeSelectorOpen,
  onThemeClick,
  onCloseThemeSelector,
  isPremiumModalOpen,
  onClosePremiumModal
}) => {
  const { theme } = useTheme();

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
        onThemeClick={onThemeClick}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {showDetailedAnalytics ? (
              <DetailedTestAnalytics 
                results={analyticsData} 
                onBack={onBackFromAnalytics}
              />
            ) : showAnalytics ? (
              <TestAnalytics 
                results={analyticsData} 
                onBack={onBackFromAnalytics}
                onShowDetailed={onShowDetailedAnalytics}
              />
            ) : (
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <ThemeSelector 
        isOpen={isThemeSelectorOpen}
        onClose={onCloseThemeSelector}
      />
      
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={onClosePremiumModal}
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
  );
};

export default AuthenticatedLayout;
