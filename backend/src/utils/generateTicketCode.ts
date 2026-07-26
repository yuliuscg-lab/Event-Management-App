import crypto from "crypto";

export function generateTicketCode():string {
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();

    return `TIX-${random}`;
}