import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  loading: true,
  error: null,
  clearError: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check if user is logged in on initial load
      const storedUser = localStorage.getItem('typemaster_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('typemaster_user');
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('typemaster_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('typemaster_users') || '[]');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      if (foundUser.password !== password) {
        throw new Error('Incorrect password');
      }

      // Login successful
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in user object
      
      setUser(userToStore);
      localStorage.setItem('typemaster_user', JSON.stringify(userToStore));
      
      return { success: true, user: userToStore };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);

      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Get existing users
      const users = JSON.parse(localStorage.getItem('typemaster_users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('typemaster_users', JSON.stringify(users));
      
      // Auto-login after signup
      const userToStore = { ...newUser };
      delete userToStore.password; // Don't store password in user object
      
      setUser(userToStore);
      localStorage.setItem('typemaster_user', JSON.stringify(userToStore));
      
      return { success: true, user: userToStore };
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setError(null);
      localStorage.removeItem('typemaster_user');
      return { success: true };
    } catch (err) {
      console.error('Error during logout:', err);
      return { success: false, error: 'Logout failed' };
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
