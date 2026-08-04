export interface SalesDataPoint {
    date:string;
    sales:number;
}

export const formatRupiah = (value:number) => {
    return new Intl.NumberFormat("id-ID", {
        style:"currency",
        currency:"IDR",
        maximumFractionDigits:0,
    }).format(value);
};

export const mockSalesData: SalesDataPoint[] = [
    { date: "2026-08-01 08:00", sales: 450000 },
    { date: "2026-08-01 10:00", sales: 1200000 },
    { date: "2026-08-01 12:00", sales: 2500000 },
    { date: "2026-08-01 14:00", sales: 1800000 },
    { date: "2026-08-01 16:00", sales: 3100000 },

    { date: "2026-07-26", sales: 2500000 },
    { date: "2026-07-27", sales: 4100000 },
    { date: "2026-07-28", sales: 3200000 },
    { date: "2026-07-29", sales: 5000000 },
    { date: "2026-07-30", sales: 6200000 },
    { date: "2026-07-31", sales: 4800000 },

    { date: "2026-01-15", sales: 15000000 },
    { date: "2026-02-15", sales: 22000000 },
    { date: "2026-03-15", sales: 18000000 },
    { date: "2026-04-15", sales: 29000000 },
    { date: "2026-05-15", sales: 35000000 },
    { date: "2026-06-15", sales: 42000000 },
    { date: "2026-07-15", sales: 38000000 },
]

export interface CategoryRevenue {
    category: string
    revenue: number
    color?: string
}

export const rawCategoryData: Record<string, CategoryRevenue[]> = {
    "1D": [
        { category: "VIP Festival", revenue: 5200000 },
        { category: "CAT 1", revenue: 3800000 },
        { category: "CAT 2", revenue: 1500000 },
        { category: "Early Bird", revenue: 1400000 },
    ],
    "1W": [
        { category: "VIP Festival", revenue: 12500000 },
        { category: "CAT 1 (Presale)", revenue: 8400000 },
        { category: "CAT 2", revenue: 4200000 },
        { category: "VVIP Booth", revenue: 3100000 },
        { category: "Early Bird", revenue: 2100000 },
        { category: "Student Pass", revenue: 1300000 },
    ],
    "1M": [
        { category: "VIP Pass", revenue: 42000000 },
        { category: "CAT 1", revenue: 25000000 },
        { category: "CAT 2", revenue: 15000000 },
        { category: "Early Bird", revenue: 8000000 },
        { category: "VVIP Lounge", revenue: 3000000 },
        { category: "Group Bundle", revenue: 2000000 },
        { category: "Student Ticket", revenue: 1000000 },
    ],
    YTD: [
        { category: "VIP Pass", revenue: 85000000 },
        { category: "CAT 1", revenue: 55000000 },
        { category: "CAT 2", revenue: 32000000 },
        { category: "VVIP Lounge", revenue: 18000000 },
        { category: "Early Bird", revenue: 12000000 },
        { category: "Group Bundle", revenue: 5000000 },
        { category: "Student Pass", revenue: 2900000 },
    ],
}

const COLOR_PALETTE = [
    "hsl(var(--primary))",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#94a3b8", 
]

export const getRevenueStreamData = (timeframe:string) => {
    const items = rawCategoryData[timeframe]||[];

    const sorted = [...items].sort((a,b)=> b.revenue-a.revenue);

    let result: CategoryRevenue[] = [];

    if (sorted.length > 5) {
        const top4 = sorted.slice(0,4);
        const others = sorted.slice(4);
        const othersTotal = others.reduce((acc,curr)=> acc+curr.revenue, 0);
        
        result = [...top4, 
            { 
                category: "Lainnya",
                revenue: othersTotal,
            }]} else {
                result = sorted;
    }

    const totalRevenue = result.reduce((acc,curr)=>acc+curr.revenue,0);

    return {
        totalRevenue,
        breakdown: result.map((item,index)=> ({
            ...item,
            percentage: ((item.revenue/totalRevenue)*100).toFixed(1),
            fill:
            item.category === "Lainnya" ? COLOR_PALETTE[4]:COLOR_PALETTE[index%4]
        })),
    };

    }

export const filterSalesData = (timeframe: string) => {

    switch (timeframe) {
        case "1D":
        return [
            { label: "08:00", sales: 450000 },
            { label: "10:00", sales: 1200000 },
            { label: "12:00", sales: 2500000 },
            { label: "14:00", sales: 1800000 },
            { label: "16:00", sales: 3100000 },
            { label: "18:00", sales: 2900000 },
        ]

        case "1W":
        return [
            { label: "26 Jul", sales: 2500000 },
            { label: "27 Jul", sales: 4100000 },
            { label: "28 Jul", sales: 3200000 },
            { label: "29 Jul", sales: 5000000 },
            { label: "30 Jul", sales: 6200000 },
            { label: "31 Jul", sales: 4800000 },
            { label: "01 Aug", sales: 5800000 },
        ]

        case "1M":
        return [
            { label: "Minggu 1", sales: 18500000 },
            { label: "Minggu 2", sales: 24000000 },
            { label: "Minggu 3", sales: 21000000 },
            { label: "Minggu 4", sales: 31500000 },
        ]

        case "YTD":
        return [
            { label: "Jan", sales: 15000000 },
            { label: "Feb", sales: 22000000 },
            { label: "Mar", sales: 18000000 },
            { label: "Apr", sales: 29000000 },
            { label: "Mei", sales: 35000000 },
            { label: "Jun", sales: 42000000 },
            { label: "Jul", sales: 38000000 },
            { label: "Agu", sales: 11900000 },
        ]

        default:
            return []
    }

}