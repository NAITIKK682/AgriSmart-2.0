import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Tag, Eye, ThumbsUp, Video, Filter } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { tipsAPI } from '../utils/api'

const FarmingTips = () => {
  const { language } = useThemeStore()
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    { value: '', label: 'All Topics', labelHi: 'सभी विषय' },
    { value: 'Soil Management', label: 'Soil Management', labelHi: 'मृदा प्रबंधन' },
    { value: 'Pest Management', label: 'Pest Management', labelHi: 'कीट प्रबंधन' },
    { value: 'Irrigation', label: 'Irrigation', labelHi: 'सिंचाई' },
    { value: 'Farming Practices', label: 'Farming Practices', labelHi: 'खेती के तरीके' },
    { value: 'Seasonal Guides', label: 'Seasonal Guides', labelHi: 'मौसमी गाइड' },
  ]

  useEffect(() => {
    fetchTips()
  }, [selectedCategory, language])

  const fetchTips = async () => {
    setLoading(true)
    try {
      const response = await tipsAPI.getTips({ 
        category: selectedCategory,
        language: language 
      })
      setTips(response.data)
    } catch (error) {
      console.error('Error fetching tips:', error)
      setTips(generateMockTips())
    } finally {
      setLoading(false)
    }
  }

  const generateMockTips = () => {
    return [
      {
        id: 1,
        title: language === 'en' ? 'Organic Fertilizer Benefits' : 'जैविक खाद के लाभ',
        category: 'Soil Management',
        content: language === 'en' 
          ? 'Organic fertilizers improve soil structure, increase water retention, and provide slow-release nutrients. Use compost, vermicompost, or green manure for best results.'
          : 'जैविक उर्वरक मिट्टी की संरचना में सुधार करते हैं, पानी की अवधारण बढ़ाते हैं और धीमी गति से पोषक तत्व प्रदान करते हैं।',
        author_name: 'Dr. Sharma',
        views: 245,
        likes: 67,
        tags: 'organic,fertilizer,soil'
      },
      {
        id: 2,
        title: language === 'en' ? 'Pest Control Using Neem' : 'नीम से कीट नियंत्रण',
        category: 'Pest Management',
        content: language === 'en'
          ? 'Neem-based pesticides are effective against 200+ pest species. Mix neem oil with water (1:20 ratio) and spray on crops every 7-10 days.'
          : 'नीम आधारित कीटनाशक 200+ कीट प्रजातियों के खिलाफ प्रभावी हैं। नीम के तेल को पानी के साथ मिलाएं और हर 7-10 दिनों में फसलों पर छिड़काव करें।',
        author_name: 'Ramesh Kumar',
        views: 567,
        likes: 123,
        tags: 'pest,neem,organic'
      },
      {
        id: 3,
        title: language === 'en' ? 'Drip Irrigation Setup' : 'ड्रिप सिंचाई सेटअप',
        category: 'Irrigation',
        content: language === 'en'
          ? 'Drip irrigation saves 40-60% water. Install drippers 30cm apart for vegetables and 60cm for fruit crops. Check filters weekly.'
          : 'ड्रिप सिंचाई 40-60% पानी बचाती है। सब्जियों के लिए 30 सेमी की दूरी पर और फल फसलों के लिए 60 सेमी पर ड्रिपर लगाएं।',
        author_name: 'Suresh Patel',
        views: 432,
        likes: 98,
        tags: 'irrigation,water,drip',
        video_url: 'https://example.com/video'
      },
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Farming Tips & Knowledge Hub' : 'खेती टिप्स और ज्ञान केंद्र'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Expert farming advice, seasonal guides, and best practices' 
            : 'विशेषज्ञ खेती सलाह, मौसमी गाइड और सर्वोत्तम प्रथाएं'}
        </p>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field flex-1"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {language === 'en' ? cat.label : cat.labelHi}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-2xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{tip.title}</h3>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'By' : 'द्वारा'} {tip.author_name}
                    </p>
                  </div>
                </div>
                {tip.video_url && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full flex items-center text-sm">
                    <Video size={16} className="mr-1" />
                    Video
                  </div>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {tip.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {tip.views} {language === 'en' ? 'views' : 'बार देखा गया'}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp size={16} className="mr-1" />
                    {tip.likes} {language === 'en' ? 'likes' : 'पसंद'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tip.tags?.split(',').map((tag, i) => (
                    <span 
                      key={i}
                      className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FarmingTips