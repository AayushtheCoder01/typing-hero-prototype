import { createContext, useContext, useState } from 'react'

const ContentContext = createContext()

export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

// Content categories and sources
export const contentLibrary = {
  quotes: [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "Innovation distinguishes between a leader and a follower. Think different and make a dent in the universe.",
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    "The future belongs to those who believe in the beauty of their dreams and have the courage to pursue them relentlessly.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be afraid to give up the good to go for the great.",
    "Innovation is the ability to see change as an opportunity, not a threat.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream it. Believe it. Build it.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "The only impossible journey is the one you never begin.",
    "In the middle of difficulty lies opportunity.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Everything you've ever wanted is on the other side of fear.",
    "Believe you can and you're halfway there.",
    "Act as if what you do makes a difference. It does.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "What we think, we become.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "The most difficult thing is the decision to act, the rest is merely tenacity.",
    "You are never too old to set another goal or to dream a new dream.",
    "If you want to lift yourself up, lift up someone else.",
    "I have learned throughout my life as a composer chiefly through my mistakes and pursuits of false assumptions, not by my exposure to founts of wisdom and knowledge.",
    "A person who never made a mistake never tried anything new."
  ],
  
  programming: [
    "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }",
    "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(null, args), delay); }; };",
    "class BinarySearchTree { constructor() { this.root = null; } insert(value) { this.root = this.insertNode(this.root, value); } }",
    "const quickSort = arr => arr.length <= 1 ? arr : [...quickSort(arr.slice(1).filter(x => x <= arr[0])), arr[0], ...quickSort(arr.slice(1).filter(x => x > arr[0]))];"
  ],
  
  articles: [
    "Artificial intelligence is transforming the way we work, live, and interact with technology. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions that were previously impossible for humans to detect.",
    "The rise of remote work has fundamentally changed the modern workplace. Companies are discovering that distributed teams can be just as productive, if not more so, than traditional office-based teams when given the right tools and processes.",
    "Sustainable technology is becoming increasingly important as we face climate change challenges. From renewable energy sources to efficient computing systems, innovation in green technology is driving both environmental and economic benefits.",
    "Cybersecurity has evolved from a technical concern to a business imperative. Organizations must now consider security at every level of their operations, from employee training to infrastructure design and incident response planning."
  ],
  
  literature: [
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness.",
    "To be or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.",
    "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him; and without him was not any thing made that was made.",
    "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world."
  ],
  
  numbers: [
    "1234567890 9876543210 1357924680 2468013579 5555555555 1111111111 9999999999 1234554321",
    "3.14159265359 2.71828182846 1.41421356237 1.61803398875 0.57721566490 2.30258509299",
    "100 200 300 400 500 600 700 800 900 1000 1100 1200 1300 1400 1500 1600 1700 1800 1900 2000",
    "42 is the answer to life, the universe, and everything. 7 is considered lucky. 13 is often seen as unlucky. 365 days in a year. 24 hours in a day. 60 minutes in an hour."
  ],
  
  symbols: [
    "!@#$%^&*()_+-=[]{}|;':\",./<>? ~`!@#$%^&*()_+-=[]{}|;':\",./<>? ~`",
    "The quick brown fox jumps over the lazy dog! How vexingly quick daft zebras jump? Pack my box with five dozen liquor jugs.",
    "Email: user@example.com | Website: https://www.example.com | Phone: +1 (555) 123-4567",
    "Variables: $variable, @array, %hash, &reference, *pointer, #comment, //comment, /*block*/"
  ]
}

export const ContentProvider = ({ children }) => {
  const [currentCategory, setCurrentCategory] = useState('quotes')
  const [customTexts, setCustomTexts] = useState([])
  const [difficulty, setDifficulty] = useState('medium')
  const [length, setLength] = useState('medium')

  // Get content based on current settings
  const getCurrentContent = () => {
    let content = contentLibrary[currentCategory] || contentLibrary.quotes
    
    // Add custom texts if available
    if (customTexts.length > 0) {
      content = [...content, ...customTexts]
    }
    
    return content
  }

  // Get random text from current category
  const getRandomText = () => {
    const content = getCurrentContent()
    const randomIndex = Math.floor(Math.random() * content.length)
    let text = content[randomIndex]
    
    // Adjust length based on setting
    if (length === 'short') {
      text = text.substring(0, Math.min(100, text.length))
    } else if (length === 'long') {
      // Repeat or extend text for longer practice
      while (text.length < 300) {
        const additionalText = content[Math.floor(Math.random() * content.length)]
        text += ' ' + additionalText
      }
    }
    
    return text
  }

  // Add custom text
  const addCustomText = (text) => {
    const newCustomTexts = [...customTexts, text]
    setCustomTexts(newCustomTexts)
    localStorage.setItem('customTexts', JSON.stringify(newCustomTexts))
  }

  // Remove custom text
  const removeCustomText = (index) => {
    const newCustomTexts = customTexts.filter((_, i) => i !== index)
    setCustomTexts(newCustomTexts)
    localStorage.setItem('customTexts', JSON.stringify(newCustomTexts))
  }

  // Load custom texts from localStorage
  const loadCustomTexts = () => {
    const saved = localStorage.getItem('customTexts')
    if (saved) {
      setCustomTexts(JSON.parse(saved))
    }
  }

  // Get content statistics
  const getContentStats = () => {
    const content = getCurrentContent()
    const totalTexts = content.length
    const averageLength = Math.round(
      content.reduce((sum, text) => sum + text.length, 0) / totalTexts
    )
    
    return {
      totalTexts,
      averageLength,
      categories: Object.keys(contentLibrary).length,
      customTexts: customTexts.length
    }
  }

  // Get difficulty-adjusted content
  const getDifficultyContent = () => {
    const content = getCurrentContent()
    
    switch (difficulty) {
      case 'easy':
        // Filter for shorter, simpler texts
        return content.filter(text => 
          text.length < 150 && 
          !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(text)
        )
      case 'hard':
        // Include complex punctuation and longer texts
        return content.filter(text => text.length > 100)
      default:
        return content
    }
  }

  return (
    <ContentContext.Provider value={{
      currentCategory,
      setCurrentCategory,
      customTexts,
      difficulty,
      setDifficulty,
      length,
      setLength,
      getCurrentContent,
      getRandomText,
      addCustomText,
      removeCustomText,
      loadCustomTexts,
      getContentStats,
      getDifficultyContent,
      contentLibrary
    }}>
      {children}
    </ContentContext.Provider>
  )
}
