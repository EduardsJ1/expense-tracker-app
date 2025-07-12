
import { useEffect, useState } from 'react';
import type {CategoryFilters} from '../types/category';
import {getTransactionCategories} from '../api/category';
import type {CategorySummaryFilters} from "../api/analytics";
import type {CategorySummary} from "../types/analytics";
import { getCategorySummary } from '../api/analytics';


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

export const useCategorySummary=(filters?:CategorySummaryFilters)=>{
    const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error,setError]= useState<string|null>(null);

    useEffect(()=>{
        const fetchCategoryData= async ()=>{
            setLoading(true);
            setError(null);
            try{
                const data = await getCategorySummary(filters);
                setCategoryData(data);
            }catch(error){
                console.log(error);
                setError(error instanceof Error ? error.message:"Failed to get Category Data");
            }finally{
                setLoading(false);
            }
        }

        fetchCategoryData();
    },[filters?.startDate,
        filters?.endDate,
        filters?.type,
        filters?.sortBy,
        filters?.orderBy,
        filters?.limit]);

    return {categoryData,loading,error}
}