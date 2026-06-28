# PulseDev - Developer Analytics & Server Telemetry SaaS Dashboard

PulseDev is a modern, production-grade Developer Analytics & Server Monitoring SaaS platform built for company coding assessment. The primary goal of this application is to demonstrate clean React architecture, accessibility, responsive UI design, and—most importantly—a **centralized logging middleware system** that tracks all critical events in the client application in real-time.

---

## 🚀 Key Features

* **Centralized Logging Middleware**: Intercepts and formats all page transitions, API requests/responses, form submissions, button interactions, and caught rendering errors. Includes a live **Log Inspector Console** to watch log sequences in real-time.
* **Responsive SaaS Dashboard Layout**: Responsive Sidebar and Top Navbar supporting light and dark theme mode preferences stored in `localStorage`.
* **Robust Form Validations**: Accessible Login, Sign Up, and Settings forms backed by thorough validator checks and immediate visual validation feedback.
* **API Service Layer**: Simulated async endpoints representing hardware metrics and telemetry records, complete with latency simulators, request/response intercept logging, and simulated server outages.
* **React Error Boundaries**: Component-level exception interceptors that capture rendering crashes, report the footprint through the logger middleware, and show a beautiful recovery panel.
* **Zero Linter Warnings / Errors**: 100% ESLint-clean codebase, built on the latest **Vite 8** and **React 19** packages.

---

## 🛠️ Tech Stack

* **Vite 8 & React 19**: High-performance bundler and modern React functional elements with Hooks.
* **Tailwind CSS v4**: Utility-first CSS using the new `@tailwindcss/vite` plugin (no configuration file needed; configured via modern CSS-first theme variables).
* **React Router Dom v7**: Declarative client routing linking public screens and auth-protected layouts.
* **Lucide React**: Clean SVG-based vector iconography.

---

## 📂 Project Structure

```
src/
  ├── assets/          # SVG and media resources
  ├── components/      # Reusable visual components
  │   ├── common/      # Core inputs, buttons, tables, cards, toasts, and Error Boundary
  │   └── layout/      # Navbar, Sidebar, and PageLayout wrapper
  ├── context/         # Auth, Theme, and Log context states
  ├── hooks/           # useLogger utility hook
  ├── middleware/      # Centralized logging middleware (logger.js)
  ├── pages/           # Landing, Login, Register, Dashboard, Logs console, Settings, and 404
  ├── routes/          # Protected and public path routes configurations
  ├── services/        # Mock API telemetry service client (api.js)
  ├── utils/           # cn className merger, date formatters, and sleep delay helpers
  ├── App.jsx          # Providers coordinator and router shell
  ├── index.css        # Tailwind v4 import baseline and global tokens
  └── main.jsx         # DOM mount entry
```

---

## ⚙️ Environment Variables

The project uses Vite's built-in environment variable parser. To configure custom API base paths, create a `.env` file in the root directory:

```env
# Telemetry Mock API Service URL
VITE_API_URL=https://api.pulsedev.internal/v1
```

---

## 📦 Installation & Setup

Follow these commands to clone, initialize, and spin up the project locally:

1. **Navigate to the Project Directory**
   ```bash
   cd /Users/vivekchauhan/.gemini/antigravity/scratch/assessment-app
   ```

2. **Install Package Dependencies**
   ```bash
   npm install
   ```

3. **Run Dev Environment Server**
   ```bash
   npm run dev
   ```
   Open your browser to the local URL (usually `http://localhost:5173`) to view the application.

4. **Verify ESLint Lints (No warnings or errors)**
   ```bash
   npm run lint
   ```

5. **Generate Production Bundle Build**
   ```bash
   npm run build
   ```

---

## 🛡️ Centralized Logging Implementation

Instead of cluttering components with raw `console.log()` outputs, the application utilizes a centralized logger in `src/middleware/logger.js`.

### Developer Hook Usage Example
To log interactions, import the `useLogger` helper hook inside any functional component:
```javascript
import { useLogger } from '../hooks/useLogger';

export const MyComponent = () => {
  const { logClick, logSubmit } = useLogger('MyComponent');

  return (
    <div>
      {/* Click log */}
      <button onClick={() => logClick('Submit Button')}>
        Action Button
      </button>
      
      {/* Form submit log */}
      <form onSubmit={() => logSubmit('Profile Form')}>
        ...
      </form>
    </div>
  );
};
```

---

## 📝 Recommended Git Workflow & Commits

To present a professional commit history on GitHub, use these clean commit messages as you initialize and upload your code:

1. **Initial Repository Setup**
   ```bash
   git init
   git add .
   git commit -m "chore: initial React + Vite scaffolding with Tailwind CSS v4 & ESLint"
   ```

2. **Core Logging Middleware & Contexts**
   ```bash
   git commit -m "feat: implement centralized logger middleware and Log/Theme contexts"
   ```

3. **Routing & Auth Context Integration**
   ```bash
   git commit -m "feat: implement mock AuthContext and ProtectedRoutes navigation mapping"
   ```

4. **Reusable UI Elements & Layouts**
   ```bash
   git commit -m "feat: build common components (Table, Input, Button, Toast) and layouts"
   ```

5. **SaaS Dashboard Pages**
   ```bash
   git commit -m "feat: create landing page, dashboard widget, settings page, and live logs console"
   ```

6. **Error Boundary Integration**
   ```bash
   git commit -m "feat: implement React ErrorBoundary with live middleware error reporting"
   ```

7. **Production Verification**
   ```bash
   git commit -m "chore: clean up ESLint code warnings and verify production bundle compilation"
   ```

8. **Push to Remote Repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git branch -M main
   git push -u origin main
   ```
