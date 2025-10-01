import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Check, X, Sparkles, Palette, BarChart3, Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const PremiumModal = ({ isOpen, onClose }) => {
  const { theme, upgradeToPremium } = useTheme()

  const features = [
    {
      icon: <Palette size={20} />,
      title: "Premium Themes",
      description: "Access to 10+ exclusive themes including Neon Cyberpunk, Ocean Depths, and more"
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Advanced Statistics",
      description: "Detailed analytics, progress tracking, and performance insights"
    },
    {
      icon: <Zap size={20} />,
      title: "Custom Text Import",
      description: "Practice with your own texts, books, and custom content"
    },
    {
      icon: <Sparkles size={20} />,
      title: "Personalization",
      description: "Custom fonts, text sizes, and advanced display options"
    }
  ]

  const handleUpgrade = () => {
    // For now, upgrade is free - payment integration will be added later
    upgradeToPremium()
    onClose()
    
    // Show success message (optional)
    console.log('Premium upgrade successful! Payment integration coming soon.')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-w-2xl w-full rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme.colors.surface }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 text-center"
                 style={{
                   background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                 }}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
              
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown size={32} className="text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Upgrade to Premium
              </h2>
              <p className="text-white/80">
                Unlock the full potential of TypeMaster
              </p>
            </div>

            {/* Features */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg"
                    style={{ backgroundColor: theme.colors.background }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg"
                         style={{ backgroundColor: theme.colors.primary + '20' }}>
                      <div style={{ color: theme.colors.primary }}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: theme.colors.text }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="inline-block p-6 rounded-xl"
                     style={{ backgroundColor: theme.colors.background }}>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold" style={{ color: theme.colors.correct }}>
                      FREE
                    </span>
                    <span className="text-lg ml-1" style={{ color: theme.colors.textSecondary }}>
                      for now
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                    Payment integration coming soon • Full access included
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleUpgrade}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center space-x-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown size={20} />
                  <span>Get Premium Access</span>
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg font-medium border"
                  style={{ 
                    color: theme.colors.textSecondary,
                    borderColor: theme.colors.border 
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Maybe Later
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm"
                   style={{ color: theme.colors.textMuted }}>
                <div className="flex items-center space-x-1">
                  <Check size={16} style={{ color: theme.colors.correct }} />
                  <span>No commitment</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check size={16} style={{ color: theme.colors.correct }} />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check size={16} style={{ color: theme.colors.correct }} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PremiumModal
