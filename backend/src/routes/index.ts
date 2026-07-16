import { Request, Response, Router } from 'express';
import userRouter from './user.route';
import { success } from '../utils/response';
import authRouter from "./auth.route";

const router = Router();

router.get("/health", (req:Request,res:Response) => {
    return success(res, 200, "API is running");
})

router.use('/users', userRouter);
router.use("/auth", authRouter);

export default router;
