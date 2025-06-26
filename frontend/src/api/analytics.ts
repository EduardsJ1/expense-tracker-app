import axios from "axios";
import type {PredictionSummary,CategorySummary} from "../types/analytics";


const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true
});

export const getFinancePrediction = async (params?:{months:number}) =>{
    const response = await API.get<PredictionSummary>("/transactions/prediction",{params:params});
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
    const response = await API.get<CategorySummary[]>(`/transactions/summary/categories`,{params:filters});
    return response.data;
}