import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { Crown, Lock, Check } from 'lucide-react'

const ThemeSelector = ({ isOpen, onClose }) => {
  const { themes, currentTheme, changeTheme, isPremium, theme } = useTheme()

  const handleThemeChange = (themeName) => {
    const success = changeTheme(themeName)
    if (success) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-6"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                Choose Your Theme
              </h2>
              {!isPremium && (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full" 
                     style={{ backgroundColor: theme.colors.primary + '20' }}>
                  <Crown size={16} style={{ color: theme.colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: theme.colors.primary }}>
                    Upgrade for Premium Themes
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(themes).map(([key, themeData]) => (
                <motion.div
                  key={key}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    currentTheme === key ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: themeData.colors.background,
                    borderColor: currentTheme === key ? themeData.colors.primary : themeData.colors.border,
                    ringColor: currentTheme === key ? themeData.colors.primary : 'transparent'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(key)}
                >
                  {/* Premium Badge */}
                  {themeData.premium && (
                    <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                         style={{ 
                           backgroundColor: themeData.colors.primary + '20',
                           color: themeData.colors.primary 
                         }}>
                      {isPremium ? <Crown size={12} /> : <Lock size={12} />}
                      <span>{isPremium ? 'Premium' : 'Locked'}</span>
                    </div>
                  )}

                  {/* Current Theme Indicator */}
                  {currentTheme === key && (
                    <div className="absolute top-2 left-2 p-1 rounded-full"
                         style={{ backgroundColor: themeData.colors.primary }}>
                      <Check size={12} style={{ color: themeData.colors.background }} />
                    </div>
                  )}

                  {/* Theme Preview */}
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2" style={{ color: themeData.colors.text }}>
                      {themeData.name}
                    </h3>
                    
                    {/* Color Palette */}
                    <div className="flex space-x-1 mb-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeData.colors.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeData.colors.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeData.colors.accent }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeData.colors.correct }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeData.colors.incorrect }} />
                    </div>

                    {/* Sample Text */}
                    <div className="text-sm font-mono leading-relaxed p-2 rounded"
                         style={{ backgroundColor: themeData.colors.surface }}>
                      <span style={{ color: themeData.colors.correct }}>The</span>
                      <span style={{ color: themeData.colors.text }}> quick </span>
                      <span style={{ color: themeData.colors.incorrect, backgroundColor: themeData.colors.incorrect + '20' }}>b</span>
                      <span style={{ color: themeData.colors.current }}>r</span>
                      <span style={{ color: themeData.colors.textMuted }}>own fox</span>
                    </div>
                  </div>

                  {/* Gradient Preview */}
                  <div className="h-2 rounded-full bg-gradient-to-r"
                       style={{
                         background: `linear-gradient(to right, ${themeData.colors.primary}, ${themeData.colors.accent})`
                       }} />

                  {/* Locked Overlay */}
                  {themeData.premium && !isPremium && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Lock size={24} className="mx-auto mb-2 text-white" />
                        <span className="text-white text-sm font-medium">Premium</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Premium Upgrade CTA */}
            {!isPremium && (
              <motion.div
                className="mt-6 p-4 rounded-lg text-center"
                style={{ backgroundColor: theme.colors.primary + '10' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.primary }}>
                  Unlock Premium Themes
                </h3>
                <p className="mb-4" style={{ color: theme.colors.textSecondary }}>
                  Get access to exclusive themes and advanced customization options
                </p>
                <motion.button
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upgrade to Premium - $4.99/month
                </motion.button>
              </motion.div>
            )}

            <div className="flex justify-end mt-6">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.background 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ThemeSelector
