# AgriSmart 2.0 - Frontend

Modern React application with TailwindCSS and real-time features.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Application runs on `http://localhost:3000`

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full theme support
- **Real-time Chat**: Socket.IO integration
- **Animations**: Framer Motion
- **State Management**: Zustand
- **API Integration**: Axios with interceptors
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── store/          # State management
├── utils/          # Utilities & API
├── App.jsx         # Main app
└── index.css       # Global styles
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

## Deployment

See `/docs/DEPLOYMENT_GUIDE.md`