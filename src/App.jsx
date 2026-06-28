import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LogProvider } from './context/LogContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes';
import { logger, LOG_CATEGORIES } from './middleware/logger';

// Note: Let's double check if we named ThemeContext file ThemeContext.jsx. 
// In the previous step, we wrote ThemeProvider inside ThemeContext.jsx!
// Let's verify we import ThemeProvider from ThemeContext.
import { ThemeProvider } from './context/ThemeContext';

function App() {
  useEffect(() => {
    // Record application bootstrap event
    logger.info(LOG_CATEGORIES.APP, 'PulseDev SaaS dashboard application boot sequence completed');
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LogProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </LogProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
