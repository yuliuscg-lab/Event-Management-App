import { useMemo } from "react";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { formatRupiah } from "@/utils/format";
import { useRevenueStream } from "@/hooks/use-dashboard";
import { Timeframe } from "@/types/dashboard.types";
import { Spinner } from "../ui/spinner";

interface RevenueStreamCardProps {
    timeframe:string
}

export const RevenueStreamCard = ({timeframe}:RevenueStreamCardProps) => {
    const { data, isLoading } = useRevenueStream(timeframe as Timeframe);
    const totalRevenue = data?.totalRevenue ?? 0;
    const breakdown = useMemo(() => (Array.isArray(data?.breakdown) ? data.breakdown : []), [data?.breakdown]);
    
    const chartConfig = useMemo(()=> {
        const config: ChartConfig = {
            revenue: { label: "Revenue" },
        };
        breakdown.forEach((item)=> {
            config[item.category] = {
                label: item.category,
                color: item.fill
            };
        });
        return config
    }, [breakdown])

    return (
        <>
        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl h-110 flex flex-col justify-between">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-secondary">
                    Revenue Stream
                </CardTitle>
                <p className="text-sm text-slate-500">
                    Distribusi sumber pendapatan
                </p>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex items-center">

                {isLoading ? (
                    <Spinner/>
                ): breakdown.length === 0 ? (
                    <div className="w-full text-center text-sm text-slate-400"> Belum ada transaksi pada periode ini </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
                    <div className="md:col-span-7 flex justify-center items-center relative h-72">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (!active || !payload || !payload.length) return null;
                                            const data = payload[0].payload;
                                            return (
                                                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md space-y-1">
                                                    <div className="flex items-center gap-2 font-semibold text-secondary">
                                                        <span
                                                            className="h-2.5 w-2.5 rounded-xs shrink-0"
                                                            style={{ backgroundColor: data.fill }}
                                                        />
                                                        <span>{data.category}</span>
                                                    </div>
                                                    <div className="pl-4.5">
                                                        <div className="font-bold text-secondary text-sm">
                                                            {formatRupiah(data.revenue)}
                                                        </div>
                                                        <div className="text-slate-500 font-medium text-[11px]">
                                                            {data.percentage}%
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Pie
                                        data={breakdown}
                                        dataKey="revenue"
                                        nameKey="category"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={3}
                                        shape={(props)=> (
                                            <Sector {...props} fill={props.payload?.fill || props.fill}/>
                                        )}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                                Total
                            </span>
                            <span className="text-sm font-bold text-secondary">
                                {(totalRevenue/1000000).toFixed(1)}M
                            </span>
                        </div>
                    </div>
                    <div className="md:col-span-5 space-y-3.5 pl-2">
                        {breakdown.map((item)=> (
                            <div key={item.category} className="flex items-center gap-2.5 text-sm">
                                <span className="h-3 w-3 rounded-xs shrink-0" style={{backgroundColor:item.fill}}/>
                                <span className="font-medium text-secondary truncate">
                                    {item.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </CardContent>
        </Card>
        </>
    )
}