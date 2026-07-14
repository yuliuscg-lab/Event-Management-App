# Event Management Project (Monorepo)

Monorepo scaffold untuk project full-stack **Event Management** dengan pembagian folder terpisah: `frontend/` dan `backend/`.

## Tech Stack
- **Bahasa**: TypeScript v7.0.2 (Strict Mode)
- **Frontend**: Vite v8.1.4, React v19.2.7, React Router v8.2.0, Tailwind CSS v4.3.2 (CSS import)
- **Backend**: Express.js v5.2.1 (Layered Architecture: Route -> Controller -> Service -> Repository -> Prisma -> DB), Zod for validation
- **ORM & Database**: Prisma v7.8.0, PostgreSQL (Neon.com)

---

## Persiapan Awal (.env)

Sebelum menjalankan aplikasi, buat file `.env` di masing-masing sub-folder.

### 1. Backend (`backend/.env`)
Salin file `.env.example` ke `.env` di dalam folder `backend/`:
```bash
PORT=5000
DATABASE_URL="postgresql://username:password@neon-host/dbname?sslmode=require"
```
*Ganti `DATABASE_URL` dengan connection string dari database PostgreSQL Neon.com Anda.*

### 2. Frontend (`frontend/.env`)
Salin file `.env.example` ke `.env` di dalam folder `frontend/`:
```bash
VITE_API_URL="http://localhost:5000/api"
```

---

## Cara Instalasi & Menjalankan

Buka terminal dan lakukan instalasi & jalankan environment secara terpisah:

### Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Lakukan sinkronisasi database dan generate Prisma Client:
   ```bash
   npx prisma db push
   # atau npx prisma generate jika skema database sudah sinkron
   ```
4. Jalankan server dalam mode development:
   ```bash
   npm run dev
   ```
   Server backend akan berjalan di port yang telah didefinisikan (default: `http://localhost:5000`).

### Frontend
1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   Aplikasi frontend dapat diakses melalui browser di alamat yang diberikan oleh Vite (default: `http://localhost:5173`).

---

## Scripts yang Tersedia

Masing-masing sub-folder memiliki script berikut di `package.json`:
- `npm run dev`: Menjalankan aplikasi dalam development mode (dengan auto-reload).
- `npm run build`: Melakukan compile TypeScript ke JavaScript production bundle.
- `npm run start`: Menjalankan compiled JavaScript production build.
