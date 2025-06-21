
export interface UpdateRecurring{
    amount?: number;
    type?: 'income' | 'expense';
    category?: string;
    note?: string;
    recurrence_type?: 'daily' | 'weekly'|'monthly'|'yearly'|'custom';
    custom_unit?: 'hours' | 'days' | 'weeks' | 'months';
    custom_interval?:number;
    start_date?: string;
    is_active?: boolean;
}

export interface PredictionDataPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface FinancialPrediction {
  currentBalance: number;
  projectedData: PredictionDataPoint[];
  summary: {
    totalProjectedIncome: number;
    totalProjectedExpense: number;
    finalBalance: number;
    monthlyAverageIncome: number;
    monthlyAverageExpense: number;
  };
}