import { addHours } from "date-fns";

export function generatePaymentExpiredAt(): Date {
    return addHours(new Date(), 1);
}