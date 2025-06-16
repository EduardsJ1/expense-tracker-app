
export interface UpdateRecurring{
    amount?: number;
    type?: 'income' | 'expense';
    category?: string;
    note?: string;
    recurrence_type?: 'calendar' | 'hourly';
    interval_hours?: number;
    calendar_unit?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    start_date?: string;
    end_date?: string;
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