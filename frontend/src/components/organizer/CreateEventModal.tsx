import React, { useEffect, useState } from "react";
import { 
    X, 
    Plus, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganizerEvent, fetchCategories, fetchVenues } from "@/api/events";
import { Category, CreateEventInput, CreateTicketTypeInput, Venue } from "@/types/event.types";
import { getErrorMessage } from "@/utils/response";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Form fields
    const [eventTitle, setEventTitle] = useState<string>("");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [venueId, setVenueId] = useState<number>(0);
    const [eventDate, setEventDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [lastBuyAt, setLastBuyAt] = useState<string>("");
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
    const [eventDesc, setEventDesc] = useState<string>("");
    const [eventTnc, setEventTnc] = useState<string>("");

    // Dynamic Ticket Types
    const [ticketTypes, setTicketTypes] = useState<CreateTicketTypeInput[]>([
        { ticketType: "General Admission", price: 50000, quota: 100 },
    ]);

    // Load categories & venues on mount/open
    useEffect(() => {
        if (!isOpen) return;

        const loadOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const [cats, vens] = await Promise.all([
                    fetchCategories(),
                    fetchVenues(),
                ]);
                setCategories(cats);
                setVenues(vens);

                if (cats.length > 0 && categoryId === 0) {
                    setCategoryId(cats[0].id);
                }
                if (vens.length > 0 && venueId === 0) {
                    setVenueId(vens[0].id);
                }
            } catch (err) {
                console.error("Gagal memuat kategori/venue:", err);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        loadOptions();
    }, [isOpen]);

    // Add Ticket Type
    const handleAddTicketType = () => {
        setTicketTypes((prev) => [
            ...prev,
            { ticketType: `VIP Tier ${prev.length + 1}`, price: 100000, quota: 50 },
        ]);
    };

    // Remove Ticket Type
    const handleRemoveTicketType = (index: number) => {
        if (ticketTypes.length <= 1) {
            setErrorMsg("Event harus memiliki minimal 1 tipe tiket!");
            return;
        }
        setTicketTypes((prev) => prev.filter((_, idx) => idx !== index));
    };

    // Update Ticket Type field
    const handleTicketTypeChange = (index: number, field: keyof CreateTicketTypeInput, value: string | number) => {
        setTicketTypes((prev) =>
            prev.map((t, idx) => (idx === index ? { ...t, [field]: value } : t))
        );
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // Client-side validations
        if (!eventTitle.trim()) {
            setErrorMsg("Judul event tidak boleh kosong!");
            return;
        }
        if (categoryId === 0) {
            setErrorMsg("Silakan pilih kategori event!");
            return;
        }
        if (venueId === 0) {
            setErrorMsg("Silakan pilih venue event!");
            return;
        }
        if (!eventDate || !startTime || !endTime || !lastBuyAt) {
            setErrorMsg("Semua field tanggal dan waktu wajib diisi!");
            return;
        }
        if (ticketTypes.length === 0) {
            setErrorMsg("Event harus memiliki minimal 1 tipe tiket!");
            return;
        }

        for (const t of ticketTypes) {
            if (!t.ticketType.trim()) {
                setErrorMsg("Nama tipe tiket tidak boleh kosong!");
                return;
            }
            if (t.price < 0) {
                setErrorMsg("Harga tiket tidak boleh negatif!");
                return;
            }
            if (t.quota <= 0) {
                setErrorMsg("Kuota tiket minimal 1!");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const payload: CreateEventInput = {
                eventTitle: eventTitle.trim(),
                categoryId: Number(categoryId),
                venueId: Number(venueId),
                eventDate: new Date(eventDate).toISOString(),
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                lastBuyAt: new Date(lastBuyAt).toISOString(),
                thumbnailUrl: thumbnailUrl.trim() || undefined,
                eventDesc: eventDesc.trim(),
                eventTnc: eventTnc.trim(),
                ticketTypes: ticketTypes.map((t) => ({
                    ticketType: t.ticketType.trim(),
                    price: Number(t.price),
                    quota: Number(t.quota),
                })),
            };

            await createOrganizerEvent(payload);

            // Trigger global event notification for auto-refetching
            window.dispatchEvent(new Event("event-created"));
            onSuccess?.();
            onClose();

            // Reset form
            setEventTitle("");
            setEventDesc("");
            setEventTnc("");
            setThumbnailUrl("");
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">Buat Event Baru</h3>
                            <p className="text-xs text-slate-500">Lengkapi formulir registrasi event untuk dipublikasikan ke aplikasi.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body / Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-xs">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Section 1: Informasi Utama Event */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                            1. Informasi Utama Event
                        </h4>

                        {/* Judul Event */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                            <Input
                                type="text"
                                required
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Contoh: Concert Music Fest 2026"
                                className="bg-white text-slate-900 border-slate-300 text-sm"
                            />
                        </div>

                        {/* Kategori & Venue */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Lokasi *</label>
                                <select
                                    required
                                    value={venueId}
                                    onChange={(e) => setVenueId(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    {venues.map((ven) => (
                                        <option key={ven.id} value={ven.id}>
                                            {ven.venueName} ({ven.venueCity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Thumbnail URL */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Poster / Thumbnail (Opsional)</label>
                            <Input
                                type="url"
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="https://example.com/poster.jpg"
                                className="bg-white text-slate-900 border-slate-300 text-sm"
                            />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Event *</label>
                            <textarea
                                required
                                rows={3}
                                value={eventDesc}
                                onChange={(e) => setEventDesc(e.target.value)}
                                placeholder="Jelaskan secara rinci event yang akan diselenggarakan..."
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-2.5 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Section 2: Jadwal & Tanggal */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                            2. Jadwal & Waktu Event
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Event *</label>
                                <Input
                                    type="date"
                                    required
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="bg-white text-slate-900 border-slate-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Batas Akhir Pembelian Tiket *</label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={lastBuyAt}
                                    onChange={(e) => setLastBuyAt(e.target.value)}
                                    className="bg-white text-slate-900 border-slate-300 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Mulai *</label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="bg-white text-slate-900 border-slate-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Selesai *</label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="bg-white text-slate-900 border-slate-300 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Tipe Tiket & Kuota */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                3. Tipe Tiket & Kuota Penjualan
                            </h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddTicketType}
                                className="text-xs text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Tambah Tipe Tiket
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {ticketTypes.map((t, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center gap-3">
                                    <div className="w-full md:flex-1">
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Nama Tiket</label>
                                        <Input
                                            type="text"
                                            required
                                            value={t.ticketType}
                                            onChange={(e) => handleTicketTypeChange(idx, "ticketType", e.target.value)}
                                            placeholder="Contoh: VIP / Presale 1"
                                            className="bg-white text-xs text-slate-900 border-slate-300"
                                        />
                                    </div>

                                    <div className="w-full md:w-36">
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Harga (IDR)</label>
                                        <Input
                                            type="number"
                                            required
                                            min={0}
                                            value={t.price}
                                            onChange={(e) => handleTicketTypeChange(idx, "price", Number(e.target.value))}
                                            className="bg-white text-xs text-slate-900 border-slate-300"
                                        />
                                    </div>

                                    <div className="w-full md:w-28">
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Kuota Tiket</label>
                                        <Input
                                            type="number"
                                            required
                                            min={1}
                                            value={t.quota}
                                            onChange={(e) => handleTicketTypeChange(idx, "quota", Number(e.target.value))}
                                            className="bg-white text-xs text-slate-900 border-slate-300"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Hapus Tipe Tiket"
                                        onClick={() => handleRemoveTicketType(idx)}
                                        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 self-end md:self-center cursor-pointer mt-2 md:mt-4"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Syarat & Ketentuan */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                            4. Syarat & Ketentuan (T&C)
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Syarat & Ketentuan Penukaran Tiket *</label>
                            <textarea
                                required
                                rows={2}
                                value={eventTnc}
                                onChange={(e) => setEventTnc(e.target.value)}
                                placeholder="Tuliskan syarat usia, dokumen penukaran, atau ketentuan lain..."
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-2.5 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="text-slate-600 cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoadingOptions}
                            className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Mendaftarkan Event...</span>
                                </>
                            ) : (
                                <span>Daftarkan Event</span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
