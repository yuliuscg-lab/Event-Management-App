
export interface PaidOrderRow {
    createdAt: Date;
    finalPrice: number;
}

export interface PaidOrderWithCategoryRow {
    finalPrice: number;
    event: { category: {category: string}};
}

export type Timeframe = "1D"|"1W"|"1M"|"YTD";