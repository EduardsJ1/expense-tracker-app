import axios from "axios";
import type { ReccurringData, updateReccuringType,CreateReccurringType } from "../types/reccurring";
export interface ParamFilters{
    form?:string,
    to?:string,
    type?:string,
    category?:string,
    maxAmount?:number,
    minAmount?:number,
    sortBy?:string,
    sortOrder?:string,
    page?:number,
    items?:number
}

const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true
});


export const getReccurring=async (params:ParamFilters)=>{
    const result = await API.get<ReccurringData>("/recurring",{params});
    return result;
}

export const updateReccuring=async (id:number,update:updateReccuringType)=>{
    //console.log("sending this update",update);
    const result = await API.patch(`/recurring/${id}`,update);
    return result;
}

export const createReccurring = async (data:CreateReccurringType) =>{
    const response = await API.post('/recurring',data);
    return response;
}

export const deleteReccuring=async (id:number)=>{
    const result = await API.delete(`/recurring/${id}`);
    return result;
}