import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, CloudRain, Sun, Wind, Droplets, Eye, 
  MapPin, RefreshCw, TrendingUp, AlertTriangle 
} from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { weatherAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Weather = () => {
  const { language } = useThemeStore()
  const [location, setLocation] = useState('Delhi')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const response = await weatherAPI.getWeather(location)
      setWeatherData(response.data)
    } catch (error) {
      toast.error('Failed to fetch weather data')
      // Set mock data on error
      setWeatherData({
        current: {
          temp: 28,
          feels_like: 30,
          humidity: 65,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          wind: { speed: 3.5 },
          visibility: 10000,
        },
        forecast: {
          list: generateMockForecast()
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockForecast = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day, i) => ({
      dt: Date.now() + i * 86400000,
      main: { temp: 25 + Math.random() * 10, humidity: 60 + Math.random() * 20 },
      weather: [{ main: i % 3 === 0 ? 'Rain' : 'Clear', description: 'test' }],
    }))
  }

  const handleLocationChange = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  const recommendations = [
    {
      title: 'Irrigation Recommendation',
      titleHi: 'सिंचाई की सिफारिश',
      description: 'Moderate watering required. Next irrigation in 2 days.',
      descriptionHi: 'मध्यम पानी की आवश्यकता। 2 दिनों में अगली सिंचाई।',
      icon: Droplets,
      color: 'text-blue-600',
    },
    {
      title: 'Crop Health Alert',
      titleHi: 'फसल स्वास्थ्य अलर्ट',
      description: 'Good conditions for wheat and rice growth.',
      descriptionHi: 'गेहूं और चावल की वृद्धि के लिए अच्छी स्थिति।',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Weather Warning',
      titleHi: 'मौसम चेतावनी',
      description: 'Light rain expected in 3 days. Prepare drainage.',
      descriptionHi: '3 दिनों में हल्की बारिश की उम्मीद। जल निकासी तैयार करें।',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  const current = weatherData?.current || {}
  const forecast = weatherData?.forecast?.list || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Weather Dashboard' : 'मौसम डैशबोर्ड'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Real-time weather updates and farming recommendations' 
              : 'वास्तविक समय मौसम अपडेट और खेती की सिफारिशें'}
          </p>
        </div>

        {/* Location Search */}
        <form onSubmit={handleLocationChange} className="flex gap-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field pl-10 pr-4"
              placeholder="Enter location"
            />
          </div>
          <button type="submit" className="btn-primary px-4">
            <RefreshCw size={20} />
          </button>
        </form>
      </div>

      {/* Current Weather */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin size={20} />
              <span className="text-xl font-semibold">{location}</span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-7xl font-bold">{Math.round(current.temp)}°C</div>
              <div>
                <Cloud size={64} className="text-white/80" />
                <p className="text-lg capitalize mt-2">
                  {current.weather?.[0]?.description || 'Clear'}
                </p>
              </div>
            </div>
            <p className="text-blue-100">
              Feels like {Math.round(current.feels_like)}°C
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets size={20} />
                <span className="text-sm">Humidity</span>
              </div>
              <p className="text-2xl font-bold">{current.humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind size={20} />
                <span className="text-sm">Wind Speed</span>
              </div>
              <p className="text-2xl font-bold">{current.wind?.speed} m/s</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye size={20} />
                <span className="text-sm">Visibility</span>
              </div>
              <p className="text-2xl font-bold">{(current.visibility / 1000).toFixed(1)} km</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sun size={20} />
                <span className="text-sm">UV Index</span>
              </div>
              <p className="text-2xl font-bold">Moderate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7-Day Forecast */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">
          {language === 'en' ? '7-Day Forecast' : '7 दिन का पूर्वानुमान'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.slice(0, 7).map((day, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <p className="font-semibold mb-2">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              {day.weather?.[0]?.main === 'Rain' ? (
                <CloudRain size={32} className="mx-auto text-blue-500 mb-2" />
              ) : (
                <Sun size={32} className="mx-auto text-yellow-500 mb-2" />
              )}
              <p className="text-2xl font-bold">{Math.round(day.main?.temp)}°</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {day.main?.humidity}% humid
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Farming Recommendations */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">
          {language === 'en' ? 'Farming Recommendations' : 'खेती की सिफारिशें'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon size={24} className={rec.color} />
                  <h3 className="font-bold">
                    {language === 'en' ? rec.title : rec.titleHi}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? rec.description : rec.descriptionHi}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Weather