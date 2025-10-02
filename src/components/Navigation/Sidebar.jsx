import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Target, 
  Settings, 
  Crown, 
  Palette,
  FileText,
  LogOut,
  Clock,
  User,
  Code2
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onThemeClick }) => {
  const { theme, isPremium, upgradeToPremium } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview & stats' },
    { id: 'practice', label: 'Practice', icon: Target, description: 'Free typing practice' },
    { id: 'developer', label: 'Developer Test', icon: Code2, description: 'Code snippet drills' },
    { id: 'timed', label: 'Timed Test', icon: Clock, description: '1, 3, 5 minute tests', premium: true },
    { id: 'custom', label: 'Custom Text', icon: FileText, description: 'Import your own text', premium: true },
  ];

  const bottomItems = [
    { id: 'themes', label: 'Themes', icon: Palette, action: onThemeClick },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  const MenuItem = ({ item, isBottom = false }) => {
    const isActive = activeView === item.id;
    const isLocked = item.premium && !isPremium;
    
    const handleClick = () => {
      if (item.action) {
        item.action();
      } else {
        setActiveView(item.id);
        navigate(`/${item.id}`);
      }
    };

    return (
      <motion.button
        layout
        onClick={handleClick}
        className="relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 hover:opacity-90"
        style={{
          color: isActive ? theme.colors.primary : theme.colors.textSecondary,
          marginBottom: '0.5rem',
          pointerEvents: isLocked ? 'none' : 'auto',
          opacity: isLocked ? 0.6 : 1,
        }}
        whileHover={{ x: 6 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <motion.span
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 rounded-xl"
            style={{ backgroundColor: `${theme.colors.primary}1f` }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          />
        )}

        <div className="relative flex items-center space-x-3 w-full">
          <item.icon size={20} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: isActive ? theme.colors.text : theme.colors.text }}>
                {item.label}
              </span>
              {item.premium && (
                <Crown size={12} className="text-yellow-500" />
              )}
            </div>
            {item.description && !isBottom && (
              <div className="text-xs opacity-75 truncate" style={{ color: theme.colors.textSecondary }}>
                {item.description}
              </div>
            )}
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <motion.div 
      layout
      className="flex flex-col h-screen p-4 w-64 border-r transition-colors duration-300 justify-between"
      style={{
        backgroundColor: theme.colors.backgroundSecondary || theme.colors.background,
        borderColor: theme.colors.border,
        color: theme.colors.text,
      }}
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
    >
      <div>
        {/* App Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div 
            className="w-10 h-10 rounded-xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
            }}
          />
          <div>
            <h1 className="text-xl font-bold" style={{ color: theme.colors.text }}>
              Typing Hero
            </h1>
            {isPremium && (
              <div className="flex items-center space-x-1 text-xs" style={{ color: theme.colors.primary }}>
                <Crown size={12} />
                <span>Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div 
            className="flex items-center space-x-3 p-3 mb-6 rounded-lg bg-opacity-20" 
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
              style={{ 
                backgroundColor: theme.colors.primary, 
                color: 'white' 
              }}
            >
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate" style={{ color: theme.colors.text }}>
                {user.name}
              </p>
              <p className="text-xs truncate" style={{ color: theme.colors.textSecondary }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1 mb-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            >
              <MenuItem item={item} />
            </motion.div>
          ))}
        </nav>

        {/* Premium Upgrade CTA */}
        {!isPremium && (
          <motion.div
            className="p-4 mb-6 rounded-lg text-center"
            style={{ backgroundColor: `${theme.colors.primary}10` }}
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
              onClick={upgradeToPremium}
            >
              Get Free Access
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t pt-4 space-y-1" style={{ borderColor: theme.colors.border }}>
        {bottomItems.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05, ease: 'easeOut' }}
          >
            <MenuItem item={item} isBottom />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
