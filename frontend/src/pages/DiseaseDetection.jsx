import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { diseaseAPI } from '../utils/api'
import toast from 'react-hot-toast'

const DiseaseDetection = () => {
  const { language } = useThemeStore()
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleDetect = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first')
      return
    }

    setDetecting(true)
    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await diseaseAPI.detectDisease(formData)
      setResult(response.data)
      toast.success('Disease detection complete!')
    } catch (error) {
      toast.error('Detection failed. Please try again.')
    } finally {
      setDetecting(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Crop Disease Detection' : 'फसल रोग पहचान'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Upload crop images for AI-powered disease detection with 85%+ accuracy' 
            : 'एआई-संचालित रोग पहचान के लिए फसल की तस्वीरें अपलोड करें'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            {language === 'en' ? 'Upload Image' : 'छवि अपलोड करें'}
          </h2>

          {!preview ? (
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">
                  {language === 'en' ? 'Click to upload image' : 'छवि अपलोड करने के लिए क्लिक करें'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Supports: JPG, PNG (Max 5MB)' : 'समर्थित: JPG, PNG (अधिकतम 5MB)'}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg shadow-lg"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {preview && !result && (
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="w-full btn-primary mt-6 flex items-center justify-center"
            >
              {detecting ? (
                <>
                  <div className="spinner mr-2"></div>
                  Detecting...
                </>
              ) : (
                <>
                  <Camera size={20} className="mr-2" />
                  {language === 'en' ? 'Detect Disease' : 'रोग का पता लगाएं'}
                </>
              )}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            {language === 'en' ? 'Detection Results' : 'पहचान परिणाम'}
          </h2>

          {!result ? (
            <div className="text-center py-12 text-gray-400">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>{language === 'en' ? 'No results yet. Upload an image to start.' : 'अभी तक कोई परिणाम नहीं। शुरू करने के लिए एक छवि अपलोड करें।'}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Disease Name & Confidence */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                  <div>
                    <h3 className="text-2xl font-bold">{result.disease}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(result.confidence * 100)}% Confidence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  {language === 'en' ? 'Recommended Treatment' : 'अनुशंसित उपचार'}
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{result.treatment}</p>
                </div>
              </div>

              {/* Preventive Measures */}
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                  {language === 'en' ? 'Preventive Measures' : 'निवारक उपाय'}
                </h4>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{result.preventive_measures}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 btn-secondary"
                >
                  {language === 'en' ? 'New Detection' : 'नई पहचान'}
                </button>
                <button className="flex-1 btn-primary">
                  {language === 'en' ? 'Save Report' : 'रिपोर्ट सहेजें'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <h3 className="font-bold mb-2">🎯 High Accuracy</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Our AI model achieves 85%+ accuracy in disease detection across 20+ common crop diseases.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <h3 className="font-bold mb-2">⚡ Instant Results</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Get disease diagnosis and treatment recommendations in seconds, not days.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <h3 className="font-bold mb-2">📱 Easy to Use</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Simply take a photo with your phone and upload. Works on any device.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DiseaseDetection