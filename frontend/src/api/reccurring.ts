
import type { ReccurringData, updateReccuringType,CreateReccurringType } from "../types/reccurring";
import api from ".";
export interface ParamFilters{
    form?:string,
    to?:string,
    type?:string,
    category?:string,
    maxAmount?:number,
    minAmount?:number,
    sortBy?:string,
    sortOrder?:string,
    is_active?:boolean,
    search?:string,
    page?:number,
    items?:number
}



export const getReccurring=async (params:ParamFilters)=>{
    const result = await api.get<ReccurringData>("/recurring",{params});
    return result;
}

export const updateReccuring=async (id:number,update:updateReccuringType)=>{
    //console.log("sending this update",update);
    const result = await api.patch(`/recurring/${id}`,update);
    return result;
}

export const createReccurring = async (data:CreateReccurringType) =>{
    const response = await api.post('/recurring',data);
    return response;
}

export const deleteReccuring=async (id:number)=>{
    const result = await api.delete(`/recurring/${id}`);
    return result;
}