import { motion } from 'framer-motion'
import { Settings, Crown, Palette, BarChart3, User } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Header = ({ onThemeClick }) => {
  const { theme, isPremium } = useTheme()

  return (
    <motion.header
      className="w-full p-4 border-b"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br"
               style={{
                 background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
               }} />
          <h1 className="text-xl font-bold" style={{ color: theme.colors.text }}>
            TypeMaster
          </h1>
          {isPremium && (
            <Crown size={16} style={{ color: theme.colors.primary }} />
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <motion.a
            href="#"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            style={{ color: theme.colors.textSecondary }}
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 size={18} />
            <span>Stats</span>
          </motion.a>
          <motion.a
            href="#"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            style={{ color: theme.colors.textSecondary }}
            whileHover={{ scale: 1.05 }}
          >
            <User size={18} />
            <span>Profile</span>
          </motion.a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={onThemeClick}
            className="p-2 rounded-lg hover:opacity-80 transition-all duration-200"
            style={{ 
              backgroundColor: theme.colors.primary + '20',
              color: theme.colors.primary 
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Palette size={20} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-lg hover:opacity-80 transition-all duration-200"
            style={{ 
              backgroundColor: theme.colors.secondary + '20',
              color: theme.colors.secondary 
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={20} />
          </motion.button>

          {!isPremium && (
            <motion.button
              className="px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown size={14} />
              <span>Premium</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header
