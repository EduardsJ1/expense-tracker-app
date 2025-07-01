import type { TransactionData,createTransactionType, Summary,SummaryFilters, Transaction } from "../types/transactions";
import api from ".";
export const getTransactions = (
    params?:{
        page?:number,
        items?:number,
        from?:string,
        to?:string,
        type?:null|"income"|"expense",
        category?:string,
        maxAmount?:number,
        minAmount?:number,
        sortBy?:string,
        sortOrder?:string,
        search?:string,
        hasNote?:boolean
    })=> 
api.get<TransactionData>("/transactions",{params});


export const getSingleTransaction = async (id:number)=>{
    const response = await api.get<TransactionData>(`/transactions/${id}`);
    return response;
}

export const createTransaction = async (data:createTransactionType) =>{
    const response = await api.post('/transactions',data);
    return response;
}
export const updateTransaction = async (data:createTransactionType,id:number)=>{
    const response = await api.patch(`/transactions/${id}`,data);
    return;
}
export const getSummary = async (params?:SummaryFilters) =>{
    const response = await api.get<Summary>("/transactions/summary",{params});
    //console.log(response.data);
    return response.data;
}

export const deleteTransaction = async (id:number)=>{
    const response = await api.delete(`/transactions/${id}`);
    return response;
}


export interface CategoryFilters{
    search?:string,
    items?:number,
    type?:"income"|"expense"
}

export const getTransactionCategories= async (filters?:CategoryFilters)=>{
    const response = await api.get<string[]>(`/transactions/categories`, { params: filters });
    return response.data;
}