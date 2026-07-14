import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

interface UserResponse {
  status: string;
  data: {
    users: User[];
  };
}

export const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get<UserResponse>('/users');
      if (res && res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar user. Pastikan server backend sudah aktif dan database Neon terhubung.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Email wajib diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, { email, name: name || null });
        setSuccessMsg('User berhasil diperbarui!');
        setEditingUser(null);
      } else {
        await api.post('/users', { email, name: name || null });
        setSuccessMsg('User baru berhasil ditambahkan!');
      }
      setEmail('');
      setName('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Operasi gagal.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEmail(user.email);
    setName(user.name || '');
    setError('');
    setSuccessMsg('');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEmail('');
    setName('');
    setError('');
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    
    setError('');
    setSuccessMsg('');
    try {
      await api.delete(`/users/${id}`);
      setSuccessMsg('User berhasil dihapus!');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus user.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro banner */}
      <div className="relative overflow-hidden p-8 rounded-2xl border border-slate-800 bg-[#0d1222]/60 backdrop-blur-sm shadow-xl">
        <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent">
            User Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Aplikasi demo CRUD user lengkap dengan layered architecture. Terhubung dari client React (Vite) ke REST API Express.js dan database Neon PostgreSQL melalui Prisma ORM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-800 bg-[#0d1222]/80 shadow-xl self-start">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center justify-between">
            <span>{editingUser ? 'Perbarui User' : 'Tambah User Baru'}</span>
            {editingUser && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/25 font-semibold">
                Edit Mode
              </span>
            )}
          </h2>

          <form onSubmit={handleCreateOrUpdate} className="space-y-5">
            <Input
              id="user-email"
              label="Alamat Email"
              type="email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="user-name"
              label="Nama Lengkap"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {error && (
              <div className="p-3.5 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                {successMsg}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {editingUser && (
                <Button type="button" variant="secondary" onClick={handleCancelEdit} className="flex-1">
                  Batal
                </Button>
              )}
              <Button type="submit" variant="primary" isLoading={isSubmitLoading} className="flex-1">
                {editingUser ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </form>
        </div>

        {/* List table panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#0d1222]/80 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Daftar User Aktif</h2>
            <Button type="button" variant="secondary" onClick={fetchUsers} isLoading={isLoading} className="py-2 px-4 text-xs font-semibold uppercase tracking-wider">
              Refresh
            </Button>
          </div>

          {isLoading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
              <p className="text-slate-400 text-sm font-medium">Menghubungkan ke API server...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              <p className="text-slate-500 text-sm font-medium">Tidak ada data user ditemukan.</p>
              <p className="text-slate-600 text-xs mt-1">Gunakan panel di samping kiri untuk menambahkan user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-slate-800/80">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Dibuat Pada</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/30 transition duration-150">
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">#{u.id}</td>
                      <td className="px-6 py-4 font-medium text-white">{u.name || '-'}</td>
                      <td className="px-6 py-4 text-slate-300">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition duration-150 py-1.5 px-3 rounded-lg hover:bg-indigo-500/10 cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDeleteClick(u.id)}
                          className="text-xs font-bold text-rose-400 hover:text-rose-350 transition duration-150 py-1.5 px-3 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
