import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShoppingCart, Star, Leaf, Plus } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { marketplaceAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Marketplace = () => {
  const { language } = useThemeStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    { value: '', label: 'All Categories', labelHi: 'सभी श्रेणियां' },
    { value: 'Grains', label: 'Grains', labelHi: 'अनाज' },
    { value: 'Vegetables', label: 'Vegetables', labelHi: 'सब्जियां' },
    { value: 'Fruits', label: 'Fruits', labelHi: 'फल' },
    { value: 'Dairy', label: 'Dairy', labelHi: 'डेयरी' },
    { value: 'Fertilizers', label: 'Fertilizers', labelHi: 'उर्वरक' },
    { value: 'Pesticides', label: 'Pesticides', labelHi: 'कीटनाशक' },
  ]

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await marketplaceAPI.getProducts({ 
        category: selectedCategory,
        search: searchTerm 
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Set mock data on error
      setProducts(generateMockProducts())
    } finally {
      setLoading(false)
    }
  }

  const generateMockProducts = () => {
    return [
      { id: 1, name: 'Organic Wheat', category: 'Grains', price: 35, unit: 'kg', is_organic: 1, rating: 4.5, reviews_count: 23, seller_name: 'Ram Kumar' },
      { id: 2, name: 'Fresh Tomatoes', category: 'Vegetables', price: 30, unit: 'kg', is_organic: 1, rating: 4.8, reviews_count: 45, seller_name: 'Suresh Patel' },
      { id: 3, name: 'Basmati Rice', category: 'Grains', price: 80, unit: 'kg', is_organic: 0, rating: 4.6, reviews_count: 67, seller_name: 'Amit Sharma' },
      { id: 4, name: 'Green Chillies', category: 'Vegetables', price: 40, unit: 'kg', is_organic: 1, rating: 4.3, reviews_count: 12, seller_name: 'Vijay Singh' },
      { id: 5, name: 'Organic Milk', category: 'Dairy', price: 60, unit: 'liter', is_organic: 1, rating: 4.9, reviews_count: 89, seller_name: 'Krishna Dairy' },
      { id: 6, name: 'Vermicompost', category: 'Fertilizers', price: 8, unit: 'kg', is_organic: 1, rating: 4.7, reviews_count: 34, seller_name: 'Green Earth' },
    ]
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Digital Marketplace' : 'डिजिटल बाज़ार'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Buy and sell agricultural products directly from farmers' 
            : 'सीधे किसानों से कृषि उत्पाद खरीदें और बेचें'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
                placeholder={language === 'en' ? 'Search products...' : 'उत्पाद खोजें...'}
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              {language === 'en' ? 'Search' : 'खोजें'}
            </button>
          </form>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {language === 'en' ? cat.label : cat.labelHi}
                </option>
              ))}
            </select>
            
            <button className="btn-primary px-6 flex items-center whitespace-nowrap">
              <Plus size={20} className="mr-2" />
              {language === 'en' ? 'Sell Product' : 'बेचें'}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:scale-105 cursor-pointer group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg mb-4 flex items-center justify-center">
                <ShoppingCart size={48} className="text-green-600 dark:text-green-400" />
                {product.is_organic === 1 && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Leaf size={14} className="mr-1" />
                    Organic
                  </div>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {language === 'en' ? 'Seller' : 'विक्रेता'}: {product.seller_name}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-semibold">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews_count} {language === 'en' ? 'reviews' : 'समीक्षा'})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              {/* Action Button */}
              <button className="w-full btn-primary">
                <ShoppingCart size={18} className="mr-2" />
                {language === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <p>{language === 'en' ? 'No products found' : 'कोई उत्पाद नहीं मिला'}</p>
        </div>
      )}
    </div>
  )
}

export default Marketplace