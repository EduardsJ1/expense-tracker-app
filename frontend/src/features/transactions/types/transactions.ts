
export interface TransactionData {
    currentpage:number,
    totalPages:number,
    data:{
        id:number,
        user_id:number,
        amount:number,
        type:"expense"|"income",
        category:string,
        note?:string|null,
        created_at:string,
        updated_at:string,
        recurring_id?:number|null
    }[]
}

export interface SummaryData {
    period: string,
    income: number,
    expense: number,
    balance: number
}

export interface Summary extends SummaryData {
    totalIncome: number,
    totalExpense: number,
    totalBalance: number,
    data?: SummaryData[]
}

export interface Transaction{
    id:number,
    user_id:number,
    amount:number,
    type:"expense"|"income",
    category:string,
    note?:string|null,
    created_at:string,
    updated_at:string,
    recurring_id?:number|null
}

export interface SummaryFilters{
    groupBy?:null|"year"|"month"|"day",
    from?:null|Date,
    to?:null|Date,
}

export interface createTransactionType{
    user_id:number,
    amount:number,
    type:"expense"|"income",
    category:string,
    note?:string|null,
}

export interface TransactionFilters {
    page?: number;
    items?: number;
    from?: string;
    to?: string;
    type?: null | "income" | "expense";
    category?: string;
    maxAmount?: number;
    minAmount?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    hasNote?: boolean;
    refreshKey?:any,
}