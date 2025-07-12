import type { TransactionData,createTransactionType, Summary,SummaryFilters, Transaction, TransactionFilters } from "../types/transactions";
import api from "../../../api/index";
export const getTransactions = (
    params?:TransactionFilters)=> api.get<TransactionData>("/transactions",{params}
    );


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
