import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TerminalSquare, Shield, Activity, Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useLogger } from '../hooks/useLogger';
import { useAuthContext } from '../context/AuthContext';

export const Landing = () => {
  const { logInfo, logClick } = useLogger('LandingPage');
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    logInfo('Landing page rendered');
  }, [logInfo]);

  const handleLinkClick = (label) => {
    logClick(`Landing ${label}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Landing Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 z-50 flex items-center justify-between px-6 md:px-12 select-none">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <TerminalSquare size={20} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">PulseDev</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            onClick={() => handleLinkClick(isAuthenticated ? 'Dashboard (Nav)' : 'Login (Nav)')}
            className="text-sm font-semibold text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-slate-100 transition-colors"
          >
            {isAuthenticated ? 'Dashboard' : 'Sign In'}
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              onClick={() => handleLinkClick('Register (Nav)')}
              className="px-4 py-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-650/15 transition-all cursor-pointer"
            >
              Get Started
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-full text-xs font-semibold mb-6 animate-pulse select-none">
          <Zap size={12} />
          Now V2.0 live: Real-Time Server Monitoring
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl mb-6">
          Monitor Server Telemetry <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Without the Dashboard Bloat
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
          PulseDev delivers high-frequency dev console logs, resource monitoring metrics, and audit logs. Lightweight telemetry designed explicitly for SaaS engineer squads.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            onClick={() => handleLinkClick('CTA Start Free')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/25 hover:shadow-indigo-700/30 transition-all cursor-pointer"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            onClick={() => handleLinkClick('CTA View Features')}
            className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Learn More
          </a>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-12 border-t border-slate-200 dark:border-slate-900">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Live Telemetry</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Track CPU metrics, memory logs, and server execution latencies. Instantly react to deviations.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Centralized Logger</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A single structured middleware pipeline that intercepts system events, navigation paths, actions, and errors.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Cpu size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Boundaries</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatic component-level crash detection pipelines that capture failure footprints and keep runtime clean.
            </p>
          </div>
        </div>

        {/* Mock Pricing Section */}
        <div className="w-full pt-24 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Simple Developer Pricing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">
            No credit cards, cancel anytime. Spin up in less than 3 minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            {/* Free Tier */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Sandbox</h4>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-4">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></p>
              <ul className="space-y-2 mb-6">
                {['Single node tracking', '250 logs live visualizer buffer', 'Community templates support', 'Standard logging middleware'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                    <CheckCircle2 size={14} className="text-indigo-550" /> {feat}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                onClick={() => handleLinkClick('Tier Sandbox')}
                className="block text-center w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-6 bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-2xl shadow-md relative">
              <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 bg-indigo-650 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">Popular</span>
              <h4 className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-1">Squad</h4>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-4">$29 <span className="text-xs font-normal text-slate-400">/ user / mo</span></p>
              <ul className="space-y-2 mb-6">
                {['Unlimited telemetry nodes', 'Infinite logging buffer & exports', 'React Error Boundary reporting', '24/7 dedicated alert hooks', 'Slack & Webhook integrations'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                    <CheckCircle2 size={14} className="text-indigo-550" /> {feat}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                onClick={() => handleLinkClick('Tier Squad')}
                className="block text-center w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400 select-none">
        &copy; {new Date().getFullYear()} PulseDev Inc. Structured developer analytics under MIT License.
      </footer>
    </div>
  );
};

export default Landing;
