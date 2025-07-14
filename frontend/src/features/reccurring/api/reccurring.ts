
import type { ReccurringData, updateReccuringType,CreateReccurringType,RecurringFilters } from "../types/reccurring";
import api from "../../../api";



export const getReccurring=async (params?:RecurringFilters)=>{
    const result = await api.get<ReccurringData>("/recurring",{params});
    return result;
}

export const updateReccuring=async (id:number,update:updateReccuringType)=>{
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