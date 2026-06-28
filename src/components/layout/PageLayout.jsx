import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Standard dashboard wrapper including responsive navigation, global navbar,
 * and page viewport wrapper.
 */
export const PageLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navigation Sidebar Panel */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar onMenuToggle={toggleMobileSidebar} />

        {/* Scrollable Page Content Frame */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-55/40 dark:bg-slate-950/20">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
