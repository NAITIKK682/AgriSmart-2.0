import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Cloud, Scan, ShoppingCart, BookOpen, Droplets, 
  Users, FileText, MessageSquare, Bot, User, LogOut, 
  Menu, X, Sun, Moon, Globe 
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleTheme, language, setLanguage } = useThemeStore()

  const menuItems = [
    { path: '/app/dashboard', icon: Home, label: 'Dashboard', labelHi: 'डैशबोर्ड' },
    { path: '/app/weather', icon: Cloud, label: 'Weather', labelHi: 'मौसम' },
    { path: '/app/disease-detection', icon: Scan, label: 'Disease Detection', labelHi: 'रोग पहचान' },
    { path: '/app/marketplace', icon: ShoppingCart, label: 'Marketplace', labelHi: 'बाज़ार' },
    { path: '/app/farming-tips', icon: BookOpen, label: 'Farming Tips', labelHi: 'खेती टिप्स' },
    { path: '/app/irrigation', icon: Droplets, label: 'Irrigation', labelHi: 'सिंचाई' },
    { path: '/app/connect', icon: Users, label: 'Farmer Connect', labelHi: 'किसान कनेक्ट' },
    { path: '/app/schemes', icon: FileText, label: 'Gov Schemes', labelHi: 'सरकारी योजनाएं' },
    { path: '/app/forum', icon: MessageSquare, label: 'Forum', labelHi: 'फोरम' },
    { path: '/app/ai-chat', icon: Bot, label: 'AI Assistant', labelHi: 'एआई सहायक' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="page-container min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="glass-morphism sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🌱</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    AgriSmart 2.0
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    AI-Powered Farming
                  </p>
                </div>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Change Language"
              >
                <Globe size={20} />
                <span className="ml-1 text-sm font-medium">
                  {language === 'en' ? 'हिं' : 'EN'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block font-medium">{user?.name}</span>
                </button>
                
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 glass-morphism rounded-lg shadow-xl py-2">
                  <Link 
                    to="/app/profile" 
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={18} />
                    <span>{language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                  >
                    <LogOut size={18} />
                    <span>{language === 'en' ? 'Logout' : 'लॉगआउट'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          glass-morphism mt-0 lg:mt-0
        `}>
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">
                    {language === 'en' ? item.label : item.labelHi}
                  </span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          <Outlet /> {/* <-- Ensures child routes render */}
        </main>
      </div>
    </div>
  )
}

export default Layout
