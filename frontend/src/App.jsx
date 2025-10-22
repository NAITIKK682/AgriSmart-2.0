import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Weather from './pages/Weather'
import DiseaseDetection from './pages/DiseaseDetection'
import Marketplace from './pages/Marketplace'
import FarmingTips from './pages/FarmingTips'
import IrrigationPlanner from './pages/IrrigationPlanner'
import FarmerConnect from './pages/FarmerConnect'
import GovernmentSchemes from './pages/GovernmentSchemes'
import Forum from './pages/Forum'
import AIChat from './pages/AIChat'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return <>{isAuthenticated ? children : <Navigate to="/login" />}</>
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="weather" element={<Weather />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="farming-tips" element={<FarmingTips />} />
          <Route path="irrigation" element={<IrrigationPlanner />} />
          <Route path="connect" element={<FarmerConnect />} />
          <Route path="schemes" element={<GovernmentSchemes />} />
          <Route path="forum" element={<Forum />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
