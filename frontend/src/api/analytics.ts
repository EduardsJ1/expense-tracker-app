import axios from "axios";
import type {PredictionSummary} from "../types/analytics";


const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials:true
});

export const getFinancePrediction = async (params?:{months:number}) =>{
    const response = await API.get<PredictionSummary>("/transactions/prediction",{params:params});
    //console.log(response.data);
    return response.data;
}