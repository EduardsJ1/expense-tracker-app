import type {PredictionSummary} from "../types/analytics";
import api from "../../../api";

export const getFinancePrediction = async (params?:{months:number}) =>{
    const response = await api.get<PredictionSummary>("/transactions/prediction",{params:params});
    //console.log(response.data);
    return response.data;
}


