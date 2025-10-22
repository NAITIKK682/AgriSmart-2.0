import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Mic, Sparkles } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { aiAPI } from '../utils/api'
import toast from 'react-hot-toast'

const AIChat = () => {
  const { language } = useThemeStore()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: language === 'en' 
        ? "Hello! I'm Ayushmann, your AI farming assistant. How can I help you today? Ask me anything about farming, crops, weather, or agriculture practices."
        : "नमस्ते! मैं आयुष्मान हूं, आपका एआई खेती सहायक। आज मैं आपकी कैसे मदद कर सकता हूं? खेती, फसलों, मौसम या कृषि प्रथाओं के बारे में मुझसे कुछ भी पूछें।"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const quickQuestions = [
    {
      en: 'What is the best time to plant wheat?',
      hi: 'गेहूं लगाने का सबसे अच्छा समय क्या है?'
    },
    {
      en: 'How to control pests organically?',
      hi: 'जैविक रूप से कीटों को कैसे नियंत्रित करें?'
    },
    {
      en: 'Best fertilizer for rice?',
      hi: 'चावल के लिए सबसे अच्छा उर्वरक?'
    },
    {
      en: 'How to improve soil health?',
      hi: 'मिट्टी के स्वास्थ्य में सुधार कैसे करें?'
    },
  ]

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await aiAPI.chat({
        question: userMessage,
        language: language
      })

      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.data.answer
      }])
    } catch (error) {
      console.error('AI Chat error:', error)
      // Fallback to mock response
      const mockResponse = language === 'en'
        ? "I understand your question about farming. Based on your query, I recommend consulting with local agricultural experts and considering factors like soil type, climate, and water availability. For more specific advice, please provide additional details about your location and crop type."
        : "मैं खेती के बारे में आपके प्रश्न को समझता हूं। आपकी पूछताछ के आधार पर, मैं स्थानीय कृषि विशेषज्ञों से परामर्श करने और मिट्टी के प्रकार, जलवायु और पानी की उपलब्धता जैसे कारकों पर विचार करने की सलाह देता हूं।"
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: mockResponse
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInput(language === 'en' ? question.en : question.hi)
  }

  // ✅ ElevenLabs Text-to-Speech Function (NEW)
  const speakText = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (data.audio) {
        const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        toast.error(language === 'en' ? "Failed to generate speech" : "ध्वनि उत्पन्न करने में विफल");
      }
    } catch (err) {
      console.error("TTS Error:", err);
      toast.error(language === 'en' ? "Voice service unavailable" : "ध्वनि सेवा अनुपलब्ध");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {language === 'en' ? 'Ayushmann AI Assistant' : 'आयुष्मान एआई सहायक'}
            </h1>
            <p className="text-purple-100">
              {language === 'en' 
                ? 'Your 24/7 bilingual farming expert powered by AI' 
                : 'एआई द्वारा संचालित आपका 24/7 द्विभाषी खेती विशेषज्ञ'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="card">
        <h2 className="font-bold mb-4 flex items-center">
          <Sparkles size={20} className="mr-2 text-yellow-500" />
          {language === 'en' ? 'Quick Questions' : 'त्वरित प्रश्न'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(q)}
              className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-3 text-left text-sm transition-colors"
            >
              {language === 'en' ? q.en : q.hi}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="card">
        <div className="h-[500px] overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai' 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot size={20} className="text-white" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.type === 'ai' 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'bg-primary-500 text-white'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {/* ✅ NEW: Listen Button for AI Messages */}
                  {message.type === 'ai' && (
                    <button
                      onClick={() => speakText(message.content)}
                      className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center"
                      title={language === 'en' ? "Listen to this response" : "इस प्रतिक्रिया को सुनें"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"></path>
                        <path d="M12 18a4 4 0 0 0 4-4V8a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4z"></path>
                      </svg>
                      {language === 'en' ? "Listen" : "सुनें"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button 
            type="button"
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Voice input (Coming soon)"
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 input-field"
            placeholder={language === 'en' ? 'Ask me anything about farming...' : 'खेती के बारे में मुझसे कुछ भी पूछें...'}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-6 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <h3 className="font-bold mb-2">🌐 Bilingual Support</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Chat in Hindi or English. Ayushmann understands both languages perfectly.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <h3 className="font-bold mb-2">🧠 AI-Powered</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Advanced AI trained on agricultural data and farming practices.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <h3 className="font-bold mb-2">⚡ Instant Answers</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Get immediate responses to your farming questions 24/7.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIChat