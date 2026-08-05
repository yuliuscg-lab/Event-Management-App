import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, OrderItem } from "@/api/orders";
import { formatRupiah, formatEventDateTime } from "@/utils/format";
import { getErrorMessage } from "@/utils/response";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ShoppingBag, Calendar, Ticket, Loader2, AlertCircle, 
    Clock, CheckCircle2, XCircle, ChevronRight, Sparkles 
} from "lucide-react";

export const MyOrders: React.FC = () => {
    const {
        data: orders = [],
        isLoading,
        isError,
        error,
    } = useQuery<OrderItem[]>({
        queryKey: ["my-orders"],
        queryFn: fetchMyOrders,
    });

    const getStatusBadge = (order: OrderItem) => {
        const paymentStatus = order.payment?.status;
        const orderStatus = order.status;

        if (orderStatus === "PAID") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Lunas / Sukses
                </span>
            );
        }

        if (orderStatus === "CANCELLED" || orderStatus === "EXPIRED" || paymentStatus === "EXPIRED") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Kadaluwarsa / Dibatalkan
                </span>
            );
        }

        if (paymentStatus === "REJECTED") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Pembayaran Ditolak
                </span>
            );
        }

        if (paymentStatus === "WAITING_VERIFICATION") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Menunggu Verifikasi
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Menunggu Pembayaran
            </span>
        );
    };

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-primary shadow-xs">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Pesanan Saya
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Kelola dan lihat status tiket event yang telah Anda pesan
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm font-medium text-slate-500">Memuat riwayat pesanan...</p>
                    </div>
                )}

                {isError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 max-w-md mx-auto">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        <p className="text-sm font-medium">
                            {getErrorMessage(error, "Gagal memuat daftar pesanan.")}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && orders.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto space-y-3 shadow-xs">
                        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-lg font-bold text-slate-800">Belum Ada Pesanan</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Anda belum pernah melakukan pemesanan tiket. Jelajahi event menarik dan pesan tiket pertama Anda!
                        </p>
                        <Button asChild className="mt-2 bg-primary hover:bg-primary/90 text-white">
                            <Link to="/">Cari Event</Link>
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="border border-slate-200 bg-white rounded-xl shadow-xs hover:border-slate-300 transition-all overflow-hidden">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No. Invoice</p>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800">{order.invoiceNumber}</p>
                                        </div>
                                        <div>{getStatusBadge(order)}</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-20 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                {order.event?.thumbnailUrl ? (
                                                    <img src={order.event.thumbnailUrl} alt={order.event.eventTitle} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                                    {order.event?.eventTitle || "Event Ticket"}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Ticket className="w-3.5 h-3.5 text-primary" />
                                                        {order.ticketName} ({order.qtyTickets}x)
                                                    </span>
                                                    {order.event?.eventDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            {formatEventDateTime(order.event.eventDate, order.event.startTime)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
                                            <div className="text-left sm:text-right">
                                                <p className="text-[11px] text-slate-400 font-semibold">Total Pembayaran</p>
                                                <p className="text-base font-extrabold text-primary">{formatRupiah(order.finalPrice)}</p>
                                            </div>

                                            <Button asChild size="sm" variant="outline" className="text-xs font-semibold cursor-pointer">
                                                <Link to={`/orders/${order.id}`}>
                                                    Lihat Detail <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
