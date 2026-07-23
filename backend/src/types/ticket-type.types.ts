export interface CreateTicketTypeRequest {
    ticketType: string;
    price:number;
    quota:number;
}

export interface UpdateTicketTypeRequest {
    ticketType?: string;
    price?:number;
    quota?:number;
}