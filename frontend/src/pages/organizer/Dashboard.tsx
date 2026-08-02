import { useState } from "react"
import { StatsCard } from "@/components/statistics/stat-card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { SalesChart } from "@/components/statistics/sales-chart"
import { RevenueStreamCard } from "@/components/statistics/revenue-stream"
import { Timeframe } from "@/types/dashboard.types"

const timeframes: Timeframe[] = ["1D", "1W", "1M", "YTD"]

export const Dashboard = () => {
    const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1D")

    return (
        <section id="portal-dashboard">
            <div>
                <h1 className="text-3xl font-semibold text-secondary">Organizer Dashboard</h1>
                <p className="text-secondary mb-4">Performance Snapshots</p>
            </div>
            <div className="mb-8">
                <StatsCard timeframe={activeTimeframe} />
            </div>
            <div className="flex w-full items-end justify-start mb-4">
                <ButtonGroup>
                    {timeframes.map((tf) => {
                        const isActive = activeTimeframe === tf
                        return (
                            <Button
                                key={tf}
                                variant={isActive ? "default" : "outline"}
                                onClick={() => setActiveTimeframe(tf)}
                                className={`w-15 font-semibold cursor-pointer transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-slate-50! hover:bg-slate-200! text-secondary"
                                }`}
                            >
                                {tf}
                            </Button>
                        )
                    })}
                </ButtonGroup>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <SalesChart timeframe={activeTimeframe} />
                </div>
                <div className="lg:col-span-5">
                    <RevenueStreamCard timeframe={activeTimeframe} />
                </div>
            </div>
        </section>
    )
}