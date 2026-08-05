import React, { useEffect, useState } from "react";
import { fetchOrganizerSalesOrders } from "@/api/events";
import { verifyPayment, rejectPayment } from "@/api/orders";
import { formatRupiah, formatDate } from "@/utils/format";
import { getErrorMessage } from "@/utils/response";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    CheckCircle2, XCircle, Clock, AlertCircle, Loader2, 
    Search, Eye, ShieldCheck, User, Ticket, Calendar, X,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [filterStatus, setFilterStatus] = useState<"ALL" | "WAITING" | "VERIFIED" | "REJECTED">("WAITING");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState<string>("");

    const loadOrders = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const data = await fetchOrganizerSalesOrders();
            setOrders(data);
        } catch (err: any) {
            console.error("Error fetching orders for admin:", err);
            setErrorMsg(getErrorMessage(err, "Gagal memuat daftar verifikasi pembayaran."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleVerify = async (paymentId: string) => {
        if (!paymentId) return;
        setActionLoadingId(paymentId);
        setActionFeedback(null);
        try {
            await verifyPayment(paymentId);
            setActionFeedback({ type: "success", message: "Pembayaran berhasil diverifikasi! Tiket diterbitkan." });
            await loadOrders();
        } catch (err: any) {
            console.error("Failed to verify payment:", err);
            setActionFeedback({ type: "error", message: getErrorMessage(err, "Gagal memverifikasi pembayaran.") });
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectingPaymentId) return;
        setActionLoadingId(rejectingPaymentId);
        setActionFeedback(null);
        try {
            await rejectPayment(rejectingPaymentId, rejectReason.trim() || "Bukti transfer tidak valid.");
            setActionFeedback({ type: "success", message: "Pembayaran berhasil ditolak." });
            setRejectingPaymentId(null);
            setRejectReason("");
            await loadOrders();
        } catch (err: any) {
            console.error("Failed to reject payment:", err);
            setActionFeedback({ type: "error", message: getErrorMessage(err, "Gagal menolak pembayaran.") });
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const paymentStatus = order.payment?.status;
        const matchesStatus =
            filterStatus === "ALL"
                ? true
                : filterStatus === "WAITING"
                ? paymentStatus === "WAITING_VERIFICATION"
                : filterStatus === "VERIFIED"
                ? paymentStatus === "VERIFIED" || order.status === "PAID"
                : filterStatus === "REJECTED"
                ? paymentStatus === "REJECTED"
                : true;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !q ||
            order.invoiceNumber?.toLowerCase().includes(q) ||
            order.customer?.name?.toLowerCase().includes(q) ||
            order.customer?.email?.toLowerCase().includes(q) ||
            order.event?.eventTitle?.toLowerCase().includes(q);

        return matchesStatus && matchesSearch;
    });

    const waitingCount = orders.filter((o) => o.payment?.status === "WAITING_VERIFICATION").length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Verifikasi Pembayaran
                        </h1>
                        {waitingCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                                {waitingCount} Menunggu
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Kelola dan verifikasi bukti transfer pembayaran tiket event dari pembeli
                    </p>
                </div>
            </div>

            {}
            {actionFeedback && (
                <div
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
                        actionFeedback.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {actionFeedback.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>{actionFeedback.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActionFeedback(null)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                {}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                        type="button"
                        onClick={() => setFilterStatus("WAITING")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            filterStatus === "WAITING"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Menunggu ({waitingCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            filterStatus === "ALL"
                                ? "bg-slate-900 text-white shadow-xs"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Semua ({orders.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("VERIFIED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            filterStatus === "VERIFIED"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Verifikasi / Lunas
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("REJECTED")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            filterStatus === "REJECTED"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Ditolak
                    </button>
                </div>

                {}
                <div className="relative min-w-50 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari Invoice / Nama / Event..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 text-xs h-9 bg-slate-50 border-slate-200"
                    />
                </div>
            </div>

            {}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Memuat verifikasi pembayaran...</p>
                </div>
            )}

            {}
            {!isLoading && errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 max-w-md mx-auto">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <p className="text-sm font-medium">{errorMsg}</p>
                </div>
            )}

            {}
            {!isLoading && !errorMsg && filteredOrders.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800">Tidak Ada Permintaan Verifikasi</h3>
                    <p className="text-xs text-slate-500">
                        {filterStatus === "WAITING"
                            ? "Saat ini tidak ada pembayaran yang menunggu verifikasi."
                            : "Tidak ditemukan data sesuai filter pencarian."}
                    </p>
                </div>
            )}

            {}
            {!isLoading && !errorMsg && filteredOrders.length > 0 && (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const payment = order.payment;
                        const isWaiting = payment?.status === "WAITING_VERIFICATION";
                        const isVerified = payment?.status === "VERIFIED" || order.status === "PAID";
                        const isRejected = payment?.status === "REJECTED";
                        const isActionLoading = actionLoadingId === payment?.id;

                        return (
                            <Card
                                key={order.id}
                                className="border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden hover:border-slate-300 transition-colors"
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                        {}
                                        <div className="flex items-start gap-4 flex-1">
                                            {}
                                            <div className="relative group shrink-0">
                                                {payment?.paymentProof ? (
                                                    <div
                                                        onClick={() => setPreviewImageUrl(payment.paymentProof)}
                                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer relative shadow-xs"
                                                    >
                                                        <img
                                                            src={payment.paymentProof}
                                                            alt="Bukti Transfer"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                                                            <Eye className="w-4 h-4" /> Lihat
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                                                        <Clock className="w-6 h-6 mb-1 text-slate-300" />
                                                        <span className="text-[10px] font-medium text-slate-400">Belum Upload</span>
                                                    </div>
                                                )}
                                            </div>

                                            {}
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                {}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                        {order.invoiceNumber}
                                                    </span>
                                                    {isWaiting && (
                                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                            Menunggu Verifikasi
                                                        </span>
                                                    )}
                                                    {isVerified && (
                                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                            Verifikasi Sukses
                                                        </span>
                                                    )}
                                                    {isRejected && (
                                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                                            Ditolak
                                                        </span>
                                                    )}
                                                </div>

                                                {}
                                                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                                                    {order.event?.eventTitle || "Event"}
                                                </h3>

                                                {}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                                                    <p className="flex items-center gap-1.5 truncate">
                                                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="font-semibold text-slate-800">{order.customer?.name || "Customer"}</span>
                                                        <span className="text-slate-400 text-[11px]">({order.customer?.email})</span>
                                                    </p>

                                                    <p className="flex items-center gap-1.5 truncate">
                                                        <Ticket className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        <span>{order.ticketName || order.ticketType?.ticketType} ({order.qtyTickets}x)</span>
                                                    </p>

                                                    {order.event?.eventDate && (
                                                        <p className="flex items-center gap-1.5 truncate">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span>{formatDate(order.event.eventDate)}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {}
                                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-4 shrink-0">
                                            <div className="text-left md:text-right">
                                                <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Pembayaran</p>
                                                <p className="text-lg font-extrabold text-primary">
                                                    {formatRupiah(order.finalPrice || order.totalPrice)}
                                                </p>
                                            </div>

                                            {}
                                            {isWaiting && payment?.id && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setRejectingPaymentId(payment.id);
                                                            setRejectReason("");
                                                        }}
                                                        disabled={isActionLoading}
                                                        className="text-xs font-bold border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                    >
                                                        Tolak
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleVerify(payment.id)}
                                                        disabled={isActionLoading}
                                                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                                    >
                                                        {isActionLoading ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            "Verifikasi"
                                                        )}
                                                    </Button>
                                                </div>
                                            )}

                                            {isVerified && (
                                                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Disetujui
                                                </span>
                                            )}

                                            {isRejected && (
                                                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4 text-rose-500" /> Ditolak
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {}
            {previewImageUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setPreviewImageUrl(null)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl p-2 overflow-hidden shadow-2xl space-y-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-3 py-1">
                            <span className="text-xs font-bold text-slate-700">Preview Bukti Pembayaran</span>
                            <button
                                type="button"
                                onClick={() => setPreviewImageUrl(null)}
                                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <img
                            src={previewImageUrl}
                            alt="Bukti Transfer Full"
                            className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
                        />
                    </div>
                </div>
            )}

            {}
            {rejectingPaymentId && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setRejectingPaymentId(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Tolak Pembayaran</h3>
                            <button
                                type="button"
                                onClick={() => setRejectingPaymentId(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600">Alasan Penolakan (Opsional):</label>
                            <Input
                                type="text"
                                placeholder="Contoh: Bukti transfer tidak jelas / nominal tidak sesuai"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="text-xs"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setRejectingPaymentId(null)}
                                disabled={!!actionLoadingId}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleRejectSubmit}
                                disabled={!!actionLoadingId}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                            >
                                {actionLoadingId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    "Konfirmasi Penolakan"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};