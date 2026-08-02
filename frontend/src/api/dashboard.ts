import { api } from "@/lib/axios";
import { DashboardStats, RevenueStreamData, SalesChartPoint, Timeframe } from "@/types/dashboard.types";
import { ApiResponse } from "@/types/auth.types";


export async function fetchDashboardStats(timeframe: Timeframe): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>("/dashboards/stats-card-data", {
        params: { timeframe },
    });

    return response.data.data!;
}

export async function fetchSalesChart(timeframe: Timeframe): Promise<SalesChartPoint[]> {
    const response = await api.get<ApiResponse<SalesChartPoint[]>>("/dashboards/sales-chart-data", {
        params: { timeframe },
    });

    return response.data.data ?? [];
}

export async function fetchRevenueStream(timeframe: Timeframe): Promise<RevenueStreamData> {
    const response = await api.get<ApiResponse<RevenueStreamData>>("/dashboards/revenue-stream-data", {
        params: { timeframe },
    });

    return response.data.data!;
}