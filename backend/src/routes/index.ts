import { Request, Response, Router } from 'express';
import { success } from '../utils/response';

import userRouter from './user.route';
import authRouter from './auth.route';
import categoryRouter from './category.route';
import eventRouter from './event.route';
import venueRouter from './venue.route';
import ticketTypeRouter from './ticket-type.route';
import publicEventRouter from './public-event.route';
import salesOrderRouter from './sales-order.route';
import paymentRouter from './payment.route';
import pointRouter from './point.route';
import couponRouter from './coupon.route';
import issuedTicketRouter from './issued-ticket.route';

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    return success(res, 200, "API is running");
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/venues', venueRouter);
router.use('/events', eventRouter);
router.use('/public/events', publicEventRouter);
router.use('/ticket-types', ticketTypeRouter);
router.use('/sales-orders', salesOrderRouter);
router.use('/payments', paymentRouter);
router.use('/points', pointRouter);
router.use('/coupons', couponRouter);
router.use('/issued-tickets', issuedTicketRouter);

export default router;