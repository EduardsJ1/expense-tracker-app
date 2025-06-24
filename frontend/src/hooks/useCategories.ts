
import { useEffect, useState } from 'react';
import type {CategoryFilters} from '../api/transactions';
import {getTransactionCategories} from '../api/transactions';

export const useCategorySuggestions=(filters?:CategoryFilters)=>{
    const [categories,setCategories]=useState<string[]>([]);
    const [loading,setLoading]=useState(false);
    const [error,setError] = useState<string|null>(null);
    useEffect(()=>{
        const fetchCategories=async()=>{
            setLoading(true);
            setError(null);
            try{
                const data= await getTransactionCategories(filters);
                setCategories(data);
            }catch(error){
                console.log(error);
                setError(error instanceof Error ? error.message:"Failed to get Categories");
            }finally{
                setLoading(false);
            }
        }

        fetchCategories();
    },[filters]);

    return {categories,loading,error}
}

