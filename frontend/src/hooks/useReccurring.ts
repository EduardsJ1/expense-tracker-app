import type {ReccurringData} from "../types/reccurring";
import type {ParamFilters} from "../api/reccurring";
import { getReccurring } from "../api/reccurring";
import { useEffect, useState } from "react";

interface RefreshParams extends ParamFilters{
    refreshKey?:number
}
export const useReccurring=(filters:RefreshParams)=>{
    const [reccuringData,setReccurring]=useState<ReccurringData>();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    
    useEffect(()=>{
        setLoading(true);

        getReccurring(filters).then((res)=>{
            setReccurring(res.data);
            setLoading(false);
        }).catch(()=>{
            setLoading(false);
            setError("Could not get reccurring transactions");
        })

    },[JSON.stringify(filters)])

    return {reccuringData,loading,error};
}