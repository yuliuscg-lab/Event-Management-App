import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/auth.types";

export interface PaymentItem {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentProof?: string | null;
    status: "WAITING_UPLOAD" | "WAITING_VERIFICATION" | "VERIFIED" | "REJECTED" | "EXPIRED";
    expiredAt: string;
    paidAt?: string | null;
    rejectReason?: string | null;
}

export interface IssuedTicket {
    id: string;
    ticketCode: string;
    isUsed: boolean;
    usedAt?: string | null;
    ticketName: string;
    ticketPrice: number;
    createdAt: string;
}

export interface OrderItem {
    id: string;
    invoiceNumber: string;
    eventId: string;
    ticketTypeId: number;
    ticketName: string;
    ticketPrice: number;
    qtyTickets: number;
    totalPrice: number;
    couponDiscount: number;
    pointsUsed: number;
    finalPrice: number;
    status: "WAITING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED";
    createdAt: string;
    event?: {
        id: string;
        eventTitle: string;
        eventDate: string;
        startTime?: string;
        endTime?: string;
        thumbnailUrl?: string;
        venue?: {
            venueName?: string;
            venueAddress?: string;
            venueCity?: string;
        };
    };
    payment?: PaymentItem;
    issuedTickets?: IssuedTicket[];
}

export async function fetchMyOrders(): Promise<OrderItem[]> {
    const response = await api.get<ApiResponse<OrderItem[]>>("/sales-orders/my");
    return response.data.data ?? [];
}

export async function fetchOrderById(id: string): Promise<OrderItem> {
    const response = await api.get<ApiResponse<OrderItem>>(`/sales-orders/${id}`);
    return response.data.data!;
}

export async function submitPaymentProof(paymentId: string, paymentProofUrl: string): Promise<any> {
    const response = await api.post<ApiResponse<any>>("/payments/upload-proof", {
        paymentId,
        paymentProof: paymentProofUrl,
    });
    return response.data.data;
}

export async function verifyPayment(paymentId: string): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/payments/${paymentId}/verify`);
    return response.data.data;
}

export async function rejectPayment(paymentId: string, reason?: string): Promise<any> {
    const response = await api.post<ApiResponse<any>>(`/payments/${paymentId}/reject`, { reason });
    return response.data.data;
}
