export interface CreateVenueRequest {
    venueName: string;
    venueAddress: string;
    venueCity: string;
    venueState: string;
    venueZipCode: string;
    venuePhone: string;
    venueEmail: string;
    venueGMapsUrl: string;
    capacity: number;
}

export interface UpdateVenueRequest {
    venueName?: string;
    venueAddress?: string;
    venueCity?: string;
    venueState?: string;
    venueZipCode?: string;
    venuePhone?: string;
    venueEmail?: string;
    venueGMapsUrl?: string;
    capacity?: number;
}