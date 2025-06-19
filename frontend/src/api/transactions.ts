import axios from "axios";
import type { TransactionData,createTransactionType, Summary,SummaryFilters, Transaction } from "../types/transactions";

const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true
});

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
    API.get<TransactionData>("/transactions",{params});


export const getSingleTransaction = async (id:number)=>{
    const response = await API.get<TransactionData>(`/transactions/${id}`);
    return response;
}

export const createTransaction = async (data:createTransactionType) =>{
    const response = await API.post('/transactions',data);
    return response;
}
export const updateTransaction = async (data:createTransactionType,id:number)=>{
    const response = await API.patch(`/transactions/${id}`,data);
    return;
}
export const getSummary = async (params?:SummaryFilters) =>{
    const response = await API.get<Summary>("/transactions/summary",{params});
    //console.log(response.data);
    return response.data;
}

export const deleteTransaction = async (id:number)=>{
    const response = await API.delete(`/transactions/${id}`);
    return response;
}
///delete patch ect