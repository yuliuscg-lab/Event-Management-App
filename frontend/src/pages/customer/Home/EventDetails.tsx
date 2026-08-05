import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    ArrowLeft, Calendar, MapPin, Ticket,
    Plus, Minus, Loader2, AlertCircle, CheckCircle2, Sparkles,
} from "lucide-react";
import { fetchPublicEventById, checkoutEvent, calculateCheckout } from "@/api/events";
import { TicketType } from "@/types/event.types";
import { formatRupiah, formatEventDateTime } from "@/utils/format";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/response";

export const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [qty, setQty] = useState<number>(1);
    const [couponInput, setCouponInput] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<string>("");
    const [couponError, setCouponError] = useState<string | null>(null);
    const [usePoint, setUsePoint] = useState<boolean>(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

    const {
        data: event,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["event-detail", id],
        queryFn: async () => {
            if (!id) throw new Error("ID Event tidak ditemukan");
            const data = await fetchPublicEventById(id);
            if (data.ticketTypes && data.ticketTypes.length > 0 && !selectedTicket) {
                setSelectedTicket(data.ticketTypes[0]);
            }
            return data;
        },
        enabled: !!id,
    });

    const shouldCalculate =
        !!event &&
        !!selectedTicket &&
        isAuthenticated &&
        (usePoint || !!appliedCoupon.trim());

    const {
        data: calculation,
        isFetching: isCalculating,
    } = useQuery({
        queryKey: [
            "calculate-checkout",
            event?.id,
            selectedTicket?.id,
            qty,
            appliedCoupon,
            usePoint,
        ],
        queryFn: async () => {
            try {
                const res = await calculateCheckout({
                    eventId: event!.id,
                    ticketTypeId: selectedTicket!.id,
                    qtyTickets: qty,
                    couponCode: appliedCoupon.trim() || undefined,
                    usePoint: usePoint,
                });
                setCouponError(null);
                return res;
            } catch (err: any) {
                if (appliedCoupon) {
                    setCouponError(getErrorMessage(err, "Kode kupon tidak valid."));
                    setAppliedCoupon("");
                }
                throw err;
            }
        },
        enabled: shouldCalculate, // Hanya fetch kalkulasi jika syarat terpenuhi
    });

    const checkoutMutation = useMutation({
        mutationFn: checkoutEvent,
        onSuccess: (result) => {
            setCheckoutSuccess(result);
            const targetOrderId = result?.orderId || result?.id;
            if (targetOrderId) {
                navigate(`/orders/${targetOrderId}`);
            }
        },
        onError: (err: any) => {
            console.error("Checkout failed:", err);
            setCheckoutError(getErrorMessage(err, "Gagal melakukan checkout tiket."));
        },
    });

    const handleSelectTicket = (ticket: TicketType) => {
        setSelectedTicket(ticket);
        setQty(1);
        setCheckoutError(null);
    };

    const availableQuota = selectedTicket ? selectedTicket.quota - (selectedTicket.sold ?? 0) : 0;

    const handleIncreaseQty = () => {
        if (qty < availableQuota) setQty((prev) => prev + 1);
    };

    const handleDecreaseQty = () => {
        if (qty > 1) setQty((prev) => prev - 1);
    };

    const subtotal = selectedTicket ? selectedTicket.price * qty : 0;
    const finalPrice = calculation ? calculation.finalPrice : subtotal;

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) return;
        setCouponError(null);
        setAppliedCoupon(couponInput.trim());
    };

    const handleRemoveCoupon = () => {
        setCouponInput("");
        setAppliedCoupon("");
        setCouponError(null);
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (!event || !selectedTicket) {
            setCheckoutError("Silakan pilih jenis tiket terlebih dahulu.");
            return;
        }

        if (qty <= 0 || qty > availableQuota) {
            setCheckoutError("Jumlah tiket tidak valid atau melebihi kuota.");
            return;
        }

        setCheckoutError(null);

        checkoutMutation.mutate({
            eventId: event.id,
            ticketTypeId: selectedTicket.id,
            qtyTickets: qty,
            couponCode: appliedCoupon.trim() || undefined,
            usePoint: usePoint,
            paymentMethod: "BANK_TRANSFER",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-white text-slate-900">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-500">Memuat detail event...</p>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-4 max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                    <h2 className="text-lg font-bold">Event Tidak Ditemukan</h2>
                    <p className="text-sm text-rose-600">
                        {getErrorMessage(error, "Detail event tidak dapat ditemukan.")}
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const locationText = event.venue
        ? [event.venue.venueName, event.venue.venueAddress, event.venue.venueCity, event.venue.venueState]
              .filter(Boolean)
              .join(", ")
        : "Lokasi belum ditentukan";

    return (
        <div className="bg-white text-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary transition-colors gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                {checkoutSuccess && (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold">Checkout Berhasil!</h2>
                                <p className="text-sm text-emerald-700">
                                    Pesanan Anda telah terbuat dengan No. Invoice:{" "}
                                    <span className="font-bold">
                                        {checkoutSuccess.invoiceNumber || checkoutSuccess.id}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2 text-sm text-slate-700">
                            <div className="flex justify-between">
                                <span>Total Tagihan:</span>
                                <span className="font-bold text-slate-900">
                                    {formatRupiah(checkoutSuccess.finalPrice ?? subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Metode Pembayaran:</span>
                                <span className="font-semibold">
                                    {checkoutSuccess.payment?.paymentMethod || "Bank Transfer"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                    {checkoutSuccess.status || "WAITING_PAYMENT"}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button onClick={() => setCheckoutSuccess(null)} variant="outline" className="w-full">
                                Tutup
                            </Button>
                            {user?.role === "CUSTOMER" && (
                                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                                    <Link to="/">Ke Beranda</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                            {event.thumbnailUrl ? (
                                <img
                                    src={event.thumbnailUrl}
                                    alt={event.eventTitle}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                    <Sparkles className="w-12 h-12 mb-2 text-slate-300" />
                                    <span className="text-sm font-medium">No Thumbnail Available</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {event.category && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                        {event.category.category}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {event.eventTitle}
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-primary shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-slate-500">Tanggal & Waktu</p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {formatEventDateTime(event.eventDate, event.startTime, event.endTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-primary shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-slate-500">Lokasi Venue</p>
                                    <p className="text-sm font-bold text-slate-800">{event.venue?.venueName || "Venue TBD"}</p>
                                    <p className="text-xs text-slate-600 line-clamp-2">{locationText}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Deskripsi Event</h2>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                {event.eventDesc || "Tidak ada deskripsi rinci untuk event ini."}
                            </p>
                        </div>

                        {event.eventTnc && (
                            <div className="space-y-3 pt-2">
                                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Syarat & Ketentuan</h2>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    {event.eventTnc}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 pt-2">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Pilih Jenis Tiket</h2>
                            {!event.ticketTypes || event.ticketTypes.length === 0 ? (
                                <p className="text-sm text-slate-500">Belum ada jenis tiket yang tersedia untuk event ini.</p>
                            ) : (
                                <div className="space-y-3">
                                    {event.ticketTypes.map((ticket) => {
                                        const remaining = ticket.quota - (ticket.sold ?? 0);
                                        const isSelected = selectedTicket?.id === ticket.id;

                                        return (
                                            <div
                                                key={ticket.id}
                                                onClick={() => handleSelectTicket(ticket)}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                    isSelected
                                                        ? "border-primary bg-primary/5 shadow-xs"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Ticket className={`w-4 h-4 ${isSelected ? "text-primary" : "text-slate-400"}`} />
                                                        <h3 className="font-bold text-slate-900">{ticket.ticketType}</h3>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Tersisa: <span className="font-semibold text-slate-700">{remaining} tiket</span> dari total {ticket.quota}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                                    <span className="text-base font-extrabold text-primary">
                                                        {formatRupiah(ticket.price)}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={isSelected ? "bg-primary text-white" : ""}
                                                    >
                                                        {isSelected ? "Terpilih" : "Pilih"}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs sticky top-20">
                            <CardContent className="p-6 space-y-5">
                                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Ringkasan Pembelian
                                </h3>

                                {selectedTicket ? (
                                    <div className="space-y-4">
                                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                            <p className="text-xs text-slate-500 font-medium">Tiket Terpilih:</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedTicket.ticketType}</p>
                                            <p className="text-xs font-semibold text-primary">{formatRupiah(selectedTicket.price)} / tiket</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">Jumlah Tiket:</span>
                                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1">
                                                <button
                                                    type="button"
                                                    onClick={handleDecreaseQty}
                                                    disabled={qty <= 1}
                                                    className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                                >
                                                    <Minus className="w-4 h-4 text-slate-600" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={handleIncreaseQty}
                                                    disabled={qty >= availableQuota}
                                                    className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4 text-slate-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-600">Kode Kupon (Opsional):</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan kode kupon"
                                                    value={couponInput}
                                                    onChange={(e) => {
                                                        setCouponInput(e.target.value);
                                                        setCouponError(null);
                                                    }}
                                                    className="text-xs uppercase flex-1"
                                                    disabled={!!appliedCoupon || isCalculating}
                                                />
                                                {appliedCoupon ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRemoveCoupon}
                                                        className="shrink-0 text-xs border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                    >
                                                        Hapus
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={handleApplyCoupon}
                                                        disabled={!couponInput.trim() || isCalculating}
                                                        className="shrink-0 text-xs bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                                                    >
                                                        Gunakan Kupon
                                                    </Button>
                                                )}
                                            </div>
                                            {appliedCoupon && (
                                                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                    Kupon <span className="font-bold uppercase">{appliedCoupon}</span> berhasil diterapkan
                                                </p>
                                            )}
                                            {couponError && (
                                                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                                    {couponError}
                                                </p>
                                            )}
                                        </div>

                                        {isAuthenticated && user && user.balancePoints > 0 && (
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-amber-900">Gunakan Poin Saya</p>
                                                    <p className="text-[11px] text-amber-700">Tersedia {user.balancePoints.toLocaleString("id-ID")} poin</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={usePoint}
                                                    onChange={(e) => setUsePoint(e.target.checked)}
                                                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                                                />
                                            </div>
                                        )}

                                        {checkoutError && (
                                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                                                <span>{checkoutError}</span>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-100 pt-3 space-y-2">
                                            <div className="flex justify-between text-xs text-slate-600">
                                                <span>Subtotal ({qty} tiket):</span>
                                                <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                                            </div>

                                            {calculation && calculation.couponDiscount > 0 && (
                                                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                                                    <span>Diskon Kupon:</span>
                                                    <span>-{formatRupiah(calculation.couponDiscount)}</span>
                                                </div>
                                            )}

                                            {calculation && calculation.pointUsed > 0 && (
                                                <div className="flex justify-between text-xs text-amber-600 font-medium">
                                                    <span>Poin Digunakan ({calculation.pointUsed.toLocaleString("id-ID")} poin):</span>
                                                    <span>-{formatRupiah(calculation.pointUsed)}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                                                <span>Total Price:</span>
                                                <span className="text-primary flex items-center gap-1.5">
                                                    {isCalculating ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                    ) : (
                                                        formatRupiah(finalPrice)
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleCheckout}
                                            disabled={checkoutMutation.isPending || availableQuota <= 0}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-xs transition-all cursor-pointer"
                                        >
                                            {checkoutMutation.isPending ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Memproses...</span>
                                                </div>
                                            ) : isAuthenticated ? (
                                                "Checkout Sekarang"
                                            ) : (
                                                "Login untuk Checkout"
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-4">
                                        Silakan pilih jenis tiket untuk melihat ringkasan pesanan.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
