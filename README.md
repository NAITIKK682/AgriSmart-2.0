# AgriSmart 2.0 - AI-Powered Farmer Assistant Platform

<div align="center">
  <h3>🌱 AI-Powered Farming for Modern India 🌱</h3>
  <p><strong>भारतीय कृषि के लिए आधुनिक एआई समाधान</strong></p>
</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

AgriSmart 2.0 is a comprehensive full-stack web platform designed to assist farmers with AI technology, community support, and smart farming tools. The platform features:

- **AI-Powered Assistance**: Bilingual (Hindi/English) AI chatbot named Ayushmann
- **Crop Disease Detection**: Real-time detection using TensorFlow with 85%+ accuracy
- **Weather Dashboard**: Real-time weather data with farming recommendations
- **Digital Marketplace**: Buy/sell agricultural products directly
- **Community Features**: Real-time chat, forums, and knowledge sharing
- **Smart Tools**: Irrigation planner, government schemes database, farming tips

---

## ✨ Features

### Core Features
1. **Dashboard**
   - Quick stats and analytics
   - Recent activity feed
   - Quick action shortcuts
   - Personalized farming recommendations

2. **Authentication System**
   - Email/password login
   - Google OAuth integration
   - Role management (Farmer, Expert, Admin)
   - Secure JWT-based authentication

3. **Weather Dashboard**
   - Real-time weather updates
   - 7-day forecast
   - Rainfall predictions
   - Farming recommendations based on weather

4. **Crop Disease Detection**
   - Image upload for disease detection
   - AI-powered analysis (85%+ accuracy)
   - Treatment suggestions
   - Preventive measures
   - Detection history

5. **Digital Marketplace**
   - Product listings with categories
   - Search and filter functionality
   - Ratings and reviews
   - Organic product badges

6. **Farming Tips & Knowledge Hub**
   - Expert advice articles
   - Seasonal guides
   - Pest and soil management tips
   - Video tutorials (optional)

7. **Smart Irrigation Planner**
   - Crop-wise water requirements
   - Soil type analysis
   - AI-powered scheduling
   - Calendar integration

8. **Farmer Connect (Real-time Chat)**
   - Multiple chat rooms
   - Real-time messaging with Socket.IO
   - Image attachments
   - Typing indicators
   - Bilingual support

9. **Government Schemes**
   - Comprehensive scheme listings
   - Categories: Subsidies, Loans, Insurance, Training
   - Eligibility criteria
   - Application process details
   - Contact information

10. **Community Forum**
    - Topic-based discussions
    - Comments and replies
    - Like/upvote system
    - Expert badges
    - Trending topics

11. **AI Chatbot (Ayushmann)**
    - Bilingual support (Hindi/English)
    - 24/7 availability
    - Context-aware responses
    - Quick question suggestions

### UI/UX Features
- Modern green agricultural theme
- Glassmorphism design
- Smooth animations
- Gradient backgrounds
- Responsive mobile-first design
- Light/dark mode toggle
- Intuitive navigation
- Icon-based menus
- Farmer-friendly interface

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Real-time**: Socket.IO Client
- **Notifications**: React Hot Toast

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite
- **Authentication**: Flask-JWT-Extended
- **Real-time**: Flask-SocketIO
- **Password Hashing**: Bcrypt/Werkzeug
- **CORS**: Flask-CORS
- **AI Integration**: OpenAI/Google Gemini API
- **ML Model**: TensorFlow (for disease detection)

### Security
- JWT authentication
- Bcrypt password hashing
- Input sanitization
- CSRF protection
- Secure file uploads

### Performance
- Lazy loading
- Caching
- Optimized images
- Code splitting

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. **Initialize database**
```bash
python -c "from app import init_db; init_db()"
```

6. **Seed sample data**
```bash
python seed_data.py
```

7. **Run the server**
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

The frontend will run on `http://localhost:3000`

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# API Keys
OPENWEATHER_API_KEY=your-openweather-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Usage

### For Farmers

