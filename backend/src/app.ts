import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import categoryRoute from './routes/category.route';
import venueRoute from './routes/venue.route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);
app.use("/categories", categoryRoute);
app.use("/venues", venueRoute)

app.use(errorHandler);

export default app;
