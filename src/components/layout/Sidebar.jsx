import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Terminal, Settings as SettingsIcon, LogOut, TerminalSquare } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useLogger } from '../../hooks/useLogger';
import { cn } from '../../utils/cn';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthContext();
  const { logClick } = useLogger('Sidebar');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Logs Console', path: '/logs', icon: Terminal },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleNavClick = (name) => {
    logClick(`Sidebar Navigation: ${name}`);
    if (onClose) onClose(); // Close mobile drawer
  };

  const handleLogout = () => {
    logClick('Logout Button');
    logout();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 z-50 transform lg:translate-x-0 lg:static lg:flex lg:flex-col lg:h-screen transition-transform duration-300 ease-in-out shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 select-none">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <TerminalSquare size={20} />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">PulseDev</span>
            <span className="text-[10px] block font-medium text-indigo-500 uppercase leading-none tracking-widest mt-0.5">Console</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => handleNavClick(item.name)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Session Info & Action */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 select-none">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                {user.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-205 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <LogOut size={18} />
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
