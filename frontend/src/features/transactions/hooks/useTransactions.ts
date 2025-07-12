import { useEffect, useState } from "react";
import {getTransactions,getSingleTransaction,getSummary} from "../api/transactions";
import type {TransactionData,Summary,SummaryFilters,TransactionFilters} from "../types/transactions";




export const useTransactions = (filters?:TransactionFilters) =>{
    const [transactions,setTransactions]=useState<TransactionData>();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);    
    
    useEffect(() => {
        setLoading(true);
        
        
        getTransactions(filters)
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