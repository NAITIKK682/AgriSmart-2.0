import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Search, Award, CreditCard, Shield, 
  BookOpen, ExternalLink, Filter 
} from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { schemesAPI } from '../utils/api'

const GovernmentSchemes = () => {
  const { language } = useThemeStore()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedScheme, setExpandedScheme] = useState(null)

  const categories = [
    { value: '', label: 'All Schemes', labelHi: 'सभी योजनाएं', icon: FileText },
    { value: 'Subsidy', label: 'Subsidies', labelHi: 'सब्सिडी', icon: Award },
    { value: 'Loan', label: 'Loans', labelHi: 'ऋण', icon: CreditCard },
    { value: 'Insurance', label: 'Insurance', labelHi: 'बीमा', icon: Shield },
    { value: 'Training', label: 'Training', labelHi: 'प्रशिक्षण', icon: BookOpen },
  ]

  useEffect(() => {
    fetchSchemes()
  }, [selectedCategory])

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const response = await schemesAPI.getSchemes({ category: selectedCategory })
      setSchemes(response.data)
    } catch (error) {
      console.error('Error fetching schemes:', error)
      setSchemes([]) // Will use seed data from backend
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Government Schemes' : 'सरकारी योजनाएं'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Explore subsidies, loans, insurance, and training programs for farmers' 
            : 'किसानों के लिए सब्सिडी, ऋण, बीमा और प्रशिक्षण कार्यक्रमों का अन्वेषण करें'}
        </p>
      </div>

      {/* Category Filter */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`card text-center hover:scale-105 transition-all ${
                selectedCategory === cat.value 
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : ''
              }`}
            >
              <Icon size={32} className="mx-auto mb-2 text-primary-600" />
              <p className="font-semibold text-sm">
                {language === 'en' ? cat.label : cat.labelHi}
              </p>
            </button>
          )
        })}
      </div>

      {/* Schemes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold">{scheme.name}</h3>
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {scheme.description}
                  </p>
                </div>
              </div>

              {/* Expandable Details */}
              {expandedScheme === scheme.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-bold mb-2">
                      {language === 'en' ? '✓ Eligibility' : '✓ पात्रता'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {scheme.eligibility}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-bold mb-2">
                      {language === 'en' ? '💰 Benefits' : '💰 लाभ'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {scheme.benefits}
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 className="font-bold mb-2">
                      {language === 'en' ? '📝 How to Apply' : '📝 आवेदन कैसे करें'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {scheme.application_process}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-bold mb-2">
                      {language === 'en' ? '📞 Contact Information' : '📞 संपर्क जानकारी'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {scheme.contact_info}
                    </p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                className="mt-4 btn-primary w-full flex items-center justify-center"
              >
                {expandedScheme === scheme.id 
                  ? (language === 'en' ? 'Show Less' : 'कम दिखाएं')
                  : (language === 'en' ? 'View Details' : 'विवरण देखें')}
                <ExternalLink size={16} className="ml-2" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {schemes.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <FileText size={48} className="mx-auto mb-4" />
          <p>{language === 'en' ? 'No schemes found' : 'कोई योजना नहीं मिली'}</p>
        </div>
      )}
    </div>
  )
}

export default GovernmentSchemes