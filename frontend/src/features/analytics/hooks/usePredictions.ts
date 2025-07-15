import { useEffect, useState } from "react"
import type {PredictionSummary} from "../types/analytics";
import {getFinancePrediction} from "../api/analytics";
const usePredictions=(months:number=12,refreshKey?:number)=>{
    const [predictionSummary,setPredictionSummary]=useState<PredictionSummary>();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState<string | null>();

    useEffect(()=>{
        const fetchPrediction = async ()=>{
            try{
                setLoading(true);
                setError(null);
                const data = await getFinancePrediction({months});
                setPredictionSummary(data);
            }catch(error){
                setError(error instanceof Error ? error.message:"Couldnt fetch prediction data");
            }finally{
                setLoading(false);
            }
        }

        fetchPrediction();
    },[months,refreshKey]);

    return {predictionSummary,loading,error};
}

export default usePredictions;