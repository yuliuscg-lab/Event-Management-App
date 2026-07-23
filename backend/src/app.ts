import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import cookieParser from 'cookie-parser';
import categoryRoute from './routes/category.route';
import venueRoute from './routes/venue.route';
import eventRoute from './routes/event.route';
import publicEventRoute from './routes/public-event.route';
import ticketTypeRoute from './routes/ticket-type.route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);
app.use("/api/categories", categoryRoute);
app.use("/api/venues", venueRoute);
app.use("/api/events", eventRoute);
app.use("/api/public/events", publicEventRoute);
app.use("/api/ticket-types", ticketTypeRoute);

app.use(errorHandler);

export default app;
