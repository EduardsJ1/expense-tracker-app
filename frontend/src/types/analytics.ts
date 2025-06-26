export interface ProjectedDataPoint {
    date: string;
    income: number;
    expense: number;
    balance: number;
}

// Summary statistics
export interface PredictionSummaryStats {
    totalProjectedIncome: number;
    totalProjectedExpense: number;
    finalBalance: number;
    monthlyAverageIncome: number;
    monthlyAverageExpense: number;
}

// Main interface using the smaller interfaces
export interface PredictionSummary {
    currentBalance: number;
    projectedData: ProjectedDataPoint[];
    summary: PredictionSummaryStats;
}

export interface CategorySummary{
    category:string,
    totalamount:number,
    count:number,
    precentage:number
}