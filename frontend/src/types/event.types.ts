export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Category {
    id: number;
    category: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Venue {
    id: number;
    venueName: string;
    venueAddress: string;
    venueCity: string;
    venueState: string;
    venueZipCode: string;
    venuePhone?: string;
    venueEmail?: string;
    venueGMapsUrl?: string;
    capacity: number;
}

export interface TicketType {
    id: number;
    ticketType: string;
    price: number;
    quota: number;
    sold?: number;
    eventId?: string;
}

export interface EventItem {
    id: string;
    eventTitle: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    eventDesc: string;
    thumbnailUrl?: string | null;
    eventTnc: string;
    lastBuyAt: string;
    status: EventStatus;
    categoryId: number;
    venueId: number;
    organizerId: string;
    category?: Category;
    venue?: Venue;
    ticketTypes?: TicketType[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface CreateTicketTypeInput {
    ticketType: string;
    price: number;
    quota: number;
}

export interface CreateEventInput {
    eventTitle: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    eventDesc: string;
    thumbnailUrl?: string;
    eventTnc: string;
    lastBuyAt: string;
    categoryId: number;
    venueId: number;
    ticketTypes: CreateTicketTypeInput[];
}

export interface UpdateEventInput {
    eventTitle?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    eventDesc?: string;
    thumbnailUrl?: string;
    eventTnc?: string;
    lastBuyAt?: string;
    categoryId?: number;
    venueId?: number;
    status?: EventStatus;
}

export interface AttendeeCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface IssuedTicketSummary {
    id: string;
    ticketCode: string;
    isUsed: boolean;
    usedAt?: string | null;
}

export interface AttendeeOrder {
    id: string;
    invoiceNumber: string;
    ticketName: string;
    ticketPrice: number;
    qtyTickets: number;
    totalPrice: number;
    finalPrice: number;
    createdAt: string;
    customer: AttendeeCustomer;
    ticketType?: TicketType;
    issuedTickets?: IssuedTicketSummary[];
}

export interface EventAttendeesResponse {
    event: {
        id: string;
        eventTitle: string;
        eventDate: string;
        status: EventStatus;
    };
    attendees: AttendeeOrder[];
}

export type SalesOrderStatus = "WAITING_PAYMENT" | "PAID" | "CANCELLED" | "CANCELLED_EXPIRED" | "REFUNDED";

export interface OrganizerSalesOrder {
    id: string;
    invoiceNumber: string;
    ticketName: string;
    ticketPrice: number;
    qtyTickets: number;
    couponCode?: string | null;
    totalPrice: number;
    totalDiscount: number;
    pointsUsed: number;
    finalPrice: number;
    status: SalesOrderStatus;
    createdAt: string;
    updatedAt: string;
    customer: AttendeeCustomer;
    event: {
        id: string;
        eventTitle: string;
        eventDate: string;
        status: string;
    };
    ticketType?: TicketType;
    payment?: {
        id: string;
        paymentMethod: string;
        paymentProof?: string | null;
        status: string;
        paidAt?: string | null;
        rejectReason?: string | null;
    } | null;
}
