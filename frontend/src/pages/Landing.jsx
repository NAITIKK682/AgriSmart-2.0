import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Sprout,
  Cloud,
  Scan,
  ShoppingCart,
  Brain,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  X,
  Play,
  Star,
  CheckCircle,
} from "lucide-react";

const Landing = () => {
  // Enhanced state management for new features
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [hasShownInitial, setHasShownInitial] = useState(false);

  // Scroll-based animations and effects
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aiSectionRef = useRef(null);

  // Parallax effect for hero section
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Intersection observer for scroll-triggered animations
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-50px" });
  const aiInView = useInView(aiSectionRef, { once: true, margin: "-50px" });

  // Smooth scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-show modal immediately and then every 40 seconds
  useEffect(() => {
    // Show immediately on load
    setModalContent({
      type: 'welcome',
      title: '🎉 Welcome to AgriSmart 2.0!',
      message: 'Experience the future of farming with our enhanced AI-powered platform. Get started with personalized farming insights today!',
      cta: 'Get Started'
    });
    setShowModal(true);
    setHasShownInitial(true);

    // Then show every 40 seconds
    const interval = setInterval(() => {
      setModalContent({
        type: 'welcome',
        title: '🎉 Welcome to AgriSmart 2.0!',
        message: 'Experience the future of farming with our enhanced AI-powered platform. Get started with personalized farming insights today!',
        cta: 'Get Started'
      });
      setShowModal(true);
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assistance",
      titleHi: "एआई सहायता",
      description:
        "Get instant farming advice from Ayushmann, your bilingual AI assistant",
      stats: "24/7 Available",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Scan,
      title: "Disease Detection",
      titleHi: "रोग पहचान",
      description:
        "Detect crop diseases with 85%+ accuracy using advanced TensorFlow models",
      stats: "85%+ Accuracy",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Cloud,
      title: "Weather Forecasts",
      titleHi: "मौसम पूर्वानुमान",
      description:
        "Real-time weather updates and 7-day forecasts with farming recommendations",
      stats: "7-Day Forecast",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: ShoppingCart,
      title: "Digital Marketplace",
      titleHi: "डिजिटल बाज़ार",
      description:
        "Buy and sell agricultural products directly with fair prices",
      stats: "10,000+ Products",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Farmer Community",
      titleHi: "किसान समुदाय",
      description:
        "Connect with fellow farmers, share experiences, and solve problems together",
      stats: "50,000+ Farmers",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Smart Irrigation",
      titleHi: "स्मार्ट सिंचाई",
      description: "Optimize water usage with AI-powered irrigation planning",
      stats: "30% Water Saved",
      color: "from-teal-500 to-teal-600"
    },
  ];

  // Enhanced modal component
  const Modal = ({ content, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h3>
          <p className="text-gray-600 mb-6">{content.message}</p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              onClick={onClose}
            >
              {content.cta}
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );

  // Enhanced floating action button for quick access
  const FloatingCTA = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setModalContent({
            type: 'demo',
            title: '🚀 Try Ayushmann AI',
            message: 'Experience our AI assistant with a quick demo. Ask any farming question!',
            cta: 'Start Demo'
          });
          setShowModal(true);
        }}
        className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-shadow"
      >
        <Brain size={28} />
      </motion.button>
    </motion.div>
  );

  // Enhanced scroll-to-top button
  const ScrollToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setShow(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors"
      >
        <ArrowRight size={20} className="rotate-[-90deg]" />
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Enhanced Navigation Bar - New Addition */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sprout className="text-primary-600" size={24} />
              <span className="font-bold text-xl text-gray-900">AgriSmart 2.0</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                AI Assistant
              </button>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Enhanced Visual Impact */}
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-cover bg-center pt-16"
        style={{
          backgroundImage: "url('/assets/farmer-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Enhanced Blur + Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary-900/40 to-transparent backdrop-blur-[1px]"></div>

        {/* Floating Particles Animation - New Addition */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                opacity: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            {/* Enhanced Logo with Glow Effect */}
            <motion.div
              className="flex justify-center mb-12"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-primary-500/50 transition-shadow duration-300">
                  <Sprout size={64} className="text-white drop-shadow-lg" />
                </div>
                <motion.div
                  className="absolute -top-3 -right-3 w-8 h-8 bg-accent-orange rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={16} className="text-white" />
                </motion.div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>

            {/* Enhanced Title with Better Typography */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-white via-green-200 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AGRI-SMART 2.0
            </motion.h1>

            {/* Enhanced Subtitles */}
            <motion.p
              className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-bold drop-shadow-xl"
              initial={{ x: -50, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              AI-Powered Farming for Modern India
            </motion.p>

            <motion.p
              className="text-2xl md:text-3xl text-orange-200 font-bold mb-8 drop-shadow-lg"
              initial={{ x: 50, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              भारतीय कृषि के लिए आधुनिक एआई समाधान
            </motion.p>

            {/* Enhanced Description */}
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-16 drop-shadow-lg leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Transform your farming with cutting-edge AI technology, real-time
              support, and a thriving community of farmers across India.
            </motion.p>

            {/* Enhanced CTA Buttons with Better Design */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              initial={{ y: 50, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center px-10 py-5 border-2 border-white/30 text-white font-bold text-xl rounded-2xl backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  Login to Account
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Trust Indicators with Animations */}
            <motion.div
              className="flex flex-wrap justify-center gap-12 text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {[
                { icon: Shield, text: "100% Secure", color: "text-green-300" },
                { icon: Users, text: "10,000+ Farmers", color: "text-blue-300" },
                { icon: Zap, text: "Real-time Support", color: "text-yellow-300" },
                { icon: Star, text: "4.9★ Rating", color: "text-orange-300" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 font-bold text-lg drop-shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon size={24} className={item.color} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator - New Addition */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Enhanced Features Section with ID for Navigation */}
      <div id="features" ref={featuresRef} className="py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block bg-primary-100 text-primary-800 px-6 py-3 rounded-full font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              🚀 Powerful Features
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent">
              Smart Farming Solutions
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              स्मार्ट खेती के लिए अत्याधुनिक सुविधाएं | Advanced features for intelligent agriculture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                  {/* Icon with enhanced styling */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Icon size={32} className="text-white drop-shadow-sm" />
                  </motion.div>

                  {/* Stats badge - New Addition */}
                  <div className="absolute top-6 right-6 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {feature.stats}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-primary-600 mb-4 font-semibold">
                    {feature.titleHi}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>

                  {/* Interactive hover effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Call-to-action section within features */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience These Features?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of farmers already transforming their agriculture
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Your Smart Farming Journey
                  <ArrowRight className="ml-3" size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced AI Assistant Section with ID for Navigation */}
      <div id="ai-assistant" ref={aiSectionRef} className="py-32 bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={aiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              🤖 AI-Powered Intelligence
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Meet Your AI Farming Expert
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              24/7 बुद्धिमान सहायक | Intelligent assistant available round the clock
            </p>
          </motion.div>

          <div className="glass-morphism rounded-3xl p-8 md:p-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={aiInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  🌟 Ayushmann - Your AI Farming Expert
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                  24/7 Bilingual AI Assistant
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Get instant answers to all your farming questions in Hindi or
                  English. Ayushmann uses advanced AI to provide personalized
                  recommendations based on your location, crop type, and weather
                  conditions.
                </p>

                {/* Enhanced feature list */}
                <div className="space-y-4 mb-10">
                  {[
                    { icon: "🌾", text: "Crop-specific farming advice", desc: "फसल विशिष्ट खेती की सलाह" },
                    { icon: "🐛", text: "Pest and disease management", desc: "कीट और बीमारी प्रबंधन" },
                    { icon: "📈", text: "Market price predictions", desc: "बाजार मूल्य भविष्यवाणी" },
                    { icon: "🌦️", text: "Weather-based recommendations", desc: "मौसम आधारित सिफारिशें" },
                    { icon: "💰", text: "Profit optimization tips", desc: "लाभ अनुकूलन युक्तियाँ" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-white/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={aiInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.text}</div>
                        <div className="text-sm text-primary-600 font-medium">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Start Chatting with Ayushmann
                    <ArrowRight className="ml-3" size={20} />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={aiInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Enhanced chat interface */}
                <div className="bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-8 relative z-10">
                    <motion.div
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Brain size={32} className="text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-bold">Ayushmann AI</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-sm opacity-90">Online • Ready to help</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="space-y-4 relative z-10">
                    <motion.div
                      className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={aiInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 }}
                    >
                      <p className="text-base leading-relaxed">
                        "गेहूं की उपज कैसे बढ़ाएं इस सीजन में?"
                      </p>
                      <p className="text-xs opacity-70 mt-2">Farmer • 2 min ago</p>
                    </motion.div>

                    <motion.div
                      className="bg-white text-primary-900 rounded-2xl p-6 shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={aiInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain size={16} className="text-primary-600" />
                        <span className="text-sm font-semibold text-primary-600">Ayushmann AI</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        बेहतर गेहूं उपज के लिए सुनिश्चित करें: 1) अक्टूबर-नवंबर में समय पर बुवाई
                        2) गुणवत्तापूर्ण बीजों का उपयोग 3) संतुलित NPK उर्वरक लगाएं
                        4) उचित सिंचाई कार्यक्रम बनाए रखें...
                      </p>
                    </motion.div>

                    <motion.div
                      className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={aiInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.0 }}
                    >
                      <p className="text-base leading-relaxed">
                        "How can I prevent tomato blight?"
                      </p>
                      <p className="text-xs opacity-70 mt-2">Farmer • Just now</p>
                    </motion.div>
                  </div>

                  {/* Typing indicator */}
                  <motion.div
                    className="flex items-center space-x-2 mt-6 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={aiInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm opacity-70">Ayushmann is typing...</span>
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-accent-orange rounded-full shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>

          {/* Additional CTA section */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={aiInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
              <h4 className="text-2xl md:text-3xl font-bold mb-4">
                Experience AI-Powered Farming Today
              </h4>
              <p className="text-lg mb-6 opacity-90">
                Join farmers across India who are already using Ayushmann for smarter agriculture
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Try Ayushmann Free
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 mb-16 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers already using AgriSmart 2.0
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Unified Footer with Proper Spacing */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          {/* About Developer */}
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">
              About the Developer
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              AgriSmart 2.0 is an AI-powered farming platform developed by{" "}
              <span className="font-semibold text-white">Naitik Kushwaha</span>,
              <span className="font-medium text-gray-200">
                {" "}
                Full Stack Developer
              </span>
              . Designed to help farmers across India with modern AI solutions
              and real-time support.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/naitik-kushwaha/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/NAITIKK682"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-900 transition"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Footer Bottom Info */}
          <div className="border-t border-gray-700 pt-8">
            <p className="mb-2 text-gray-400">
              © 2025 AgriSmart 2.0 - AI-Powered Farming for Modern India
            </p>
            <p className="text-sm text-gray-500">
              Made with ❤️ for Indian Farmers | भारतीय किसानों के लिए बनाया गया
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Modal for Welcome/Demo */}
      {showModal && <Modal content={modalContent} onClose={() => setShowModal(false)} />}

      {/* Floating CTA Button */}
      <FloatingCTA />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Landing;
