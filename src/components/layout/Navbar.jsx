import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useLogger } from '../../hooks/useLogger';

export const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeContext();
  const { logClick } = useLogger('Navbar');

  // Convert pathname to readable title
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Home';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleNotificationClick = () => {
    logClick('Notification Bell Icon');
  };

  const handleToggleTheme = () => {
    logClick('Theme Switch Button', { currentTheme: isDark ? 'dark' : 'light' });
    toggleTheme();
  };

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-6 shrink-0 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon (Mock) */}
        <button
          onClick={handleNotificationClick}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
