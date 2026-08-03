import React, { useEffect, useState, useMemo } from "react";
import { 
    Search, 
    Filter, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    Eye, 
    X, 
    DollarSign,
    Receipt
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchOrganizerSalesOrders } from "@/api/events";
import { OrganizerSalesOrder, SalesOrderStatus } from "@/types/event.types";
import { getErrorMessage } from "@/utils/response";
import { formatRupiah } from "@/utils/format";

export const Sales: React.FC = () => {
    const [orders, setOrders] = useState<OrganizerSalesOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedEventId, setSelectedEventId] = useState<string>("ALL");

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<OrganizerSalesOrder | null>(null);

    const loadSalesOrders = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const data = await fetchOrganizerSalesOrders();
            setOrders(data);
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSalesOrders();
    }, []);

    // Distinct events list for dropdown filter
    const eventOptions = useMemo(() => {
        const map = new Map<string, string>();
        orders.forEach((o) => {
            if (o.event?.id && o.event?.eventTitle) {
                map.set(o.event.id, o.event.eventTitle);
            }
        });
        return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
    }, [orders]);

    // Filtered sales orders
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
                o.invoiceNumber.toLowerCase().includes(query) ||
                o.customer?.name.toLowerCase().includes(query) ||
                o.customer?.email.toLowerCase().includes(query) ||
                o.event?.eventTitle.toLowerCase().includes(query) ||
                o.ticketName.toLowerCase().includes(query);

            const matchesStatus = 
                statusFilter === "ALL" || 
                (statusFilter === "CANCELLED" ? (o.status === "CANCELLED" || o.status === "CANCELLED_EXPIRED") : o.status === statusFilter);

            const matchesEvent = selectedEventId === "ALL" || o.event?.id === selectedEventId;

            return matchesSearch && matchesStatus && matchesEvent;
        });
    }, [orders, searchQuery, statusFilter, selectedEventId]);

    // Summary Statistics
    const stats = useMemo(() => {
        const totalCount = orders.length;
        const paidOrders = orders.filter((o) => o.status === "PAID");
        const waitingOrders = orders.filter((o) => o.status === "WAITING_PAYMENT");
        const cancelledOrders = orders.filter((o) => o.status === "CANCELLED" || o.status === "CANCELLED_EXPIRED");

        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.finalPrice, 0);

        return {
            totalCount,
            paidCount: paidOrders.length,
            waitingCount: waitingOrders.length,
            cancelledCount: cancelledOrders.length,
            totalRevenue,
        };
    }, [orders]);

    // Format helpers
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    const renderStatusBadge = (status: SalesOrderStatus) => {
        switch (status) {
            case "PAID":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                        LUNAS (PAID)
                    </span>
                );
            case "WAITING_PAYMENT":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                        MENUNGGU BAYAR
                    </span>
                );
            case "CANCELLED":
            case "CANCELLED_EXPIRED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
                        DIBATALKAN
                    </span>
                );
            case "REFUNDED":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
                        <RefreshCwIcon className="w-3.5 h-3.5 text-purple-500 mr-1.5" />
                        DIREFUND
                    </span>
                );
            default:
                return <span className="text-xs text-slate-500">{status}</span>;
        }
    };

    const handleOpenDetail = (order: OrganizerSalesOrder) => {
        setSelectedOrder(order);
        setDetailModalOpen(true);
    };

    return (
        <section id="organizer-sales" className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Orders</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Pantau seluruh pesanan dan transaksi tiket konsumen (lunas, pending, maupun dibatalkan).
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pesanan</p>
                        <p className="flex justify-center text-2xl font-bold text-slate-900 mt-0.5">{stats.totalCount}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendapatan Lunas</p>
                        <p className="text-xl font-bold text-emerald-600 mt-0.5">{formatRupiah(stats.totalRevenue)}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Bayar</p>
                        <p className="flex justify-center text-2xl font-bold text-amber-600 mt-0.5">{stats.waitingCount}</p>
                    </div>
                </Card>

                <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shrink-0">
                        <XCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dibatalkan</p>
                        <p className="flex justify-center text-2xl font-bold text-rose-600 mt-0.5">{stats.cancelledCount}</p>
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <Card className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari invoice, konsumen, event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-50/50 border-slate-200 text-sm rounded-lg"
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

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <Filter className="h-3.5 w-3.5" />
                            <span>Filter:</span>
                        </div>

                        {/* Event Dropdown */}
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="ALL">Semua Event</option>
                            {eventOptions.map((ev) => (
                                <option key={ev.id} value={ev.id}>
                                    {ev.title}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter Buttons */}
                        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200/80">
                            {[
                                { key: "ALL", label: "Semua Status" },
                                { key: "PAID", label: "Lunas" },
                                { key: "WAITING_PAYMENT", label: "Pending" },
                                { key: "CANCELLED", label: "Batal" },
                            ].map((st) => {
                                const isActive = statusFilter === st.key;
                                return (
                                    <button
                                        key={st.key}
                                        onClick={() => setStatusFilter(st.key)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-white text-slate-900 shadow-xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {st.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Sales Orders Table */}
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">No. Invoice</th>
                                <th className="px-6 py-4">Konsumen</th>
                                <th className="px-6 py-4">Event & Tiket</th>
                                <th className="px-6 py-4">Total Bayar</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Waktu Transaksi</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40 mb-1" /><div className="h-3 bg-slate-100 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                                        <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 rounded w-12 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Receipt className="h-10 w-10 text-slate-300 mb-1" />
                                            <p className="font-semibold text-slate-800 text-base">Tidak ada sales order ditemukan</p>
                                            <p className="text-xs text-slate-500 max-w-sm">
                                                {searchQuery || statusFilter !== "ALL" || selectedEventId !== "ALL"
                                                    ? "Coba ubah kata kunci pencarian atau sesuaikan filter status dan event."
                                                    : "Belum ada transaksi sales order yang masuk untuk event milik Anda."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Invoice Number */}
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                {order.invoiceNumber}
                                            </span>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 text-sm">
                                                    {order.customer?.name || "Konsumen"}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {order.customer?.email}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Event & Ticket */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-slate-900 text-xs truncate max-w-50">
                                                    {order.event?.eventTitle || "Event"}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700">
                                                        {order.ticketName}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        x{order.qtyTickets}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {formatRupiah(order.finalPrice)}
                                                </span>
                                                {(order.totalDiscount > 0 || order.pointsUsed > 0) && (
                                                    <span className="text-[11px] text-emerald-600 font-medium">
                                                        Hemat {formatRupiah(order.totalDiscount + order.pointsUsed)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {renderStatusBadge(order.status)}
                                        </td>

                                        {/* Created Date */}
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {formatDate(order.createdAt)}
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Lihat Rincian Order"
                                                onClick={() => handleOpenDetail(order)}
                                                className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer ml-auto"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* SALES ORDER DETAIL MODAL */}
            {detailModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Receipt className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">Rincian Sales Order</h3>
                                    <p className="text-xs text-slate-500 font-mono">{selectedOrder.invoiceNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm text-slate-700">
                            {/* Status Banner */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-xs font-semibold text-slate-500">Status Transaksi:</span>
                                {renderStatusBadge(selectedOrder.status)}
                            </div>

                            {/* Customer & Event Summary */}
                            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
                                <div>
                                    <span className="text-slate-400 font-medium block">Konsumen</span>
                                    <span className="font-bold text-slate-900">{selectedOrder.customer?.name}</span>
                                    <span className="text-slate-500 block truncate">{selectedOrder.customer?.email}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium block">Event</span>
                                    <span className="font-bold text-slate-900 line-clamp-1">{selectedOrder.event?.eventTitle}</span>
                                    <span className="text-slate-500 block">{formatDate(selectedOrder.event?.eventDate)}</span>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rincian Tiket</h4>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 text-xs">
                                    <div>
                                        <span className="font-bold text-slate-900 block">{selectedOrder.ticketName}</span>
                                        <span className="text-slate-500">{formatRupiah(selectedOrder.ticketPrice)} x {selectedOrder.qtyTickets} tiket</span>
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">
                                        {formatRupiah(selectedOrder.totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rincian Pembayaran</h4>
                                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal Tiket</span>
                                        <span className="font-medium">{formatRupiah(selectedOrder.totalPrice)}</span>
                                    </div>

                                    {selectedOrder.totalDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Diskon Kupon ({selectedOrder.couponCode || "Kupon"})</span>
                                            <span className="font-medium">-{formatRupiah(selectedOrder.totalDiscount)}</span>
                                        </div>
                                    )}

                                    {selectedOrder.pointsUsed > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Poin Digunakan ({selectedOrder.pointsUsed} pts)</span>
                                            <span className="font-medium">-{formatRupiah(selectedOrder.pointsUsed)}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-200 my-1 pt-2 flex justify-between text-sm font-bold text-slate-900">
                                        <span>Total Akhir</span>
                                        <span className="text-primary">{formatRupiah(selectedOrder.finalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional info */}
                            <div className="text-xs text-slate-400 flex flex-col gap-1">
                                <div>Waktu Pemesanan: <strong className="text-slate-600">{formatDate(selectedOrder.createdAt)}</strong></div>
                                {selectedOrder.payment?.paymentMethod && (
                                    <div>Metode Pembayaran: <strong className="text-slate-600">{selectedOrder.payment.paymentMethod}</strong></div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 flex justify-end">
                            <Button variant="outline" onClick={() => setDetailModalOpen(false)} className="text-xs">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

// Internal icon fallback
const RefreshCwIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);