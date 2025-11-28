# React Admin Dashboard

> Production-ready SaaS admin template built with React 18, TypeScript, Vite 5, and Ant Design v5.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://react-admin-dashboard-gamma-six.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple)](https://vitejs.dev/)

---

## Overview

| Why it matters | How it helps |
| --- | --- |
| ⚡️ Modern stack | React 18 + Vite 5 + TypeScript 5 = instant HMR and full type safety |
| 🎨 Polished UI | Ant Design v5 components, theme switcher, and adaptive layouts |
| 🔐 Real workflows | Auth, protected routes, SaaS dashboard, and customer lifecycle management |
| 🧱 Strong DX | File-based routing, Zustand stores, mock APIs, and zero-config startup |

### SaaS Demo Modules
- **Dashboard** – KPI cards, revenue trend chart, customer source breakdown, and automated health insights
- **Customers** – Advanced filtering, ownership, status transitions, detail drawer, and activity timeline

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.2.2 | Type Safety |
| Vite | 5.3.1 | Build Tool |
| Ant Design | 5.18.3 | UI Components |
| Ant Design Charts | 2.2.3 | Data Visualization |
| React Router | 6.23.1 | Routing |
| Zustand | 4.5.2 | State Management |
| Axios | 1.13.2 | HTTP Client |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Shell layout: header, sidebar, breadcrumbs, content
│   └── auth/            # Shared auth UI pieces
├── views/
│   ├── auth/            # Login & register pages (unprotected)
│   ├── dashboard/       # SaaS dashboard page + routes
│   └── customers/       # Customer management module + routes
├── router/              # Auto-imported route definitions & guards
├── store/               # Zustand stores (config + user)
├── utils/               # API client, mock helpers, shared utils
└── App.tsx              # Root layout orchestration
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm / pnpm / yarn (examples use npm)

### Installation

```bash
git clone https://github.com/larry-xue/react-admin-dashboard.git
cd react-admin-dashboard
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Demo Credentials
| Role | Username | Password | Shortcut |
| --- | --- | --- | --- |
| Admin | `admin` | `admin123` | `/auth/login?demo=admin` |
| User | `user` | `user123` | `/auth/login?demo=user` |
| Demo | `demo` | `demo123` | `/auth/login?demo=demo` |

---

## Core Concepts

### Authentication & Authorization
- Login/register flows with Ant Design forms
- `ProtectedRoute` wrapper guarding all non-`/auth/**` routes
- Tokens stored in Zustand + localStorage with auto-injection via Axios interceptors

### Routing
- Vite `import.meta.glob` auto-loads every `*.router.tsx`
- `meta` drives sidebar label/icon/hide/order plus page title
- Nested routes supported out of the box (see `customers` module)

### Theming
- Light / Dark / Compact algorithms controlled via Zustand store
- Persistent theme preferences using localStorage
- Runtime color editing (e.g., primary color) via store

### Layout & Responsiveness
- Sticky header, collapsible sidebar, breadcrumb trail, and flexible content area
- Breakpoint-aware spacing and auto-collapse on mobile
- Dark-mode-aware charts and cards (Ant Design charts + tokens)

---

## Customization Guide

### Add a Route & Page
1. Create a directory under `src/views/your-page`
2. Build your page component in `index.tsx`
3. Define a `*.router.tsx` file:

```tsx
// src/views/example/example.router.tsx
import { ExampleOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import ExamplePage from '.'

const exampleRoutes: AdminRouterItem[] = [
  {
    path: 'example',
    element: <ExamplePage />,
    meta: {
      label: 'Example',
      title: 'Example Page',
      key: '/example',
      icon: <ExampleOutlined />,
      order: 3,
    },
  },
]

export default exampleRoutes
```

### Adjust Theme Defaults
Modify `src/store/config.ts`:
```ts
themeConfig: {
  _algorithm: ['default'],      // add 'dark' or 'compact'
  algorithm: [theme.defaultAlgorithm],
  primaryColor: '#03dac6',      // set your brand color
}
```

### API / Mock Settings
`.env` (create if missing):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true             # use built-in mock auth/data
```

---

## NPM Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # ESLint check (ts/tsx)
```

---

## Deployment
Output lives in `dist/`. Any static host works:
- [Vercel](https://vercel.com/) – zero-config for Vite
- [Netlify](https://www.netlify.com/) – continuous deployments
- [GitHub Pages](https://pages.github.com/) – static hosting

---

## Contributing
PRs and issues are welcome! Please:
1. Fork the repo & create a feature branch
2. Add tests or docs where it makes sense
3. Run `npm run lint` before submitting

---

## License
MIT © [Yujian Xue](https://larryxue.dev)

Acknowledgements: [Ant Design](https://ant.design/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Zustand](https://github.com/pmndrs/zustand)
