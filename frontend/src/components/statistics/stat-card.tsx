import { Calendar, DollarSign, Ticket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { GrowthBadge } from "./growth-badge"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { Timeframe } from "@/types/dashboard.types"
import { Spinner } from "../ui/spinner"

interface StatsCardProps {
    timeframe: Timeframe
}

export const StatsCard = ({ timeframe }: StatsCardProps) => {
    const { data, isLoading, isError } = useDashboardStats(timeframe as Timeframe);

    const statsData = [
        {
            title: "Total Pendapatan",
            value: data?.totalRevenue ?? 0,
            growth: data?.totalRevenueGrowth ?? 0,
            icon: DollarSign,
            isCurrency: true,
            description:"Dalam 30 hari terakhir"
        },
        {
            title: "Total Tiket Terjual",
            value: data?.totalTicketSold ?? 0,
            growth: data?.totalTicketSoldGrowth ?? 0,
            icon: Ticket,
            isCurrency:false,
            description:"Dalam 30 hari terakhir"
        },
        {
            title: "Total Event Aktif",
            value: data?.totalActiveEvents ?? 0,
            growth: data?.totalActiveEventsGrowth ?? 0,
            icon: Calendar,
            isCurrency:false,
            description:"Dalam 30 hari terakhir"
        },
    ]

    if (isError) {
        return (
            <p className="text-sm text-rose-600">
                Gagal Memuat Data. Coba muat ulang halaman!
            </p>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => {
                    const IconComponent = stat.icon;

                    return (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg text-primary w-9 h-9">
                                        <IconComponent className="w-5 h-5"/>
                                    </div>
                                    {
                                        isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner/>
                                            </div>
                                        ) : <GrowthBadge value={stat.growth} />
                                    }
                                </div>
                                
                                <CardTitle className="font-semibold text-secondary text-xl tracking-wide">{stat.title.toUpperCase()}</CardTitle>
                                <p className="text-sm text-slate-500">
                                    {stat.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        {
                                            isLoading ? (<Spinner/>) : stat.isCurrency ? 
                                            `Rp ${stat.value.toLocaleString('id-ID')},-` 
                                            :
                                            stat.value.toLocaleString('id-ID')}
                                        </span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}