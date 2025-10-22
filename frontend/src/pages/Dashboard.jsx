import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cloud,
  Scan,
  ShoppingCart,
  Droplets,
  Bot,
  Users,
  TrendingUp,
  Activity,
  Award,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { dashboardAPI } from "../utils/api";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { language } = useThemeStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats on error
      setStats({
        disease_scans: 0,
        irrigation_plans: 0,
        products_listed: 0,
        ai_chats: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Check Weather",
      titleHi: "मौसम देखें",
      description: "Get weather forecast",
      descriptionHi: "मौसम पूर्वानुमान प्राप्त करें",
      icon: Cloud,
      link: "/app/weather",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Detect Disease",
      titleHi: "रोग पहचानें",
      description: "Scan crop diseases",
      descriptionHi: "फसल रोग स्कैन करें",
      icon: Scan,
      link: "/app/disease-detection",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Marketplace",
      titleHi: "बाज़ार",
      description: "Buy/Sell products",
      descriptionHi: "उत्पाद खरीदें/बेचें",
      icon: ShoppingCart,
      link: "/app/marketplace",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Irrigation Plan",
      titleHi: "सिंचाई योजना",
      description: "Smart water scheduling",
      descriptionHi: "स्मार्ट पानी योजना",
      icon: Droplets,
      link: "/app/irrigation",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "AI Assistant",
      titleHi: "AI सहायक",
      description: "Chat with Ayushmann",
      descriptionHi: "आयुष्मान से बात करें",
      icon: Bot,
      link: "/app/ai-chat",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Farmer Connect",
      titleHi: "किसान कनेक्ट",
      description: "Community chat",
      descriptionHi: "समुदाय चैट",
      icon: Users,
      link: "/app/connect",
      color: "from-green-500 to-green-600",
    },
  ];

  const statCards = [
    {
      title: "Disease Scans",
      titleHi: "रोग स्कैन",
      value: stats?.disease_scans || 0,
      icon: Scan,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Irrigation Plans",
      titleHi: "सिंचाई योजनाएं",
      value: stats?.irrigation_plans || 0,
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Products Listed",
      titleHi: "सूचीबद्ध उत्पाद",
      value: stats?.products_listed || 0,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "AI Consultations",
      titleHi: "AI परामर्श",
      value: stats?.ai_chats || 0,
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const recentActivities = [
    {
      title: "Weather alert: Heavy rainfall expected",
      titleHi: "मौसम चेतावनी: भारी बारिश की संभावना",
      time: "2 hours ago",
      icon: Cloud,
    },
    {
      title: "New government subsidy scheme available",
      titleHi: "नई सरकारी सब्सिडी योजना उपलब्ध",
      time: "5 hours ago",
      icon: Award,
    },
    {
      title: "3 new products added to marketplace",
      titleHi: "बाज़ार में 3 नए उत्पाद जोड़े गए",
      time: "1 day ago",
      icon: ShoppingCart,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {language === "en"
                ? `Welcome back, ${user?.name}!`
                : `स्वागत है, ${user?.name}!`}
            </h1>
            <p className="text-primary-100">
              {language === "en"
                ? "Here's what's happening with your farm today"
                : "आज आपके खेत में क्या हो रहा है"}
            </p>
          </div>
          <div className="hidden md:block w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-float">
            <Activity size={48} />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === "en" ? stat.title : stat.titleHi}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {language === "en" ? "Quick Actions" : "त्वरित कार्य"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={action.link}
                  className="block hover:scale-105 cursor-pointer group bg-transparent shadow-none"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {language === "en" ? action.title : action.titleHi}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "en"
                      ? action.description
                      : action.descriptionHi}
                  </p>
                  <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-semibold">
                    {language === "en" ? "Get Started" : "शुरू करें"}
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">
            {language === "en" ? "Recent Activity" : "हाल की गतिविधि"}
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon
                      size={20}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {language === "en" ? activity.title : activity.titleHi}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="card bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <h3 className="text-xl font-bold mb-4">
            {language === "en"
              ? "💡 Farming Tip of the Day"
              : "💡 आज का खेती टिप"}
          </h3>
          <div className="space-y-3">
            <p className="font-semibold text-primary-700 dark:text-primary-300">
              {language === "en"
                ? "Optimize Your Irrigation Schedule"
                : "अपनी सिंचाई अनुसूची को अनुकूलित करें"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {language === "en"
                ? "Water your crops early in the morning or late evening to minimize evaporation. This can save up to 30% water and improve crop health."
                : "वाष्पीकरण को कम करने के लिए सुबह जल्दी या शाम को देर से अपनी फसलों को पानी दें। इससे 30% तक पानी की बचत हो सकती है।"}
            </p>
            <Link
              to="/app/farming-tips"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              {language === "en" ? "View More Tips" : "और टिप्स देखें"}
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
