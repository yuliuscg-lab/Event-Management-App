
export function formatRupiah(value:number):string {
    return new Intl.NumberFormat("id-ID",{
        style:"currency",
        currency:"IDR",
        minimumFractionDigits:0,
        maximumFractionDigits:0,
    }).format(value);
}

export function formatDate(dateString: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

export function formatTime(timeString?: string): string {
    if (!timeString) return "";

    if (timeString.includes("T")) {
        const timePart = timeString.split("T")[1];
        if (timePart) {
            return timePart.slice(0, 5); 
        }
    }

    if (timeString.includes(":")) {
        const parts = timeString.split(":");
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
        }
    }

    return timeString;
}

export function formatEventDateTime(dateString: string, startTime?: string, endTime?: string): string {
    const formattedDate = formatDate(dateString);
    const start = formatTime(startTime);
    const end = formatTime(endTime);

    if (!start) return formattedDate;

    if (end) {
        return `${formattedDate}, ${start} - ${end}`;
    }

    return `${formattedDate}, ${start}`;
}