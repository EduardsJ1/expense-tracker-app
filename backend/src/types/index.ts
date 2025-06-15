
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