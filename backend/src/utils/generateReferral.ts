export function generateReferral(nama: string): string {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789";

    const cleanName = nama.replace(/[^a-zA-Z0-9]/g, "");
    const prefix = cleanName.slice(0, 4).toUpperCase();

    let code = prefix;

    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}