import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Mount all API endpoints under /api
app.use('/api', routes);

// Fallback for route not found
// app.use((req, res) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
//   });
// });

// Global Error Handler
app.use(errorHandler);

export default app;
