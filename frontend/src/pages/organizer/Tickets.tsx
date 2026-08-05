import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Ticket, 
    Users, 
    Search, 
    Calendar, 
    AlertCircle, 
    Loader2, 
    Filter,
    ShoppingBag,
    CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchOrganizerEvents, fetchEventAttendees } from "@/api/events";
import { AttendeeOrder, EventItem } from "@/types/event.types";
import { getErrorMessage } from "@/utils/response";

export const Tickets: React.FC = () => {
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const {
        data: publishedEvents = [],
        isLoading: isLoadingEvents,
        isError: isEventsError,
        error: eventsError,
    } = useQuery<EventItem[]>({
        queryKey: ["organizer-published-events"],
        queryFn: async () => {
            const events = await fetchOrganizerEvents();
            const published = events.filter((e) => e.status === "PUBLISHED");
            
            if (published.length > 0 && !selectedEventId) {
                setSelectedEventId(published[0].id);
            }
            return published;
        },
    });

    const {
        data: attendees = [],
        isLoading: isLoadingAttendees,
        isError: isAttendeesError,
        error: attendeesError,
    } = useQuery<AttendeeOrder[]>({
        queryKey: ["event-attendees", selectedEventId],
        queryFn: async () => {
            if (!selectedEventId) return [];
            const res = await fetchEventAttendees(selectedEventId);
            return res.attendees || [];
        },
        enabled: !!selectedEventId,
    });

    const selectedEvent = useMemo(() => {
        return publishedEvents.find((e) => e.id === selectedEventId);
    }, [publishedEvents, selectedEventId]);

    const filteredAttendees = useMemo(() => {
        return attendees.filter((att) => {
            const name = att.customer?.name || "";
            const email = att.customer?.email || "";
            const invoice = att.invoiceNumber || "";
            const ticket = att.ticketName || "";

            const query = searchQuery.toLowerCase();
            return (
                name.toLowerCase().includes(query) ||
                email.toLowerCase().includes(query) ||
                invoice.toLowerCase().includes(query) ||
                ticket.toLowerCase().includes(query)
            );
        });
    }, [attendees, searchQuery]);

    const totalBuyers = attendees.length;
    const totalTicketsSold = attendees.reduce((sum, item) => sum + item.qtyTickets, 0);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    const errorMsg = isEventsError 
        ? getErrorMessage(eventsError) 
        : isAttendeesError 
        ? getErrorMessage(attendeesError) 
        : null;

    return (
        <section id="organizer-tickets" className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daftar Peserta Event</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Lihat informasi pembeli dan jumlah tiket yang telah dibeli untuk event yang berstatus Published.
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {isLoadingEvents ? (
                <Card className="p-8 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center gap-3 text-slate-500 text-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Memuat daftar event published...</span>
                </Card>
            ) : publishedEvents.length === 0 ? (
                <Card className="p-10 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Calendar className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Tidak ada Event Published</h3>
                    <p className="text-xs text-slate-500 max-w-md">
                        Daftar peserta hanya menampilkan event yang statusnya sudah **PUBLISHED**. Silakan publish event Anda di menu Events terlebih dahulu.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <Card className="lg:col-span-6 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col justify-center gap-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <Filter className="h-3.5 w-3.5 text-primary" />
                                Pilih Event Published
                            </label>
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                {publishedEvents.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.eventTitle} ({ev.venue?.venueCity || "Online"})
                                    </option>
                                ))}
                            </select>
                        </Card>

                        <Card className="lg:col-span-3 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pembeli</p>
                                <p className="flex justify-center text-2xl font-bold text-slate-900 mt-0.5">{totalBuyers}</p>
                            </div>
                        </Card>

                        <Card className="lg:col-span-3 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Ticket className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiket Terjual</p>
                                <p className="flex justify-center text-2xl font-bold text-emerald-600 mt-0.5">{totalTicketsSold}</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama pembeli, email, invoice..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-50/50 border-slate-200 text-sm rounded-lg"
                            />
                        </div>

                        {selectedEvent && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Menampilkan peserta untuk: <strong className="text-slate-800">{selectedEvent.eventTitle}</strong></span>
                            </div>
                        )}
                    </Card>

                    <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 w-12">No</th>
                                        <th className="px-6 py-4">Nama Pembeli</th>
                                        <th className="px-6 py-4">Email / Kontak</th>
                                        <th className="px-6 py-4">Tipe Tiket</th>
                                        <th className="px-6 py-4 text-center">Jumlah Tiket</th>
                                        <th className="px-6 py-4">Tanggal Pembelian</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                    {isLoadingAttendees ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    <span>Memuat data peserta...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredAttendees.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <ShoppingBag className="h-8 w-8 text-slate-300 mb-1" />
                                                    <p className="font-semibold text-slate-700">Belum ada pembeli tiket</p>
                                                    <p className="text-xs text-slate-400">
                                                        {searchQuery ? "Tidak ditemukan pembeli yang cocok dengan kata kunci." : "Belum ada transaksi tiket yang lunas untuk event ini."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAttendees.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 text-xs font-medium text-slate-400">{idx + 1}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-900">
                                                    {item.customer?.name || "Konsumen"}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-xs">
                                                    <div>{item.customer?.email || "-"}</div>
                                                    {item.customer?.phone && (
                                                        <div className="text-slate-400 mt-0.5">{item.customer.phone}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                        {item.ticketName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center h-7 w-9 font-bold text-xs bg-slate-100 text-slate-800 rounded-lg">
                                                        {item.qtyTickets}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}
        </section>
    );
};
