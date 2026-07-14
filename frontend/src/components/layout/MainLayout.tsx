import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-indigo-600/20">
                E
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Eventify
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition duration-200">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200"
            >
              Sign In Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 bg-[#080b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Eventify. Dibuat dengan React 19 + Tailwind v4.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition duration-200">Syarat</a>
            <a href="#" className="hover:text-slate-300 transition duration-200">Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MainLayout;
