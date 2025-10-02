import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loading, error, clearError, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError();
  }, [formData, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme.colors.background }}>
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` }}
            whileHover={{ scale: 1.05 }}
          >
            <Lock size={24} color="white" />
          </motion.div>
          <h2 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
            Welcome back
          </h2>
          <p className="mt-2 text-sm" style={{ color: theme.colors.textSecondary }}>
            Sign in to your TypeMaster account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="p-4 rounded-lg border flex items-center space-x-3"
            style={{ 
              backgroundColor: `${theme.colors.error}10`,
              borderColor: theme.colors.error,
              color: theme.colors.error
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} style={{ color: theme.colors.textSecondary }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    focusRingColor: theme.colors.primary
                  }}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{ color: theme.colors.textSecondary }} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    focusRingColor: theme.colors.primary
                  }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff size={20} style={{ color: theme.colors.textSecondary }} />
                  ) : (
                    <Eye size={20} style={{ color: theme.colors.textSecondary }} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.colors.primary }}
            whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium hover:underline transition-colors"
              style={{ color: theme.colors.primary }}
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Account Info */}
        <motion.div 
          className="p-4 rounded-lg border text-center"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            borderColor: `${theme.colors.primary}30`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
            Demo: Create an account or use any email/password combination
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
