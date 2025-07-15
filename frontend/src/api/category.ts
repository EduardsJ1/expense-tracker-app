import type {CategoryFilters, CategorySummaryFilters, CategorySummary} from "../types/category"
import api from ".";
export const getTransactionCategories= async (filters?:CategoryFilters)=>{
    const response = await api.get<string[]>(`/transactions/categories`, { params: filters });
    return response.data;
}

export const getCategorySummary = async (filters?:CategorySummaryFilters)=>{
    const response = await api.get<CategorySummary[]>(`/transactions/summary/categories`,{params:filters});
    return response.data;
}