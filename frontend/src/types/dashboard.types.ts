
export type Timeframe = "1D" | "1W" | "1M" | "YTD";

export interface DashboardStats {
    totalRevenue:number;
    totalRevenueGrowth:number;
    totalTicketSold:number;
    totalTicketSoldGrowth:number;
    totalEvents:number;
    totalActiveEvents:number;
    totalActiveEventsGrowth:number;
}

export interface SalesChartPoint {
    label:string;
    sales:number;
}

export interface RevenueStreamBreakdownItem {
    category:string;
    revenue:number;
    percentage:number;
    fill:string;
}

export interface RevenueStreamData {
    totalRevenue:number,
    breakdown: RevenueStreamBreakdownItem[];
}