import { useEffect, useState } from "react";
import {getTransactions,getSingleTransaction,getSummary} from "../api/transactions";
import type {TransactionData,Summary,SummaryFilters} from "../types/transactions";



export interface FileterOptions{
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
    hasNote?:boolean,
    refreshKey?:any
}

export const useTransactions = (filters:FileterOptions) =>{
    const [transactions,setTransactions]=useState<TransactionData>();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);    
    
    useEffect(() => {
        setLoading(true);
        
        // Filter out null and undefined values before sending to API
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined)
        );
        
        getTransactions(cleanFilters)
            .then((res) => {
                //console.log(res.data);
                setTransactions(res.data);
                setLoading(false);
            }).catch(() => {
                setError("Could not get transactions");
                setLoading(false);
            });
    }, [JSON.stringify(filters)]);

    return {transactions,loading,error};
}


export const useSummary = (filters:SummaryFilters)=>{
    const [summary,setSummary]=useState<Summary>();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<string|null>(null);

    useEffect(()=>{
        setLoading(true);

        getSummary(filters).then((res)=>{
            setSummary(res);
            setLoading(false);
        }).catch(()=>{
            setLoading(false);
        })
    },[JSON.stringify(filters)])

    return{summary,loading,error};
}