import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { useLogger } from '../hooks/useLogger';

export const NotFound = () => {
  const { logWarn, logClick } = useLogger('NotFoundPage');
  const location = useLocation();

  useEffect(() => {
    logWarn(`User navigated to non-existent route: ${location.pathname}`, { path: location.pathname });
  }, [location.pathname, logWarn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 select-none">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mb-6">
          <Compass size={32} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">404 - Not Found</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
          The page path <code className="bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded text-indigo-500 select-all">{location.pathname}</code> does not exist in the dashboard router.
        </p>

        <Link
          to="/"
          onClick={() => logClick('Go Back to Home button (from 404)')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md shadow-indigo-650/15 cursor-pointer"
        >
          <Home size={16} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
