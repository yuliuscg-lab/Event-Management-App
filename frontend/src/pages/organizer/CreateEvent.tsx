import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    Sparkles,
    Upload,
    Image as ImageIcon,
    X,
    CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganizerEvent, fetchCategories, fetchVenues } from "@/api/events";
import { uploadThumbnail } from "@/api/upload";
import { Category, CreateEventInput, CreateTicketTypeInput, Venue } from "@/types/event.types";
import { getErrorMessage } from "@/utils/response";

export const CreateEvent: React.FC = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [ticketTypes, setTicketTypes] = useState<CreateTicketTypeInput[]>([
        { ticketType: "General Admission", price: 50000, quota: 100 },
    ]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrorMsg("File harus berupa gambar (JPG, PNG, WEBP)!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg("Ukuran gambar maksimal 5MB!");
            return;
        }

        setErrorMsg(null);
        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);

        setIsUploadingImage(true);
        try {
            const res = await uploadThumbnail(file);
            setThumbnailUrl(res.url);
        } catch (err) {
            setErrorMsg("Gagal mengunggah gambar ke Cloudinary: " + getErrorMessage(err));
            setImagePreview(null);
            setThumbnailUrl("");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setThumbnailUrl("");
    };

    useEffect(() => {
        const loadOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const [cats, vens] = await Promise.all([
                    fetchCategories(),
                    fetchVenues(),
                ]);
                setCategories(cats);
                setVenues(vens);

                if (cats.length > 0) {
                    setCategoryId(cats[0].id);
                }
                if (vens.length > 0) {
                    setVenueId(vens[0].id);
                }
            } catch (err) {
                console.error("Gagal memuat kategori/venue:", err);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const handleAddTicketType = () => {
        setTicketTypes((prev) => [
            ...prev,
            { ticketType: `VIP Tier ${prev.length + 1}`, price: 100000, quota: 50 },
        ]);
    };

    const handleRemoveTicketType = (index: number) => {
        if (ticketTypes.length <= 1) {
            setErrorMsg("Event harus memiliki minimal 1 tipe tiket!");
            return;
        }
        setTicketTypes((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleTicketTypeChange = (index: number, field: keyof CreateTicketTypeInput, value: string | number) => {
        setTicketTypes((prev) =>
            prev.map((t, idx) => (idx === index ? { ...t, [field]: value } : t))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (isUploadingImage) {
            setErrorMsg("Mohon tunggu hingga proses unggah gambar ke Cloudinary selesai!");
            return;
        }

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

            navigate("/organizer/events", {
                state: { message: `Event "${eventTitle}" berhasil dibuat!` },
            });
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="create-event-page" className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => navigate("/organizer/events")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 w-fit cursor-pointer transition-colors mb-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Daftar Event</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 shrink-0">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Formulir Event Baru</h1>
                        <p className="text-xs md:text-sm font-medium text-slate-500 mt-0.5">
                            Lengkapi seluruh rincian informasi, jadwal, dan kuota tiket untuk mempublikasikan event Anda.
                        </p>
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5 shadow-xs">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                </div>
            )}

            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                            1. Informasi Utama Event
                        </h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                            <Input
                                type="text"
                                required
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Contoh: Jakarta International Jazz Festival 2026"
                                className="bg-white text-slate-900 border-slate-300 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
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
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                                >
                                    {venues.map((ven) => (
                                        <option key={ven.id} value={ven.id}>
                                            {ven.venueName} ({ven.venueCity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Gambar Poster / Thumbnail Event (Opsional)
                            </label>

                            {imagePreview || thumbnailUrl ? (
                                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group max-w-md">
                                    <img
                                        src={imagePreview || thumbnailUrl}
                                        alt="Thumbnail Event Preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                            className="text-xs flex items-center gap-1 cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                            Hapus Gambar
                                        </Button>
                                    </div>
                                    {isUploadingImage ? (
                                        <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-primary font-semibold text-xs">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span>Mengunggah gambar ke Cloudinary...</span>
                                        </div>
                                    ) : thumbnailUrl ? (
                                        <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Tersimpan di Cloudinary
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50/50 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors p-4 text-center group">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 group-hover:bg-primary/10 text-slate-500 group-hover:text-primary mb-2 transition-colors">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">Klik untuk memilih file gambar</span>
                                        <span className="text-[11px] text-slate-400 mt-0.5">Format JPG, PNG, atau WEBP (Maksimal 5MB)</span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        <div className="h-px bg-slate-200 flex-1" />
                                        <span>atau masukkan URL gambar secara manual</span>
                                        <div className="h-px bg-slate-200 flex-1" />
                                    </div>
                                    <Input
                                        type="url"
                                        value={thumbnailUrl}
                                        onChange={(e) => {
                                            setThumbnailUrl(e.target.value);
                                            if (e.target.value) setImagePreview(e.target.value);
                                            else setImagePreview(null);
                                        }}
                                        placeholder="https://example.com/images/poster.jpg"
                                        className="bg-white text-slate-900 border-slate-300 text-xs"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Event *</label>
                            <textarea
                                required
                                rows={4}
                                value={eventDesc}
                                onChange={(e) => setEventDesc(e.target.value)}
                                placeholder="Jelaskan secara rinci konsep event, penampilan pengisi acara, dan fasilitas..."
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                            2. Jadwal & Waktu Event
                        </h3>

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

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                3. Tipe Tiket & Kuota Penjualan
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddTicketType}
                                className="text-xs text-primary border-primary/30 hover:bg-primary/5 cursor-pointer font-semibold"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Tambah Tipe Tiket
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {ticketTypes.map((t, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center gap-3">
                                    <div className="w-full md:flex-1">
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Nama Tiket</label>
                                        <Input
                                            type="text"
                                            required
                                            value={t.ticketType}
                                            onChange={(e) => handleTicketTypeChange(idx, "ticketType", e.target.value)}
                                            placeholder="Contoh: Presale 1 / Early Bird"
                                            className="bg-white text-xs text-slate-900 border-slate-300"
                                        />
                                    </div>

                                    <div className="w-full md:w-36">
                                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Harga Tiket (IDR)</label>
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

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                            4. Syarat & Ketentuan (T&C)
                        </h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Syarat & Ketentuan Penukaran Tiket *</label>
                            <textarea
                                required
                                rows={3}
                                value={eventTnc}
                                onChange={(e) => setEventTnc(e.target.value)}
                                placeholder="Tuliskan aturan usia minimum, syarat membawa identitas fisik (KTP/Passport), dan aturan re-entry..."
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/organizer/events")}
                            className="text-slate-700 cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoadingOptions}
                            className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 px-6 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Mendaftarkan Event...</span>
                                </>
                            ) : (
                                <span>Daftarkan Event Baru</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </section>
    );
};
