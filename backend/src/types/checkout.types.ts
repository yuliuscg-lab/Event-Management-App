import { PaymentMethod } from "@prisma/client";
import { PointValidationResult } from "../services/point.service";

export interface CheckoutOrder {
    eventId:string;
    ticketTypeId:number;
    qtyTickets:number;
    couponCode?:string;
    usePoint:boolean;
    paymentMethod: PaymentMethod;
}

export interface CreateSalesOrderItem {
    ticketTypeId:number;
    qty:number;
    price:number;
    subtotal:number;
    discountAmount:number;
    notes?:string;
}

export interface CheckoutCalculation {
    subtotal: number;
    couponId?: number;
    couponCode?: string;
    couponDiscount: number;
    pointUsed: number;
    finalPrice: number;
    pointValidation: PointValidationResult;
}