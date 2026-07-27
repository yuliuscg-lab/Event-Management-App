import crypto from "crypto";
export function generateInvoiceNumber():string {
    const now = new Date();

    const date = now.getFullYear().toString() + 
    String(now.getMonth() + 1).padStart(2,"0") + 
    String(now.getDate()).padStart(2,"0");

    const random = crypto
        .randomUUID()
        .replace(/-/g, "")
        .substring(0,6)
        .toUpperCase();

    return `SO-${date}-${random}`;
}