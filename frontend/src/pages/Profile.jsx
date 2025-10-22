import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Leaf, Camera, Save } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { userAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const { language } = useThemeStore()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farm_size: user?.farm_size || '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await userAPI.updateProfile(formData)
      updateUser(formData)
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Manage your account information and preferences' 
            : 'अपनी खाता जानकारी और वरीयताएँ प्रबंधित करें'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Camera size={20} className="text-primary-600" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 capitalize">
              {user?.role || 'Farmer'}
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <Leaf size={20} />
                <span className="font-semibold">
                  {language === 'en' ? 'Active Farmer' : 'सक्रिय किसान'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {language === 'en' ? 'Member since' : 'सदस्य बने'} {new Date().getFullYear()}
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.phone}</span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {language === 'en' ? 'Profile Information' : 'प्रोफ़ाइल जानकारी'}
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary"
                >
                  {language === 'en' ? 'Edit' : 'संपादित करें'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Full Name' : 'पूरा नाम'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Email' : 'ईमेल'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Location' : 'स्थान'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Farm Size (acres)' : 'खेत का आकार (एकड़)'}
                  </label>
                  <div className="relative">
                    <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      name="farm_size"
                      value={formData.farm_size}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-10"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Role' : 'भूमिका'}
                  </label>
                  <input
                    type="text"
                    value={user?.role || 'Farmer'}
                    disabled
                    className="input-field capitalize"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex items-center flex-1">
                    <Save size={20} className="mr-2" />
                    {language === 'en' ? 'Save Changes' : 'परिवर्तन सहेजें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        location: user?.location || '',
                        farm_size: user?.farm_size || '',
                      })
                    }}
                    className="btn-secondary flex-1"
                  >
                    {language === 'en' ? 'Cancel' : 'रद्द करें'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Posts' : 'पोस्ट'}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-blue-600">35</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Contributions' : 'योगदान'}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Solutions' : 'समाधान'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile