import { fetchDashboardStats, fetchRevenueStream, fetchSalesChart } from "@/api/dashboard";
import { Timeframe } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";


export function useDashboardStats(timeframe: Timeframe) {
    return useQuery({
        queryKey: ["dashboard", "stats", timeframe],
        queryFn: () => fetchDashboardStats(timeframe),
        staleTime: 60_000,
    });
}

export function useSalesChart(timeframe: Timeframe) {
    return useQuery({
        queryKey: ["dashboard","sales-chart", timeframe],
        queryFn: () => fetchSalesChart(timeframe),
        staleTime: 60_000,
    });
}

export function useRevenueStream(timeframe: Timeframe) {
    return useQuery({
        queryKey: ["dashboard","revenue-stream", timeframe],
        queryFn: () => fetchRevenueStream(timeframe),
        staleTime: 60_000,
    });
}