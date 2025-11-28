# React Admin Dashboard

> A modern, production-ready admin dashboard template built with React 18, TypeScript, Vite 5, and Ant Design v5.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://react-admin-dashboard-gamma-six.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple)](https://vitejs.dev/)

---

## ✨ Features

### Core Features
- **Fast Development** - Vite 5 + React 18 + TypeScript for lightning-fast HMR
- **Modern UI** - Built with Ant Design v5, fully customizable themes
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Authentication** - Complete auth flow with login, registration, and protected routes
- **Theme System** - Light/Dark/Compact modes with persistent preferences
- **Auto Routes** - File-based routing with automatic route discovery

### Developer Experience
- **Zero Config** - Out-of-the-box setup, ready to use
- **TypeScript** - Full type safety throughout the codebase
- **Mock API** - Built-in mock authentication for development and demos
- **Demo Mode** - Quick login buttons for presentations
- **State Management** - Zustand for lightweight, scalable state management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

**Method 1: Clone the repository**

```bash
git clone https://github.com/larry-xue/react-admin-dashboard.git
cd react-admin-dashboard
npm install
npm run dev
```

**Method 2: Using npx degit**

```bash
npx degit larry-xue/react-admin-dashboard my-project
cd my-project
npm install
npm run dev
```

Visit `http://localhost:5173` to see your app.

### Quick Demo Login

The project includes mock authentication for quick demos:

**Demo Accounts:**
- `admin / admin123`
- `user / user123`
- `demo / demo123`

**Quick Login:**
- Use the quick login buttons on the login page
- Or visit `/auth/login?demo=admin` to auto-fill credentials

---

## 📖 Documentation

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.2.2 | Type Safety |
| Vite | 5.3.1 | Build Tool |
| Ant Design | 5.18.3 | UI Components |
| React Router | 6.23.1 | Routing |
| Zustand | 4.5.2 | State Management |
| Axios | 1.13.2 | HTTP Client |

### Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Sidebar, Content, etc.)
│   └── auth/            # Authentication components
├── views/               # Page components
│   ├── auth/            # Login & Register pages
│   └── demo/            # Example pages
├── router/              # Route configuration
├── store/               # Zustand stores
│   ├── config.ts        # Theme configuration
│   └── user.ts          # User state management
├── utils/               # Utility functions
│   ├── api.ts           # HTTP client wrapper
│   └── mock.ts          # Mock API for development
└── App.tsx              # Root component
```

### Key Features Explained

#### 🔐 Authentication System

- **Login/Register Pages** - Beautiful, responsive auth pages
- **Protected Routes** - Automatic route guarding
- **Token Management** - Automatic token injection and refresh
- **Mock Mode** - Enable mock API by setting `VITE_USE_MOCK=true` in `.env`

#### 🎨 Theme System

- **Multiple Themes** - Light, Dark, and Compact modes
- **Persistent Settings** - Theme preferences saved to localStorage
- **Dynamic Switching** - Real-time theme updates across the app

#### 📱 Responsive Layout

- **Mobile-First** - Optimized for all screen sizes
- **Collapsible Sidebar** - Auto-collapses on mobile devices
- **Fixed Header** - Always accessible navigation
- **Adaptive Content** - Content padding adjusts by breakpoint

#### 🛣️ Routing

- **File-Based Routes** - Create `*.router.tsx` files to add routes
- **Nested Routes** - Full support for nested route structures
- **Auto Menu Generation** - Sidebar menu automatically generated from routes

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Mock Mode (for development/demo)
VITE_USE_MOCK=true
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

---

## 🎨 Customization

### Adding New Routes

Create a new route file in `src/views/`:

```typescript
// src/views/example/example.router.tsx
import { AdminRouterItem } from '../../router'
import ExamplePage from './index'

const exampleRoutes: AdminRouterItem[] = [
  {
    path: 'example',
    element: <ExamplePage />,
    meta: {
      label: 'Example',
      title: 'Example Page',
      key: '/example',
      icon: <Icon />,
    },
  },
]

export default exampleRoutes
```

### Customizing Theme

Modify theme settings in `src/store/config.ts`:

```typescript
const useConfigStore = create<ConfigState & Actions>()(
  persist(
    (set) => ({
      themeConfig: {
        _algorithm: ['default'],
        algorithm: [theme.defaultAlgorithm],
        primaryColor: '#03dac6' // Change primary color
      },
      // ...
    })
  )
)
```

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy

The project is ready to deploy to any static hosting service:

- **Vercel** - Zero-config deployment
- **Netlify** - Automatic deployments
- **GitHub Pages** - Static site hosting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) - UI component library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React Router](https://reactrouter.com/) - Declarative routing for React
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management

---

**Made with ❤️ and a litte coffee by [Yujian Xue](https://larryxue.dev)**
