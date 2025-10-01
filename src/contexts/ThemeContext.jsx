import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const themes = {
  // Free themes
  dark: {
    name: 'Dark',
    premium: false,
    colors: {
      background: '#1a1a1a',
      surface: '#2a2a2a',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      correct: '#10b981',
      incorrect: '#ef4444',
      current: '#f59e0b',
      caret: '#3b82f6',
      border: '#374151'
    },
    gradients: {
      primary: 'from-blue-500 to-purple-600',
      accent: 'from-purple-500 to-pink-500',
      surface: 'from-gray-800 to-gray-900'
    }
  },
  light: {
    name: 'Light',
    premium: false,
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      text: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      correct: '#10b981',
      incorrect: '#ef4444',
      current: '#f59e0b',
      caret: '#3b82f6',
      border: '#e2e8f0'
    },
    gradients: {
      primary: 'from-blue-500 to-purple-600',
      accent: 'from-purple-500 to-pink-500',
      surface: 'from-gray-50 to-gray-100'
    }
  },
  
  // Premium themes
  neon: {
    name: 'Neon Cyberpunk',
    premium: true,
    colors: {
      background: '#0a0a0a',
      surface: '#111111',
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      text: '#ffffff',
      textSecondary: '#00ffff',
      textMuted: '#666666',
      correct: '#00ff00',
      incorrect: '#ff0040',
      current: '#ffff00',
      caret: '#00ffff',
      border: '#333333'
    },
    gradients: {
      primary: 'from-cyan-400 to-purple-500',
      accent: 'from-pink-500 to-yellow-400',
      surface: 'from-gray-900 to-black'
    }
  },
  ocean: {
    name: 'Ocean Depths',
    premium: true,
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#3b82f6',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
      correct: '#10b981',
      incorrect: '#f97316',
      current: '#06b6d4',
      caret: '#0ea5e9',
      border: '#334155'
    },
    gradients: {
      primary: 'from-blue-600 to-cyan-500',
      accent: 'from-cyan-400 to-blue-600',
      surface: 'from-slate-800 to-slate-900'
    }
  },
  sunset: {
    name: 'Sunset Vibes',
    premium: true,
    colors: {
      background: '#1c1917',
      surface: '#292524',
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#dc2626',
      text: '#fef7ed',
      textSecondary: '#fed7aa',
      textMuted: '#a3a3a3',
      correct: '#22c55e',
      incorrect: '#dc2626',
      current: '#f59e0b',
      caret: '#f97316',
      border: '#44403c'
    },
    gradients: {
      primary: 'from-orange-500 to-red-500',
      accent: 'from-yellow-400 to-orange-600',
      surface: 'from-stone-800 to-stone-900'
    }
  },
  forest: {
    name: 'Mystic Forest',
    premium: true,
    colors: {
      background: '#14532d',
      surface: '#166534',
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      text: '#f0fdf4',
      textSecondary: '#bbf7d0',
      textMuted: '#6b7280',
      correct: '#22c55e',
      incorrect: '#dc2626',
      current: '#84cc16',
      caret: '#22c55e',
      border: '#15803d'
    },
    gradients: {
      primary: 'from-green-500 to-emerald-600',
      accent: 'from-lime-400 to-green-500',
      surface: 'from-green-800 to-green-900'
    }
  },

  // New Cozy & Aesthetic Themes
  lavender: {
    name: 'Lavender Dreams',
    premium: true,
    colors: {
      background: '#1e1b2e',
      surface: '#2d2a3e',
      primary: '#c084fc',
      secondary: '#a855f7',
      accent: '#e879f9',
      text: '#f3f0ff',
      textSecondary: '#d8b4fe',
      textMuted: '#9ca3af',
      correct: '#34d399',
      incorrect: '#fb7185',
      current: '#fbbf24',
      caret: '#c084fc',
      border: '#4c1d95'
    },
    gradients: {
      primary: 'from-purple-400 to-pink-400',
      accent: 'from-violet-500 to-purple-600',
      surface: 'from-purple-900 to-indigo-900'
    }
  },

  coffee: {
    name: 'Coffee Shop',
    premium: true,
    colors: {
      background: '#2d1b14',
      surface: '#3c2415',
      primary: '#d97706',
      secondary: '#92400e',
      accent: '#f59e0b',
      text: '#fef3c7',
      textSecondary: '#fde68a',
      textMuted: '#a78bfa',
      correct: '#10b981',
      incorrect: '#ef4444',
      current: '#f59e0b',
      caret: '#d97706',
      border: '#451a03'
    },
    gradients: {
      primary: 'from-amber-600 to-orange-600',
      accent: 'from-yellow-500 to-amber-600',
      surface: 'from-amber-900 to-orange-900'
    }
  },

  sakura: {
    name: 'Sakura Blossom',
    premium: true,
    colors: {
      background: '#2d1b2f',
      surface: '#3f2937',
      primary: '#f472b6',
      secondary: '#ec4899',
      accent: '#fbbf24',
      text: '#fdf2f8',
      textSecondary: '#f9a8d4',
      textMuted: '#9ca3af',
      correct: '#34d399',
      incorrect: '#f87171',
      current: '#fbbf24',
      caret: '#f472b6',
      border: '#831843'
    },
    gradients: {
      primary: 'from-pink-400 to-rose-400',
      accent: 'from-rose-300 to-pink-500',
      surface: 'from-rose-900 to-pink-900'
    }
  },

  midnight: {
    name: 'Midnight Blue',
    premium: true,
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#a78bfa',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
      correct: '#22d3ee',
      incorrect: '#f472b6',
      current: '#fbbf24',
      caret: '#60a5fa',
      border: '#334155'
    },
    gradients: {
      primary: 'from-blue-400 to-indigo-500',
      accent: 'from-indigo-400 to-purple-500',
      surface: 'from-slate-800 to-slate-900'
    }
  },

  autumn: {
    name: 'Autumn Leaves',
    premium: true,
    colors: {
      background: '#1c1917',
      surface: '#292524',
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      text: '#fef7ed',
      textSecondary: '#fed7aa',
      textMuted: '#a3a3a3',
      correct: '#65a30d',
      incorrect: '#dc2626',
      current: '#f59e0b',
      caret: '#ea580c',
      border: '#57534e'
    },
    gradients: {
      primary: 'from-orange-600 to-red-600',
      accent: 'from-amber-500 to-orange-600',
      surface: 'from-stone-800 to-amber-900'
    }
  },

  mint: {
    name: 'Fresh Mint',
    premium: true,
    colors: {
      background: '#064e3b',
      surface: '#065f46',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      text: '#ecfdf5',
      textSecondary: '#a7f3d0',
      textMuted: '#6b7280',
      correct: '#22c55e',
      incorrect: '#f87171',
      current: '#fbbf24',
      caret: '#10b981',
      border: '#047857'
    },
    gradients: {
      primary: 'from-emerald-500 to-teal-500',
      accent: 'from-green-400 to-emerald-500',
      surface: 'from-emerald-800 to-teal-800'
    }
  },

  rose: {
    name: 'Rose Garden',
    premium: true,
    colors: {
      background: '#2d1b2f',
      surface: '#3f2937',
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fb7185',
      text: '#fdf2f8',
      textSecondary: '#fecdd3',
      textMuted: '#9ca3af',
      correct: '#22c55e',
      incorrect: '#ef4444',
      current: '#fbbf24',
      caret: '#f43f5e',
      border: '#881337'
    },
    gradients: {
      primary: 'from-rose-500 to-pink-500',
      accent: 'from-pink-400 to-rose-500',
      surface: 'from-rose-900 to-pink-900'
    }
  },

  arctic: {
    name: 'Arctic Frost',
    premium: true,
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      text: '#f0f9ff',
      textSecondary: '#bae6fd',
      textMuted: '#64748b',
      correct: '#22d3ee',
      incorrect: '#f472b6',
      current: '#fbbf24',
      caret: '#0ea5e9',
      border: '#334155'
    },
    gradients: {
      primary: 'from-sky-400 to-cyan-400',
      accent: 'from-cyan-300 to-blue-400',
      surface: 'from-slate-800 to-sky-900'
    }
  },

  warm: {
    name: 'Warm Embrace',
    premium: false,
    colors: {
      background: '#fef7ed',
      surface: '#fed7aa',
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      text: '#1c1917',
      textSecondary: '#451a03',
      textMuted: '#78716c',
      correct: '#16a34a',
      incorrect: '#dc2626',
      current: '#d97706',
      caret: '#ea580c',
      border: '#fdba74'
    },
    gradients: {
      primary: 'from-orange-400 to-amber-500',
      accent: 'from-amber-400 to-orange-500',
      surface: 'from-orange-50 to-amber-100'
    }
  },

  monochrome: {
    name: 'Monochrome',
    premium: false,
    colors: {
      background: '#18181b',
      surface: '#27272a',
      primary: '#f4f4f5',
      secondary: '#d4d4d8',
      accent: '#a1a1aa',
      text: '#fafafa',
      textSecondary: '#e4e4e7',
      textMuted: '#71717a',
      correct: '#22c55e',
      incorrect: '#ef4444',
      current: '#fbbf24',
      caret: '#f4f4f5',
      border: '#3f3f46'
    },
    gradients: {
      primary: 'from-gray-200 to-gray-400',
      accent: 'from-gray-400 to-gray-600',
      surface: 'from-zinc-800 to-gray-900'
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('typingTheme')
    const savedPremium = localStorage.getItem('isPremium') === 'true'
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    setIsPremium(savedPremium)
  }, [])

  const changeTheme = (themeName) => {
    const theme = themes[themeName]
    if (!theme) return
    
    // For now, all themes are accessible - payment integration coming later
    if (theme.premium && !isPremium) {
      // Temporarily grant premium access for testing
      setIsPremium(true)
      localStorage.setItem('isPremium', 'true')
    }
    
    setCurrentTheme(themeName)
    localStorage.setItem('typingTheme', themeName)
    return true
  }

  const upgradeToPremium = () => {
    setIsPremium(true)
    localStorage.setItem('isPremium', 'true')
  }

  const theme = themes[currentTheme]

  // Apply CSS variables for the current theme
  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme,
      themes,
      changeTheme,
      isPremium,
      upgradeToPremium
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
