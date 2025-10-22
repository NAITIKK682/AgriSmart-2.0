import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Calendar, TrendingUp, Save, Brain } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import toast from 'react-hot-toast'

const IrrigationPlanner = () => {
  const { language } = useThemeStore()
  const [formData, setFormData] = useState({
    crop_name: '',
    area: '',
    soil_type: '',
    irrigation_method: '',
    start_date: '',
  })

  const [recommendation, setRecommendation] = useState(null)

  const cropOptions = [
    { value: 'wheat', label: 'Wheat', labelHi: 'गेहूं', water: 450 },
    { value: 'rice', label: 'Rice', labelHi: 'चावल', water: 1200 },
    { value: 'cotton', label: 'Cotton', labelHi: 'कपास', water: 750 },
    { value: 'sugarcane', label: 'Sugarcane', labelHi: 'गन्ना', water: 1800 },
    { value: 'tomato', label: 'Tomato', labelHi: 'टमाटर', water: 400 },
    { value: 'potato', label: 'Potato', labelHi: 'आलू', water: 500 },
  ]

  const soilTypes = [
    { value: 'clay', label: 'Clay', labelHi: 'मिट्टी' },
    { value: 'sandy', label: 'Sandy', labelHi: 'रेतीली' },
    { value: 'loamy', label: 'Loamy', labelHi: 'दोमट' },
    { value: 'silt', label: 'Silt', labelHi: 'गाद' },
  ]

  const irrigationMethods = [
    { value: 'drip', label: 'Drip Irrigation', labelHi: 'ड्रिप सिंचाई' },
    { value: 'sprinkler', label: 'Sprinkler', labelHi: 'स्प्रिंकलर' },
    { value: 'flood', label: 'Flood Irrigation', labelHi: 'बाढ़ सिंचाई' },
    { value: 'furrow', label: 'Furrow Irrigation', labelHi: 'नाली सिंचाई' },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Generate AI recommendation
    const crop = cropOptions.find(c => c.value === formData.crop_name)
    const waterRequirement = crop ? crop.water : 500
    const efficiency = formData.irrigation_method === 'drip' ? 0.9 : 
                       formData.irrigation_method === 'sprinkler' ? 0.75 : 0.6
    
    const totalWater = waterRequirement * parseFloat(formData.area || 1)
    const efficientWater = totalWater * efficiency

    setRecommendation({
      waterRequirement: waterRequirement,
      totalWater: totalWater.toFixed(0),
      efficientWater: efficientWater.toFixed(0),
      waterSaved: (totalWater - efficientWater).toFixed(0),
      schedule: generateSchedule(formData.crop_name)
    })

    toast.success('Irrigation plan generated successfully!')
  }

  const generateSchedule = (crop) => {
    const schedules = {
      wheat: [
        { stage: 'Crown Root Initiation', days: '21-25', frequency: '7 days' },
        { stage: 'Tillering', days: '40-45', frequency: '10 days' },
        { stage: 'Flowering', days: '70-75', frequency: '7 days' },
        { stage: 'Milk Stage', days: '90-95', frequency: '10 days' },
      ],
      rice: [
        { stage: 'Transplanting', days: '0-5', frequency: 'Daily' },
        { stage: 'Tillering', days: '15-40', frequency: 'Maintain 2-3cm water' },
        { stage: 'Panicle Initiation', days: '55-65', frequency: '5 days' },
        { stage: 'Flowering', days: '75-85', frequency: '5 days' },
      ],
      default: [
        { stage: 'Initial Growth', days: '0-30', frequency: '5 days' },
        { stage: 'Vegetative', days: '30-60', frequency: '7 days' },
        { stage: 'Reproductive', days: '60-90', frequency: '5 days' },
      ]
    }

    return schedules[crop] || schedules.default
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Smart Irrigation Planner' : 'स्मार्ट सिंचाई योजनाकार'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Optimize water usage with AI-powered irrigation recommendations' 
            : 'एआई-संचालित सिंचाई सिफारिशों के साथ पानी के उपयोग को अनुकूलित करें'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Droplets size={24} className="mr-2 text-blue-600" />
            {language === 'en' ? 'Create Irrigation Plan' : 'सिंचाई योजना बनाएं'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Crop Type' : 'फसल का प्रकार'} *
              </label>
              <select
                name="crop_name"
                value={formData.crop_name}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">{language === 'en' ? 'Select Crop' : 'फसल चुनें'}</option>
                {cropOptions.map(crop => (
                  <option key={crop.value} value={crop.value}>
                    {language === 'en' ? crop.label : crop.labelHi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Farm Area (acres)' : 'खेत का क्षेत्र (एकड़)'} *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="input-field"
                placeholder="5"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Soil Type' : 'मिट्टी का प्रकार'} *
              </label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">{language === 'en' ? 'Select Soil Type' : 'मिट्टी चुनें'}</option>
                {soilTypes.map(soil => (
                  <option key={soil.value} value={soil.value}>
                    {language === 'en' ? soil.label : soil.labelHi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Irrigation Method' : 'सिंचाई विधि'} *
              </label>
              <select
                name="irrigation_method"
                value={formData.irrigation_method}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">{language === 'en' ? 'Select Method' : 'विधि चुनें'}</option>
                {irrigationMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {language === 'en' ? method.label : method.labelHi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Start Date' : 'शुरुआत की तारीख'}
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center">
              <Brain size={20} className="mr-2" />
              {language === 'en' ? 'Generate AI Plan' : 'एआई योजना बनाएं'}
            </button>
          </form>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <TrendingUp size={24} className="mr-2 text-green-600" />
            {language === 'en' ? 'AI Recommendations' : 'एआई सिफारिशें'}
          </h2>

          {!recommendation ? (
            <div className="text-center py-12 text-gray-400">
              <Droplets size={48} className="mx-auto mb-4" />
              <p>{language === 'en' ? 'Fill the form to get AI recommendations' : 'एआई सिफारिशें पाने के लिए फॉर्म भरें'}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Water Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'en' ? 'Total Water Need' : 'कुल पानी की आवश्यकता'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{recommendation.totalWater} L</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === 'en' ? 'Water Saved' : 'पानी की बचत'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{recommendation.waterSaved} L</p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="font-bold mb-3 flex items-center">
                  <Calendar size={20} className="mr-2" />
                  {language === 'en' ? 'Irrigation Schedule' : 'सिंचाई अनुसूची'}
                </h3>
                <div className="space-y-3">
                  {recommendation.schedule.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{item.stage}</h4>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          Day {item.days}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Frequency' : 'आवृत्ति'}: {item.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full btn-primary flex items-center justify-center">
                <Save size={20} className="mr-2" />
                {language === 'en' ? 'Save Plan' : 'योजना सहेजें'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IrrigationPlanner