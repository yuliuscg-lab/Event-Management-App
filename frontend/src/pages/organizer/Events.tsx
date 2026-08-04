import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router";
import { Calendar, MapPin, Search, Pencil, Trash2, AlertCircle, CheckCircle2, X, Loader2, Tag, Ticket, Filter, Eye, CalendarDays, Clock, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { fetchOrganizerEvents, updateOrganizerEvent, deleteOrganizerEvent, fetchCategories, fetchVenues } from "@/api/events";
import { uploadThumbnail } from "@/api/upload";
import { Category, EventItem, EventStatus, UpdateEventInput, Venue } from "@/types/event.types";
import { getErrorMessage } from "@/utils/response";
import { formatRupiah } from "@/utils/format";

export const Events: React.FC = () => {
    const location = useLocation();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");

    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);

    const [editTitle, setEditTitle] = useState<string>("");
    const [editCategory, setEditCategory] = useState<number>(0);
    const [editVenue, setEditVenue] = useState<number>(0);
    const [editStatus, setEditStatus] = useState<EventStatus>("DRAFT");
    const [editEventDate, setEditEventDate] = useState<string>("");
    const [editStartTime, setEditStartTime] = useState<string>("");
    const [editEndTime, setEditEndTime] = useState<string>("");
    const [editLastBuyAt, setEditLastBuyAt] = useState<string>("");
    const [editThumbnail, setEditThumbnail] = useState<string>("");
    const [editDesc, setEditDesc] = useState<string>("");
    const [editTnc, setEditTnc] = useState<string>("");

    const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setEditErrorMsg("File harus berupa gambar (JPG, PNG, WEBP)!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setEditErrorMsg("Ukuran gambar maksimal 5MB!");
            return;
        }

        setEditErrorMsg(null);
        setEditSelectedFile(file);
        const localPreview = URL.createObjectURL(file);
        setEditImagePreview(localPreview);
    };

    const handleRemoveEditImage = () => {
        setEditSelectedFile(null);
        setEditImagePreview(null);
        setEditThumbnail("");
    };

    const handleOpenEdit = (eventItem: EventItem) => {
        setEditingEvent(eventItem);
        setEditErrorMsg(null);
        setEditTitle(eventItem.eventTitle);
        setEditCategory(eventItem.categoryId);
        setEditVenue(eventItem.venueId);
        setEditStatus(eventItem.status);
        setEditEventDate(toInputDate(eventItem.eventDate));
        setEditStartTime(toInputDateTimeLocal(eventItem.startTime));
        setEditEndTime(toInputDateTimeLocal(eventItem.endTime));
        setEditLastBuyAt(toInputDateTimeLocal(eventItem.lastBuyAt));
        setEditThumbnail(eventItem.thumbnailUrl || "");
        setEditImagePreview(eventItem.thumbnailUrl || null);
        setEditSelectedFile(null);
        setEditDesc(eventItem.eventDesc);
        setEditTnc(eventItem.eventTnc);
        setEditModalOpen(true);
    };
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

    const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
    const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);

    const loadInitialData = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const [eventsData, categoriesData, venuesData] = await Promise.all([
                fetchOrganizerEvents(),
                fetchCategories(),
                fetchVenues(),
            ]);
            setEvents(eventsData);
            setCategories(categoriesData);
            setVenues(venuesData);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
        }
    }, [location.state]);

    const filteredEvents = useMemo(() => {
        return events.filter((ev) => {
            const matchesSearch = 
                ev.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ev.category?.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ev.venue?.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ev.venue?.venueCity.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = selectedStatus === "ALL" || ev.status === selectedStatus;
            const matchesCategory = selectedCategoryId === "ALL" || ev.categoryId === Number(selectedCategoryId);

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [events, searchQuery, selectedStatus, selectedCategoryId]);

    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedStatus, selectedCategoryId]);

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEvents, currentPage]);

    const stats = useMemo(() => {
        const total = events.length;
        const published = events.filter(e => e.status === "PUBLISHED").length;
        const draft = events.filter(e => e.status === "DRAFT").length;
        const archived = events.filter(e => e.status === "ARCHIVED").length;
        const totalTicketsSold = events.reduce((sum, ev) => {
            const sold = ev.ticketTypes?.reduce((tSum, t) => tSum + (t.sold || 0), 0) || 0;
            return sum + sold;
        }, 0);
        return { total, published, draft, archived, totalTicketsSold };
    }, [events]);

    const toInputDateTimeLocal = (dateString?: string) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const toInputDate = (dateString?: string) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingEvent?.status === "PUBLISHED") {
            setEditErrorMsg("Event yang sudah dipublish tidak dapat diubah!");
            return;
        }

        if (editStartTime && editEndTime && new Date(editStartTime) >= new Date(editEndTime)) {
            setEditErrorMsg("Waktu mulai (Start time) harus sebelum waktu selesai (End time)");
            return;
        }

        if (editLastBuyAt && editStartTime && new Date(editLastBuyAt) >= new Date(editStartTime)) {
            setEditErrorMsg("Batas akhir pembelian (Last buy date) harus sebelum waktu mulai event");
            return;
        }

        setIsUpdating(true);
        setEditErrorMsg(null);

        try {
            let finalThumbnailUrl = editThumbnail;

            if (editSelectedFile) {
                try {
                    const uploadRes = await uploadThumbnail(editSelectedFile);
                    finalThumbnailUrl = uploadRes.url;
                } catch (uploadErr) {
                    setEditErrorMsg("Gagal mengunggah gambar ke Cloudinary: " + getErrorMessage(uploadErr));
                    setIsUpdating(false);
                    return; 
                }
            }

            const payload: UpdateEventInput = {
                eventTitle: editTitle,
                categoryId: Number(editCategory),
                venueId: Number(editVenue),
                status: editStatus,
                eventDate: editEventDate ? new Date(editEventDate).toISOString() : undefined,
                startTime: editStartTime ? new Date(editStartTime).toISOString() : undefined,
                endTime: editEndTime ? new Date(editEndTime).toISOString() : undefined,
                lastBuyAt: editLastBuyAt ? new Date(editLastBuyAt).toISOString() : undefined,
                thumbnailUrl: finalThumbnailUrl || undefined,
                eventDesc: editDesc,
                eventTnc: editTnc,
            };

            const updated = await updateOrganizerEvent(editingEvent!.id, payload);
            
            setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? { ...ev, ...updated } : ev)));
            setSuccessMsg(`Event "${editTitle}" berhasil diperbarui.`);
            setEditSelectedFile(null);
            setEditModalOpen(false);
            setEditingEvent(null);
        } catch (err) {
            setEditErrorMsg(getErrorMessage(err));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenDelete = (eventItem: EventItem) => {
        setDeletingEvent(eventItem);
        setDeleteErrorMsg(null);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingEvent) return;

        setIsDeleting(true);
        setDeleteErrorMsg(null);

        try {
            await deleteOrganizerEvent(deletingEvent.id);
            setEvents((prev) => prev.filter((ev) => ev.id !== deletingEvent.id));
            setSuccessMsg(`Event "${deletingEvent.eventTitle}" berhasil dihapus.`);
            setDeleteModalOpen(false);
            setDeletingEvent(null);
        } catch (err) {
            setDeleteErrorMsg(getErrorMessage(err));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenView = (eventItem: EventItem) => {
        setViewingEvent(eventItem);
        setViewModalOpen(true);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const formatTime = (timeStr: string) => {
        try {
            const date = new Date(timeStr);
            return date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return timeStr;
        }
    };

    const renderStatusBadge = (status: EventStatus) => {
        switch (status) {
            case "PUBLISHED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        PUBLISHED
                    </span>
                );
            case "DRAFT":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                        DRAFT
                    </span>
                );
            case "ARCHIVED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                        ARCHIVED
                    </span>
                );
            default:
                return <span className="text-xs text-slate-500">{status}</span>;
        }
    };

    return (
        <section id="portal-events" className="flex flex-col gap-6 max-w-7xl mx-auto">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Event Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Kelola dan tinjau daftar event milik Anda, lakukan pembaruan detail, atau nonaktifkan event.
                    </p>
                </div>
            </div>

            {}
            {successMsg && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-sm transition-all">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                    <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {errorMsg && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm shadow-sm transition-all">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                    <button onClick={() => setErrorMsg(null)} className="text-rose-600 hover:text-rose-800 cursor-pointer">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Event</p>
                        <p className="flex justify-center text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
                        <p className="flex justify-center text-2xl font-bold text-emerald-600 mt-0.5">{stats.published}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Tag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Draft</p>
                        <p className="flex justify-center text-2xl font-bold text-amber-600 mt-0.5">{stats.draft}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Ticket className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiket Terjual</p>
                        <p className="flex justify-center text-2xl font-bold text-blue-600 mt-0.5">{stats.totalTicketsSold}</p>
                    </div>
                </Card>
            </div>

            {}
            <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari event, venue, kota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white text-sm rounded-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter:</span>
                        </div>

                        {}
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="ALL">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.category}
                                </option>
                            ))}
                        </select>

                        {}
                        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200/80">
                            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => {
                                const isActive = selectedStatus === status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-white text-slate-900 shadow-xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {status === "ALL" ? "Semua Status" : status}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {}
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Kategori & Venue</th>
                                <th className="px-6 py-4">Tanggal & Waktu</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Penjualan Tiket</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
                                                <div className="flex flex-col gap-1.5 w-40">
                                                    <div className="h-4 bg-slate-200 rounded w-full" />
                                                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-28 mb-1" />
                                            <div className="h-3 bg-slate-100 rounded w-20" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
                                            <div className="h-3 bg-slate-100 rounded w-16" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 bg-slate-200 rounded-full w-20" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 rounded w-16" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="h-8 bg-slate-200 rounded w-16 ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-1">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <p className="font-semibold text-slate-800 text-base">Tidak ada event ditemukan</p>
                                            <p className="text-xs text-slate-500 max-w-sm">
                                                {searchQuery || selectedStatus !== "ALL" || selectedCategoryId !== "ALL"
                                                    ? "Coba ubah kata kunci pencarian atau sesuaikan filter status dan kategori."
                                                    : "Anda belum memiliki event yang terdaftar."}
                                            </p>
                                            {(searchQuery || selectedStatus !== "ALL" || selectedCategoryId !== "ALL") && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setSelectedStatus("ALL");
                                                        setSelectedCategoryId("ALL");
                                                    }}
                                                    className="mt-3 text-xs"
                                                >
                                                    Reset Filter
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedEvents.map((ev) => {
                                    const totalSold = ev.ticketTypes?.reduce((acc, t) => acc + (t.sold || 0), 0) || 0;
                                    const totalQuota = ev.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;

                                    return (
                                        <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors group">
                                            {}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner">
                                                        {ev.thumbnailUrl ? (
                                                            <img
                                                                src={ev.thumbnailUrl}
                                                                alt={ev.eventTitle}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                                                                {ev.eventTitle.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-semibold text-slate-900 text-sm truncate max-w-xs group-hover:text-primary transition-colors">
                                                            {ev.eventTitle}
                                                        </span>
                                                        <span className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                                                            {ev.eventDesc}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center w-fit text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                        {ev.category?.category || "Umum"}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                                                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-40">
                                                            {ev.venue?.venueName || "Online"} ({ev.venue?.venueCity || "-"})
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                                                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>{formatDate(ev.eventDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Clock className="h-3 w-3 text-slate-400" />
                                                        <span>
                                                            {formatTime(ev.startTime)} - {formatTime(ev.endTime)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {}
                                            <td className="px-6 py-4">{renderStatusBadge(ev.status)}</td>

                                            {}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {totalSold} <span className="font-normal text-slate-500">/ {totalQuota} tiket</span>
                                                    </span>
                                                    {totalQuota > 0 && (
                                                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="bg-primary h-full rounded-full transition-all"
                                                                style={{ width: `${Math.min(100, Math.round((totalSold / totalQuota) * 100))}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Lihat Detail Event"
                                                        onClick={() => handleOpenView(ev)}
                                                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={ev.status === "PUBLISHED" ? "Event yang sudah dipublish tidak dapat diubah" : "Edit Event"}
                                                        onClick={() => handleOpenEdit(ev)}
                                                        disabled={ev.status === "PUBLISHED"}
                                                        className={`h-8 w-8 ${
                                                            ev.status === "PUBLISHED"
                                                                ? "text-slate-300 cursor-not-allowed opacity-50"
                                                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                                        }`}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Hapus Event (Soft Delete)"
                                                        onClick={() => handleOpenDelete(ev)}
                                                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {}
                {filteredEvents.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200/80 bg-slate-50/50">
                        <div className="text-xs text-slate-500 font-medium">
                            Menampilkan <strong className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> - <strong className="text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)}</strong> dari <strong className="text-slate-900">{filteredEvents.length}</strong> event
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className="h-8 text-xs font-semibold px-2.5 text-slate-700 cursor-pointer disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Sebelumnya
                            </Button>

                            <div className="flex items-center gap-1 px-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const isActive = currentPage === page;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-8 w-8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                isActive
                                                    ? "bg-primary text-white shadow-xs"
                                                    : "text-slate-600 hover:bg-slate-200/60"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className="h-8 text-xs font-semibold px-2.5 text-slate-700 cursor-pointer disabled:opacity-50"
                            >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {}
            {editModalOpen && editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        {}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Pencil className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Edit Event</h3>
                                    <p className="text-xs text-slate-500">Perbarui detail dan konfigurasi event milik Anda.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {}
                        <form onSubmit={handleUpdateSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 gap-4">
                            {editingEvent?.status === "PUBLISHED" && (
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                    <span>Event yang sudah dipublish tidak dapat diubah (sesuai aturan sistem).</span>
                                </div>
                            )}

                            {editErrorMsg && (
                                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                                    <span>{editErrorMsg}</span>
                                </div>
                            )}

                            {}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Event *</label>
                                <Input
                                    type="text"
                                    required
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="bg-white text-slate-900 border-slate-300 text-sm"
                                    placeholder="Masukkan judul event..."
                                />
                            </div>

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                                    <select
                                        required
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(Number(e.target.value))}
                                        className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    >
                                        <option value={0} disabled>Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                                    <select
                                        required
                                        value={editVenue}
                                        onChange={(e) => setEditVenue(Number(e.target.value))}
                                        className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    >
                                        <option value={0} disabled>Pilih Venue</option>
                                        {venues.map((ven) => (
                                            <option key={ven.id} value={ven.id}>
                                                {ven.venueName} ({ven.venueCity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Status Event *</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as EventStatus)}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    <option value="DRAFT">DRAFT - Hanya tersimpan sebagai draf</option>
                                    <option value="PUBLISHED">PUBLISHED - Tampil di katalog publik</option>
                                    <option value="ARCHIVED">ARCHIVED - Diarsipkan</option>
                                </select>
                            </div>

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Event *</label>
                                    <Input
                                        type="date"
                                        required
                                        value={editEventDate}
                                        onChange={(e) => setEditEventDate(e.target.value)}
                                        className="bg-white text-slate-900 border-slate-300 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Batas Akhir Pembelian Tiket *</label>
                                    <Input
                                        type="datetime-local"
                                        required
                                        value={editLastBuyAt}
                                        onChange={(e) => setEditLastBuyAt(e.target.value)}
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
                                        value={editStartTime}
                                        onChange={(e) => setEditStartTime(e.target.value)}
                                        className="bg-white text-slate-900 border-slate-300 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Selesai *</label>
                                    <Input
                                        type="datetime-local"
                                        required
                                        value={editEndTime}
                                        onChange={(e) => setEditEndTime(e.target.value)}
                                        className="bg-white text-slate-900 border-slate-300 text-sm"
                                    />
                                </div>
                            </div>

                            {}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700">Thumbnail Gambar Event</label>

                                {editImagePreview || editThumbnail ? (
                                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative w-20 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                                                <img
                                                    src={editImagePreview || editThumbnail}
                                                    alt="Thumbnail Event"
                                                    className="w-full h-full object-cover"
                                                />
                                                {isUpdating && editSelectedFile && (
                                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 truncate">
                                                    {editSelectedFile ? "Gambar baru dipilih (siap diunggah)" : "Gambar Saat Ini"}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate max-w-45 sm:max-w-[260px]">
                                                    {editSelectedFile ? editSelectedFile.name : (editThumbnail || editImagePreview)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <label className="cursor-pointer">
                                                <span className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1">
                                                    <Upload className="w-3.5 h-3.5" /> Ganti
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleEditFileSelect}
                                                    disabled={isUpdating}
                                                    className="hidden"
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleRemoveEditImage}
                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                                                title="Hapus Gambar"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-300 hover:border-primary/50 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-all">
                                        <label className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                                            <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">
                                                    Klik untuk unggah gambar baru
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    PNG, JPG, WEBP hingga 5MB (diunggah ke Cloudinary saat disimpan)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditFileSelect}
                                                disabled={isUpdating}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                )}

                                <Input
                                    type="url"
                                    value={editThumbnail}
                                    onChange={(e) => {
                                        setEditThumbnail(e.target.value);
                                        setEditImagePreview(e.target.value || null);
                                        setEditSelectedFile(null);
                                    }}
                                    placeholder="Atau masukkan URL gambar langsung (https://...)"
                                    className="bg-white text-slate-900 border-slate-300 text-xs h-8"
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Event *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-2.5 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Jelaskan detail rincian event..."
                                />
                            </div>

                            {}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Syarat & Ketentuan (T&C) *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editTnc}
                                    onChange={(e) => setEditTnc(e.target.value)}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-md p-2.5 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Ketentuan kehadiran, pengembalian uang, dll..."
                                />
                            </div>

                            {}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditModalOpen(false)}
                                    className="text-slate-600 cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating || editingEvent?.status === "PUBLISHED"}
                                    className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{editSelectedFile ? "Mengunggah & Menyimpan..." : "Menyimpan..."}</span>
                                        </>
                                    ) : (
                                        <span>Simpan Perubahan</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {}
            {deleteModalOpen && deletingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                <Trash2 className="h-7 w-7" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Hapus Event ini?</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Event akan dihapus secara lunak (soft-delete) dari sistem.
                                </p>
                            </div>

                            {deleteErrorMsg && (
                                <div className="w-full p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                                    <span>{deleteErrorMsg}</span>
                                </div>
                            )}

                            <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-slate-200 shrink-0 overflow-hidden">
                                    {deletingEvent.thumbnailUrl ? (
                                        <img src={deletingEvent.thumbnailUrl} alt={deletingEvent.eventTitle} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-600">
                                            {deletingEvent.eventTitle.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                        {deletingEvent.eventTitle}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {deletingEvent.category?.category || "Event"} &bull; {formatDate(deletingEvent.eventDate)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3 w-full mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 text-slate-700 cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={handleConfirmDelete}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Menghapus...</span>
                                        </>
                                    ) : (
                                        <span>Ya, Hapus Event</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            {viewModalOpen && viewingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                        {}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-slate-900">Detail Event</h3>
                            </div>
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {}
                        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-700 text-sm">
                            {viewingEvent.thumbnailUrl && (
                                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={viewingEvent.thumbnailUrl} alt={viewingEvent.eventTitle} className="h-full w-full object-cover" />
                                </div>
                            )}

                            <div>
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                                    {viewingEvent.category?.category || "Umum"}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 mt-2">{viewingEvent.eventTitle}</h2>
                                <div className="mt-1">{renderStatusBadge(viewingEvent.status)}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                <div>
                                    <span className="text-slate-400 font-medium block">Tanggal Event</span>
                                    <span className="font-semibold text-slate-800">{formatDate(viewingEvent.eventDate)}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium block">Jam Operasional</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatTime(viewingEvent.startTime)} - {formatTime(viewingEvent.endTime)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium block">Lokasi / Venue</span>
                                    <span className="font-semibold text-slate-800">
                                        {viewingEvent.venue?.venueName} ({viewingEvent.venue?.venueCity})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium block">Batas Pembelian</span>
                                    <span className="font-semibold text-slate-800">{formatDate(viewingEvent.lastBuyAt)}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Deskripsi</h4>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">{viewingEvent.eventDesc}</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Syarat & Ketentuan</h4>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">{viewingEvent.eventTnc}</p>
                            </div>

                            {}
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Tipe Tiket</h4>
                                <div className="flex flex-col gap-2">
                                    {viewingEvent.ticketTypes && viewingEvent.ticketTypes.length > 0 ? (
                                        viewingEvent.ticketTypes.map((tt) => (
                                            <div key={tt.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-xs">
                                                <div>
                                                    <span className="font-bold text-slate-900 block">{tt.ticketType}</span>
                                                    <span className="text-slate-500">{formatRupiah(tt.price)}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold text-slate-800">
                                                        {tt.sold || 0} / {tt.quota} Terjual
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">Belum ada tipe tiket terdaftar.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="p-4 border-t border-slate-100 flex justify-end">
                            <Button variant="outline" onClick={() => setViewModalOpen(false)} className="text-xs">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};