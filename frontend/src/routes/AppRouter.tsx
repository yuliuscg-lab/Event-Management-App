import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout routing */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        {/* Standalone login page */}
        <Route path="/login" element={
          <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">
            <Login />
          </div>
        } />

        {/* Catch-all page */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-4 text-slate-400">
            <h1 className="text-4xl font-extrabold text-white">404</h1>
            <p className="text-sm">Halaman tidak ditemukan.</p>
            <a href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wider">Kembali Ke Dashboard</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
