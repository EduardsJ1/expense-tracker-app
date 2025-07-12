import type {CategoryFilters} from "../types/category"
import api from ".";
export const getTransactionCategories= async (filters?:CategoryFilters)=>{
    const response = await api.get<string[]>(`/transactions/categories`, { params: filters });
    return response.data;
}