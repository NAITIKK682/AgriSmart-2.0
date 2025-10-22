import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, Plus, ThumbsUp, MessageCircle, 
  Eye, Pin, TrendingUp, Filter 
} from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { forumAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Forum = () => {
  const { language } = useThemeStore()
  const { user } = useAuthStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General',
  })

  const categories = [
    { value: '', label: 'All Topics', labelHi: 'सभी विषय' },
    { value: 'Crops', label: 'Crops', labelHi: 'फसलें' },
    { value: 'Pest Control', label: 'Pest Control', labelHi: 'कीट नियंत्रण' },
    { value: 'Irrigation', label: 'Irrigation', labelHi: 'सिंचाई' },
    { value: 'Government Schemes', label: 'Government Schemes', labelHi: 'सरकारी योजनाएं' },
    { value: 'Market', label: 'Market', labelHi: 'बाज़ार' },
  ]

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await forumAPI.getPosts({ category: selectedCategory })
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts(generateMockPosts())
    } finally {
      setLoading(false)
    }
  }

  const generateMockPosts = () => {
    return [
      {
        id: 1,
        title: 'Best time to plant wheat?',
        content: 'I am in Punjab region. When should I start planting wheat this season?',
        category: 'Crops',
        author_name: 'Ramesh Kumar',
        role: 'farmer',
        views: 234,
        likes: 45,
        comments_count: 12,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 2,
        title: 'Dealing with aphid infestation',
        content: 'My cotton crop has aphid problem. Looking for organic solutions.',
        category: 'Pest Control',
        author_name: 'Dr. Suresh (Expert)',
        role: 'expert',
        views: 567,
        likes: 89,
        comments_count: 23,
        is_pinned: 1,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 3,
        title: 'Subsidy for solar pump installation',
        content: 'Anyone got subsidy for installing solar water pump? What is the process?',
        category: 'Government Schemes',
        author_name: 'Vijay Singh',
        role: 'farmer',
        views: 432,
        likes: 67,
        comments_count: 18,
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ]
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      await forumAPI.createPost(newPost)
      toast.success('Post created successfully!')
      setShowNewPost(false)
      setNewPost({ title: '', content: '', category: 'General' })
      fetchPosts()
    } catch (error) {
      toast.error('Failed to create post')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Community Forum' : 'सामुदायिक फोरम'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Ask questions, share knowledge, and help fellow farmers' 
              : 'प्रश्न पूछें, ज्ञान साझा करें और साथी किसानों की मदद करें'}
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {language === 'en' ? 'New Post' : 'नई पोस्ट'}
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold mb-4">
            {language === 'en' ? 'Create New Post' : 'नई पोस्ट बनाएं'}
          </h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Title' : 'शीर्षक'}
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="input-field"
                placeholder={language === 'en' ? 'Enter post title...' : 'पोस्ट शीर्षक दर्ज करें...'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Category' : 'श्रेणी'}
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="input-field"
              >
                {categories.filter(c => c.value).map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {language === 'en' ? cat.label : cat.labelHi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Content' : 'सामग्री'}
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder={language === 'en' ? 'Write your post...' : 'अपनी पोस्ट लिखें...'}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                {language === 'en' ? 'Post' : 'पोस्ट करें'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewPost(false)}
                className="btn-secondary flex-1"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="card">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter size={20} className="text-gray-500" />
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.value 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {language === 'en' ? cat.label : cat.labelHi}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-2xl transition-shadow cursor-pointer"
            >
              {/* Pinned Badge */}
              {post.is_pinned === 1 && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full inline-flex items-center text-sm font-semibold mb-3">
                  <Pin size={16} className="mr-1" />
                  {language === 'en' ? 'Pinned' : 'पिन किया गया'}
                </div>
              )}

              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      {post.author_name}
                      {post.role === 'expert' && (
                        <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                          {language === 'en' ? 'Expert' : 'विशेषज्ञ'}
                        </span>
                      )}
                    </span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                {post.content}
              </p>

              {/* Post Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {post.views}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp size={16} className="mr-1" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-1" />
                    {post.comments_count} {language === 'en' ? 'replies' : 'उत्तर'}
                  </div>
                </div>
                <button className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  {language === 'en' ? 'Read More' : 'और पढ़ें'} →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-4" />
          <p>{language === 'en' ? 'No posts found' : 'कोई पोस्ट नहीं मिली'}</p>
        </div>
      )}
    </div>
  )
}

export default Forum