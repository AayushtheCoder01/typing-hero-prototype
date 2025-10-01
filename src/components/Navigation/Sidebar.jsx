import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Home, 
  Target, 
  BarChart3, 
  Settings, 
  Crown, 
  Palette,
  FileText,
  Zap,
  Trophy,
  Clock
} from 'lucide-react'

const Sidebar = ({ activeView, setActiveView, onThemeClick }) => {
  const { theme, isPremium, upgradeToPremium } = useTheme()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview & stats' },
    { id: 'practice', label: 'Practice', icon: Target, description: 'Free typing practice' },
    { id: 'timed', label: 'Timed Test', icon: Clock, description: '1, 3, 5 minute tests', premium: true },
    { id: 'custom', label: 'Custom Text', icon: FileText, description: 'Import your own text', premium: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, description: 'Global rankings', premium: true },
  ]

  const bottomItems = [
    { id: 'themes', label: 'Themes', icon: Palette, action: onThemeClick },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const MenuItem = ({ item, isBottom = false }) => {
    const isActive = activeView === item.id
    const isLocked = item.premium && !isPremium
    
    const handleClick = () => {
      if (item.action) {
        item.action()
      } else {
        // For now, allow access to all features - payment integration coming later
        setActiveView(item.id)
      }
    }

    return (
      <motion.button
        onClick={handleClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
          isActive ? 'ring-2' : ''
        } hover:opacity-80`}
        style={{
          backgroundColor: isActive ? theme.colors.primary + '20' : 'transparent',
          color: isActive ? theme.colors.primary : theme.colors.textSecondary,
          ringColor: isActive ? theme.colors.primary : 'transparent'
        }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <item.icon size={20} />
          {isLocked && (
            <Crown 
              size={12} 
              className="absolute -top-1 -right-1 text-yellow-500"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium">{item.label}</div>
          {item.description && !isBottom && (
            <div className="text-xs opacity-75 truncate">
              {item.description}
            </div>
          )}
        </div>
        
        {isLocked && (
          <div className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600">
            Pro
          </div>
        )}
      </motion.button>
    )
  }

  return (
    <motion.aside
      className="w-64 h-screen border-r flex flex-col"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
    >
      {/* Logo */}
      <motion.div 
        className="p-6 border-b"
        style={{ borderColor: theme.colors.border }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br"
               style={{
                 background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
               }} />
          <div>
            <h1 className="text-xl font-bold" style={{ color: theme.colors.text }}>
              TypeMaster
            </h1>
            {isPremium && (
              <div className="flex items-center space-x-1 text-xs" style={{ color: theme.colors.primary }}>
                <Crown size={12} />
                <span>Premium</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <MenuItem item={item} />
          </motion.div>
        ))}
      </nav>

      {/* Premium Upgrade CTA */}
      {!isPremium && (
        <motion.div
          className="p-4 m-4 rounded-lg text-center"
          style={{ backgroundColor: theme.colors.primary + '10' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Crown size={24} style={{ color: theme.colors.primary }} className="mx-auto mb-2" />
          <h3 className="font-semibold mb-1" style={{ color: theme.colors.primary }}>
            Premium Access
          </h3>
          <p className="text-xs mb-3" style={{ color: theme.colors.textSecondary }}>
            All features currently free for testing
          </p>
          <motion.button
            className="w-full py-2 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: theme.colors.correct,
              color: theme.colors.background 
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Auto-upgrade for testing
              upgradeToPremium()
            }}
          >
            Get Free Access
          </motion.button>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: theme.colors.border }}>
        {bottomItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
          >
            <MenuItem item={item} isBottom />
          </motion.div>
        ))}
      </div>
    </motion.aside>
  )
}

export default Sidebar
