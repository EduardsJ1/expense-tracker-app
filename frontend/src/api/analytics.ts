import type {PredictionSummary,CategorySummary} from "../types/analytics";
import api from ".";

export const getFinancePrediction = async (params?:{months:number}) =>{
    const response = await api.get<PredictionSummary>("/transactions/prediction",{params:params});
    //console.log(response.data);
    return response.data;
}



export interface CategorySummaryFilters{
    startDate?:string,
    endDate?:string,
    type?:"income"|"expense",
    sortBy?:"totalAmount"|"count"|"category",
    orderBy?:"asc"|"desc",
    limit?:number|"all"
}


export const getCategorySummary = async (filters?:CategorySummaryFilters)=>{
    const response = await api.get<CategorySummary[]>(`/transactions/summary/categories`,{params:filters});
    return response.data;
}