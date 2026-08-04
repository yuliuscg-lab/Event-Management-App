import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Loader2, AlertCircle, Sparkles, Ticket } from "lucide-react";
import { fetchPublicEvents } from "@/api/events";
import { EventItem } from "@/types/event.types";
import { formatEventDateTime } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";

export const Home: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setErrorMsg(null);
            try {
                const data = await fetchPublicEvents();
                setEvents(data);
            } catch (err: any) {
                console.error("Failed to fetch events:", err);
                setErrorMsg("Gagal terhubung ke server.");
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    return (
        <div className="bg-white text-slate-900 min-h-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        EventPulse
                    </h1>
                </div>

                {}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-slate-500 text-sm font-medium">Memuat event...</p>
                    </div>
                )}

                {}
                {!isLoading && errorMsg && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                    </div>
                )}

                {}
                {!isLoading && !errorMsg && events.length === 0 && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
                        <Ticket className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <h3 className="text-base font-semibold text-slate-800">Belum Ada Event</h3>
                    </div>
                )}

                {}
                {!isLoading && !errorMsg && events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const locationText = event.venue
                                ? [event.venue.venueName, event.venue.venueCity].filter(Boolean).join(", ")
                                : "Lokasi belum ditentukan";

                            return (
                                <Link
                                    key={event.id}
                                    to={`/events/${event.id}`}
                                    className="block group"
                                >
                                    <Card className="overflow-hidden border border-slate-200 bg-white hover:border-primary/50 hover:shadow-lg transition-all duration-200 rounded-xl flex flex-col cursor-pointer h-full">
                                        {}
                                        <div className="relative aspect-video bg-slate-100 overflow-hidden shrink-0">
                                            {event.thumbnailUrl ? (
                                                <img
                                                    src={event.thumbnailUrl}
                                                    alt={event.eventTitle}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                                                    <Sparkles className="w-7 h-7 mb-1 text-slate-300" />
                                                    <span className="text-xs font-medium">No Thumbnail</span>
                                                </div>
                                            )}
                                        </div>

                                        {}
                                        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2.5">
                                                {}
                                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {event.eventTitle}
                                                </h2>

                                                {}
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="truncate">{locationText}</span>
                                                </div>

                                                {}
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                                                    <span>
                                                        {formatEventDateTime(event.eventDate, event.startTime, event.endTime)}
                                                    </span>
                                                </div>

                                                {}
                                                <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed pt-1">
                                                    {event.eventDesc || "Tidak ada deskripsi."}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};