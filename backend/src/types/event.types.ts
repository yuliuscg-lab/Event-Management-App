import { EventStatus } from "@prisma/client";
import { CreateTicketTypeRequest } from "./ticket-type.types";

export interface CreateEventRequest {
    eventTitle: string;
    eventDate: Date;
    startTime: Date;
    endTime: Date;
    eventDesc: string;
    thumbnailUrl?: string;
    eventTnc: string;
    lastBuyAt: Date;
    categoryId: number;
    venueId: number;
    ticketTypes: CreateTicketTypeRequest[];
}

export interface UpdateEventRequest {
    eventTitle?: string;
    eventDate?: Date;
    startTime?: Date;
    endTime?: Date;
    eventDesc?: string;
    thumbnailUrl?: string;
    eventTnc?: string;
    lastBuyAt?: Date;
    categoryId?: number;
    venueId?: number;
    status?: EventStatus;
}