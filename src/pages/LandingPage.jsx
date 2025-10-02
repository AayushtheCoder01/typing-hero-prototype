import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Create motion components
const MotionLink = motion(Link);

const LandingPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text }}>
            Master Your Typing Skills
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary }}>
            Improve your typing speed and accuracy with our interactive typing tests and practice exercises.
            Join thousands of users who have enhanced their typing skills with TypeMaster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <MotionLink
              to="/signup"
              className="px-8 py-3 rounded-lg text-lg font-medium text-white transition-colors"
              style={{ backgroundColor: theme.colors.primary }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started - It's Free
            </MotionLink>
            <MotionLink
              to="/login"
              className="px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              style={{ 
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
                backgroundColor: 'transparent'
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </MotionLink>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme.colors.backgroundSecondary }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.colors.text }}>
            Why Choose TypeMaster?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Track Your Progress',
                description: 'Monitor your typing speed and accuracy over time with detailed analytics and progress tracking.',
                icon: '📊'
              },
              {
                title: 'Multiple Modes',
                description: 'Practice with different modes including timed tests, custom texts, and more to improve your skills.',
                icon: '⌨️'
              },
              {
                title: 'Personalized Learning',
                description: 'Get customized exercises based on your performance to help you improve faster.',
                icon: '🎯'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="p-6 rounded-lg"
                style={{ backgroundColor: theme.colors.background }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text }}>
                  {feature.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text }}>
            Ready to improve your typing skills?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary }}>
            Join thousands of users who have already enhanced their typing speed and accuracy with TypeMaster.
          </p>
          <MotionLink
            to="/signup"
            className="inline-block px-8 py-3 rounded-lg text-lg font-medium text-white transition-colors"
            style={{ backgroundColor: theme.colors.primary }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Typing Now - It's Free
          </MotionLink>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