1. **Register**: Create an account with email or Google OAuth
2. **Dashboard**: View your farming stats and quick actions
3. **Weather**: Check weather forecasts and get farming recommendations
4. **Disease Detection**: Upload crop images to detect diseases
5. **Marketplace**: Buy/sell agricultural products
6. **AI Chat**: Ask Ayushmann for farming advice in Hindi or English
7. **Community**: Join forums and chat rooms to connect with other farmers

### For Experts

1. **Share Knowledge**: Post tips and advice in forums
2. **Answer Questions**: Help farmers solve problems
3. **Provide Resources**: Upload guides and tutorials

### For Admins

1. **Manage Users**: Monitor and manage user accounts
2. **Moderate Content**: Review and moderate posts
3. **Update Schemes**: Add/update government schemes information

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ram Kumar",
  "email": "ram@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "role": "farmer",
  "language": "hi",
  "location": "Punjab",
  "farm_size": 5.0
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ram@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "google_id": "...",
  "email": "ram@example.com",
  "name": "Ram Kumar"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

### Weather Endpoint

#### Get Weather
```http
GET /api/weather?location=Delhi
Authorization: Bearer <token>
```

### Disease Detection

#### Detect Disease
```http
POST /api/disease/detect
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

### Marketplace Endpoints

#### Get Products
```http
GET /api/products?category=Grains&search=wheat
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Organic Wheat",
  "category": "Grains",
  "price": 35,
  "unit": "kg",
  "quantity": 100,
  "is_organic": 1
}
```

### More endpoints available in `/docs/API_DOCUMENTATION.md`

---

## 📁 Project Structure

```
agrismart-2.0/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── seed_data.py        # Database seeding script
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   ├── agrismart.db        # SQLite database
│   └── uploads/            # Uploaded files
│       ├── crops/
│       ├── products/
│       └── profiles/
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── Layout.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Weather.jsx
│   │   │   ├── DiseaseDetection.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── FarmingTips.jsx
│   │   │   ├── IrrigationPlanner.jsx
│   │   │   ├── FarmerConnect.jsx
│   │   │   ├── GovernmentSchemes.jsx
│   │   │   ├── Forum.jsx
│   │   │   ├── AIChat.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/          # State management
│   │   │   ├── authStore.js
│   │   │   └── themeStore.js
│   │   ├── utils/          # Utilities
│   │   │   └── api.js
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── USER_MANUAL.md
│   └── ADMIN_MANUAL.md
│
└── README.md
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables on your hosting platform
2. Deploy using Git or Docker
3. Run database migrations
4. Set up static file serving

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables
4. Configure redirects for SPA routing

See `/docs/DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🎯 Success Metrics

- ✅ Fully functional pages and features
- ✅ AI accuracy: Disease detection >85%
- ✅ Real-time chat working with Socket.IO
- ✅ Mobile responsive design
- ✅ Fast load time (<3 seconds)
- ✅ Secure authentication with JWT
- ✅ Clean, maintainable code
- ✅ Farmer-friendly interface

---

## 🎨 Branding

- **Logo**: 🌱 Leaf/plant with "AgriSmart 2.0"
- **Tagline**: "AI-Powered Farming for Modern India"
- **Mascot**: Ayushmann AI Assistant
- **Colors**:
  - Primary: Green (#22c55e) - Growth, Nature
  - Secondary: Blue (#3b82f6) - Trust, Technology
  - Accent: Orange (#fb923c) - Energy, Warmth

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👥 Team

- **Project Lead**: Your Name
- **Backend Developer**: Your Name
- **Frontend Developer**: Your Name
- **UI/UX Designer**: Your Name
- **AI/ML Engineer**: Your Name

---

## 📞 Support

For support, email support@agrismart.in or join our community forum.

---

## 🙏 Acknowledgments

- OpenWeatherMap for weather API
- OpenAI/Google for AI capabilities
- TensorFlow for ML model
- Indian farmers for inspiration

---

<div align="center">
  <p>Made with ❤️ for Indian Farmers</p>
  <p><strong>भारतीय किसानों के लिए प्यार से बनाया गया</strong></p>
</div># AgriSmart-2.0
