import cron from "node-cron";
import { paymentService } from "../services/payment.service";

cron.schedule("* * * * *", ()=> {
    paymentService.cancelExpiredOrders();
})