import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById, submitPaymentProof } from "@/api/orders";
import { uploadPaymentProof } from "@/api/upload";
import { formatRupiah, formatEventDateTime } from "@/utils/format";
import { getErrorMessage } from "@/utils/response";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ArrowLeft, Calendar, MapPin, Ticket, Loader2, AlertCircle, 
    CheckCircle2, Clock, Upload, Image as ImageIcon, Copy, Check, Sparkles
} from "lucide-react";

export const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const {
        data: order,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["order-detail", id],
        queryFn: async () => {
            if (!id) throw new Error("ID Pesanan tidak ditemukan");
            return await fetchOrderById(id);
        },
        enabled: !!id,
    });

    const uploadProofMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!order?.payment?.id) {
                throw new Error("ID Pembayaran tidak ditemukan.");
            }

            const cloudRes = await uploadPaymentProof(file);

            return await submitPaymentProof(order.payment.id, cloudRes.url);
        },
        onSuccess: () => {
            setUploadSuccess("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.");
            setSelectedFile(null);
            setPreviewUrl(null);

            queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
        },
        onError: (err: any) => {
            console.error("Upload proof failed:", err);
            setUploadError(getErrorMessage(err, "Gagal mengunggah bukti pembayaran."));
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadError("Harap pilih file gambar (JPG, PNG, WebP).");
            return;
        }

        setSelectedFile(file);
        setUploadError(null);
        setUploadSuccess(null);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUploadProof = () => {
        if (!selectedFile) {
            setUploadError("Silakan pilih file bukti pembayaran terlebih dahulu.");
            return;
        }
        setUploadError(null);
        setUploadSuccess(null);

        uploadProofMutation.mutate(selectedFile);
    };

    const handleCopyAccount = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-white text-slate-900">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-500">Memuat detail pesanan...</p>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-4 max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                    <h2 className="text-lg font-bold">Pesanan Tidak Ditemukan</h2>
                    <p className="text-sm text-rose-600">
                        {getErrorMessage(error, "Detail pesanan tidak dapat ditemukan.")}
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link to="/orders">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Pesanan Saya
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const paymentStatus = order.payment?.status;
    const isWaitingUpload = paymentStatus === "WAITING_UPLOAD" || (order.status === "WAITING_PAYMENT" && !order.payment?.paymentProof);
    const isWaitingVerification = paymentStatus === "WAITING_VERIFICATION";
    const isPaid = order.status === "PAID" || paymentStatus === "VERIFIED";
    const isRejected = paymentStatus === "REJECTED";
    const isEventPassed = order.event?.eventDate 
        ? new Date(order.event.eventDate).getTime() < new Date().getTime()
        : false;

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" size="sm" className="bg-white hover:bg-slate-50">
                        <Link to="/orders">
                            <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Pesanan Saya
                        </Link>
                    </Button>

                    <div className="text-right">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase">No. Invoice</p>
                        <p className="text-sm font-extrabold text-slate-900">{order.invoiceNumber}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Informasi Event
                                </h2>

                                <div className="flex items-start gap-4">
                                    {order.event?.thumbnailUrl && (
                                        <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                            <img src={order.event.thumbnailUrl} alt={order.event.eventTitle} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                            {order.event?.eventTitle || "Detail Event"}
                                        </h3>
                                        {order.event?.eventDate && (
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Calendar className="w-4 h-4 text-primary shrink-0" />
                                                <span>{formatEventDateTime(order.event.eventDate, order.event.startTime, order.event.endTime)}</span>
                                            </div>
                                        )}
                                        {order.event?.venue && (
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                <span>{[order.event.venue.venueName, order.event.venue.venueCity].filter(Boolean).join(", ")}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs">
                            <CardContent className="p-6 space-y-4">
                                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Rincian Tiket & Pembayaran
                                </h2>

                                <div className="space-y-2.5 text-xs text-slate-600">
                                    <div className="flex justify-between items-center py-1">
                                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                            <Ticket className="w-4 h-4 text-primary" />
                                            {order.ticketName} ({order.qtyTickets}x)
                                        </span>
                                        <span className="font-semibold text-slate-800">{formatRupiah(order.totalPrice)}</span>
                                    </div>

                                    {order.couponDiscount > 0 && (
                                        <div className="flex justify-between items-center text-emerald-600 font-medium py-1">
                                            <span>Diskon Kupon</span>
                                            <span>-{formatRupiah(order.couponDiscount)}</span>
                                        </div>
                                    )}

                                    {order.pointsUsed > 0 && (
                                        <div className="flex justify-between items-center text-amber-600 font-medium py-1">
                                            <span>Potongan Poin ({order.pointsUsed.toLocaleString("id-ID")} pts)</span>
                                            <span>-{formatRupiah(order.pointsUsed)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                                        <span>Total Tagihan</span>
                                        <span className="text-primary text-base">{formatRupiah(order.finalPrice)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {order.issuedTickets && order.issuedTickets.length > 0 && (
                            <Card className="border border-emerald-200 bg-emerald-50/40 rounded-2xl shadow-xs overflow-hidden">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-emerald-600" />
                                            <h2 className="text-base font-bold text-slate-900">
                                                E-Ticket Terbit ({order.issuedTickets.length})
                                            </h2>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                                            Siap Digunakan
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {order.issuedTickets.map((ticket, index) => (
                                            <div
                                                key={ticket.id || index}
                                                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Ticket className="w-4 h-4 text-primary shrink-0" />
                                                        <p className="text-xs text-slate-500 font-medium">Tiket #{index + 1}: <span className="font-bold text-slate-900">{ticket.ticketName}</span></p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-slate-500">Kode Tiket:</span>
                                                        <span className="text-sm font-mono font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                                                            {ticket.ticketCode}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                                    {ticket.isUsed ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                                                            Sudah Check-in
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                            Aktif
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyAccount(ticket.ticketCode)}
                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer text-xs flex items-center gap-1"
                                                        title="Salin Kode Tiket"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span className="hidden xs:inline">Salin</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs">
                            <CardContent className="p-6 space-y-4">
                                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Status Pembayaran
                                </h2>

                                {isPaid && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>Pembayaran Diverifikasi</span>
                                        </div>
                                        <p className="text-xs text-emerald-700 leading-relaxed">
                                            Selamat! Pembayaran Anda telah lunas dan diverifikasi. E-ticket dapat dilihat di sistem.
                                        </p>
                                    </div>
                                )}

                                {isWaitingVerification && (
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                                            <span>Menunggu Verifikasi</span>
                                        </div>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Bukti pembayaran Anda sudah berhasil diunggah dan sedang dalam proses verifikasi oleh Admin.
                                        </p>
                                    </div>
                                )}

                                {isRejected && (
                                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                            <span>Pembayaran Ditolak</span>
                                        </div>
                                        <p className="text-xs text-rose-700 leading-relaxed">
                                            {order.payment?.rejectReason || "Bukti pembayaran tidak sesuai atau tidak valid."}
                                        </p>
                                    </div>
                                )}

                                {isEventPassed && !isPaid && (
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                                        <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                            <span>Event Sudah Berlalu</span>
                                        </div>
                                        <p className="text-xs text-amber-700 leading-relaxed">
                                            Masa pelaksanaan event ini telah lewat. Unggah bukti pembayaran sudah tidak dapat dilakukan.
                                        </p>
                                    </div>
                                )}

                                {(isWaitingUpload || isWaitingVerification) && !isEventPassed && (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                        <p className="text-xs font-semibold text-slate-500">Metode Transfer Bank:</p>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-700">Bank BCA</p>
                                            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                                                <span className="text-sm font-extrabold text-slate-900 tracking-wider">123 456 7890</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyAccount("1234567890")}
                                                    className="p-1 text-slate-500 hover:text-primary transition-colors cursor-pointer"
                                                    title="Salin No. Rekening"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-slate-500 pt-0.5">a.n. EventPulse Official</p>
                                        </div>
                                    </div>
                                )}

                                {(isWaitingUpload || isRejected) && !isEventPassed && (
                                    <div className="space-y-3 pt-2">
                                        <label className="block text-xs font-bold text-slate-800">
                                            Unggah Bukti Pembayaran:
                                        </label>

                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-slate-50/50 space-y-2">
                                            {previewUrl ? (
                                                <div className="space-y-2">
                                                    <img src={previewUrl} alt="Preview Bukti" className="w-full max-h-48 object-contain rounded-lg border border-slate-200 mx-auto" />
                                                    <p className="text-[11px] text-slate-500 truncate">{selectedFile?.name}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 py-2">
                                                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                                                    <p className="text-xs text-slate-500">Pilih file gambar bukti transfer</p>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="payment-proof-input"
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs font-medium cursor-pointer"
                                                onClick={() => document.getElementById("payment-proof-input")?.click()}
                                            >
                                                <Upload className="w-3.5 h-3.5 mr-1.5" />
                                                {selectedFile ? "Ganti Gambar" : "Pilih Gambar"}
                                            </Button>
                                        </div>

                                        {uploadError && (
                                            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{uploadError}</span>
                                            </p>
                                        )}

                                        {uploadSuccess && (
                                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                <span>{uploadSuccess}</span>
                                            </p>
                                        )}

                                        <Button
                                            type="button"
                                            onClick={handleUploadProof}
                                            disabled={!selectedFile || uploadProofMutation.isPending}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                                        >
                                            {uploadProofMutation.isPending ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Mengunggah...</span>
                                                </div>
                                            ) : (
                                                "Kirim Bukti Pembayaran"
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {order.payment?.paymentProof && (
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <p className="text-xs font-semibold text-slate-700">Bukti Pembayaran Terunggah:</p>
                                        <a href={order.payment.paymentProof} target="_blank" rel="noreferrer" className="block group">
                                            <img
                                                src={order.payment.paymentProof}
                                                alt="Bukti Transfer"
                                                className="w-full max-h-48 object-cover rounded-xl border border-slate-200 group-hover:opacity-90 transition-opacity"
                                            />
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};