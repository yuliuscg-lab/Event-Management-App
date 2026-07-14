import { Request, Response, Router } from 'express';
import userRouter from './user.route';

const router = Router();

router.get("/health", (req:Request,res:Response) => {
    res.json({
        success: true,
        message: "API is running"
    })
})

router.use('/users', userRouter);

export default router;
