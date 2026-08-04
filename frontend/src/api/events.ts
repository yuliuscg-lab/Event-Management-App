import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/auth.types";
import { Category, CreateEventInput, EventItem, UpdateEventInput, Venue } from "@/types/event.types";

export async function fetchOrganizerEvents(): Promise<EventItem[]> {
    const response = await api.get<ApiResponse<EventItem[]>>("/events");
    return response.data.data ?? [];
}

export async function fetchPublicEvents(): Promise<EventItem[]> {
    const response = await api.get<ApiResponse<EventItem[]>>("/public/events");
    return response.data.data ?? [];
}

export async function fetchPublicEventById(id: string): Promise<EventItem> {
    const response = await api.get<ApiResponse<EventItem>>(`/public/events/${id}`);
    return response.data.data!;
}

export interface CheckoutPayload {
    eventId: string;
    ticketTypeId: number;
    qtyTickets: number;
    couponCode?: string;
    usePoint?: boolean;
    paymentMethod: string;
}

export interface CalculatePayload {
    eventId: string;
    ticketTypeId: number;
    qtyTickets: number;
    couponCode?: string;
    usePoint?: boolean;
}

export interface CalculationResult {
    subtotal: number;
    couponId?: number;
    couponCode?: string;
    couponDiscount: number;
    pointUsed: number;
    finalPrice: number;
}

export async function calculateCheckout(payload: CalculatePayload): Promise<CalculationResult> {
    const response = await api.post<ApiResponse<CalculationResult>>("/sales-orders/calculate", payload);
    return response.data.data!;
}

export async function checkoutEvent(payload: CheckoutPayload): Promise<any> {
    const response = await api.post<ApiResponse<any>>("/sales-orders/checkout", payload);
    return response.data.data;
}

export async function createOrganizerEvent(payload: CreateEventInput): Promise<EventItem> {
    const response = await api.post<ApiResponse<EventItem>>("/events", payload);
    return response.data.data!;
}

export async function updateOrganizerEvent(id: string, payload: UpdateEventInput): Promise<EventItem> {
    const response = await api.patch<ApiResponse<EventItem>>(`/events/${id}`, payload);
    return response.data.data!;
}

export async function deleteOrganizerEvent(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/events/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data.data ?? [];
}

export async function fetchVenues(): Promise<Venue[]> {
    const response = await api.get<ApiResponse<Venue[]>>("/venues");
    return response.data.data ?? [];
}

export async function fetchEventAttendees(eventId: string) {
    const response = await api.get<ApiResponse<{ event: { id: string; eventTitle: string; eventDate: string; status: string }; attendees: any[] }>>(`/events/${eventId}/attendees`);
    return response.data.data!;
}

export async function fetchOrganizerSalesOrders() {
    const response = await api.get<ApiResponse<any[]>>("/sales-orders/organizer");
    return response.data.data ?? [];
}
