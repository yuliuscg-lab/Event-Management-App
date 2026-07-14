import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }

    setIsLoading(true);
    // Mock login timeout, then redirect to home dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Selamat Datang
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Masuk untuk mengelola event & data user Anda
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          id="login-email"
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="login-password"
          label="Kata Sandi"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right">
          <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition duration-200">
            Lupa kata sandi?
          </a>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
          Masuk
        </Button>
      </form>
    </div>
  );
};
export default Login;
