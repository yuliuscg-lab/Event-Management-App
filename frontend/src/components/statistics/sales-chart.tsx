import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useSalesChart } from "@/hooks/use-dashboard"
import { Timeframe } from "@/types/dashboard.types"
import { Spinner } from "../ui/spinner"
import { formatRupiah } from "@/utils/format"
interface SalesChartProps {
    timeframe: string
}

const chartConfig = {
    sales: {
        label: "Penjualan",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export const SalesChart = ({ timeframe }:SalesChartProps) => {
    const { data: chartData, isLoading } = useSalesChart(timeframe as Timeframe);
    const safeChartData = useMemo(() => (Array.isArray(chartData) ? chartData : []), [chartData]);
    const totalSales = useMemo(() => {
        return safeChartData.reduce((acc, curr) => acc + curr.sales, 0);
    }, [safeChartData]);
    
    return (
        <Card className="col-span-2 bg-white pt-6 md:pl-4 pl:2 md:pr-6 pr-2 shadow-sm rounded-xl h-110">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-secondary">
                        Ticket Sales
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                        Total pendapatan tiket periode ini
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                        {isLoading?(<Spinner/>):formatRupiah(totalSales)}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={safeChartData} margin={{top:10, right:10, left:0, bottom:0}}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/>
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tick={{fill: "var(--muted-foreground)"}}
                                axisLine={false}
                                tickMargin={8}
                                className="text-xs text-slate-500 font-medium"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value)=> value >= 100000 ? `${(value/100000).toFixed(0)}Jt`:`${(value/1000).toFixed(0)}Ribu`}
                                className="text-xs text-slate-500 font-medium"/>
                            <Tooltip content={
                                <ChartTooltipContent formatter={(value) => formatRupiah(Number(value))}/>
                            }/>
                            <Area 
                                type="monotone"
                                dataKey="sales"
                                stroke="var(--primary)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#salesGradient)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}