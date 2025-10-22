import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Users, Image as ImageIcon, Smile } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import io from 'socket.io-client'
import toast from 'react-hot-toast'

const FarmerConnect = () => {
  const { user } = useAuthStore()
  const { language } = useThemeStore()
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [room, setRoom] = useState('general')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket']
    })

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      newSocket.emit('join', { room })
    })

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data])
    })

    newSocket.on('user_typing', (data) => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
    })

    setSocket(newSocket)

    // Load some mock messages
    setMessages([
      {
        user_id: 1,
        username: 'Ramesh Kumar',
        message: 'Hello everyone! Anyone knows about wheat disease prevention?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        user_id: 2,
        username: 'Suresh Patel',
        message: 'Use neem-based pesticides. They work great!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ])

    return () => {
      if (newSocket) {
        newSocket.emit('leave', { room })
        newSocket.disconnect()
      }
    }
  }, [room])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    if (socket && socket.connected) {
      socket.emit('send_message', {
        user_id: user?.id,
        message,
        room
      })
      setMessage('')
    } else {
      // Add message locally if socket not connected
      const newMsg = {
        user_id: user?.id,
        username: user?.name,
        message,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, newMsg])
      setMessage('')
    }
  }

  const handleTyping = () => {
    if (socket && socket.connected) {
      socket.emit('typing', { username: user?.name, room })
    }
  }

  const rooms = [
    { id: 'general', name: 'General', nameHi: 'सामान्य' },
    { id: 'wheat', name: 'Wheat Farmers', nameHi: 'गेहूं किसान' },
    { id: 'rice', name: 'Rice Farmers', nameHi: 'चावल किसान' },
    { id: 'vegetables', name: 'Vegetable Growers', nameHi: 'सब्जी उत्पादक' },
    { id: 'help', name: 'Help & Support', nameHi: 'मदद और सहायता' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Farmer Connect' : 'किसान कनेक्ट'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Connect with fellow farmers in real-time' 
            : 'साथी किसानों से वास्तविक समय में जुड़ें'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rooms Sidebar */}
        <div className="lg:col-span-1 card">
          <h2 className="font-bold mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            {language === 'en' ? 'Chat Rooms' : 'चैट रूम'}
          </h2>
          <div className="space-y-2">
            {rooms.map(r => (
              <button
                key={r.id}
                onClick={() => setRoom(r.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  room === r.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {language === 'en' ? r.name : r.nameHi}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 card flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h2 className="font-bold text-xl">
              {language === 'en' 
                ? rooms.find(r => r.id === room)?.name 
                : rooms.find(r => r.id === room)?.nameHi}
            </h2>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Online users: 23' : 'ऑनलाइन उपयोगकर्ता: 23'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  msg.user_id === user?.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800'
                } rounded-lg p-3`}>
                  {msg.user_id !== user?.id && (
                    <p className="font-semibold text-sm mb-1">{msg.username}</p>
                  )}
                  <p className="break-words">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.user_id === user?.id ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Someone is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button 
              type="button"
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ImageIcon size={20} />
            </button>
            <button 
              type="button"
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              className="flex-1 input-field"
              placeholder={language === 'en' ? 'Type your message...' : 'अपना संदेश टाइप करें...'}
            />
            <button 
              type="submit"
              className="btn-primary px-6 flex items-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FarmerConnect