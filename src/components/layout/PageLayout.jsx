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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans relative">
      {/* Glowing background gradient auras */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] pointer-events-none z-0" />

      {/* Navigation Sidebar Panel */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Top Header Navbar */}
        <Navbar onMenuToggle={toggleMobileSidebar} />

        {/* Scrollable Page Content Frame */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
