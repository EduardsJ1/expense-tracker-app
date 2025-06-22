
import Navbar from "../components/Navbar"
import useAnalytics from "../hooks/useAnalytics";
import PredictionChart from "../components/charts/PredictionChart";
import CashPrediciton from "../components/CashPrediction";
import { useState } from "react";
function Analytics(){
    const [months,setMonths]=useState<number>(12);
    const [refreshKey,setRefreshKey]=useState(0);
    const {predictionSummary,loading,error}=useAnalytics(months);

    const refreshPredictions=()=>{
        setRefreshKey(refreshKey+1);
    }

    const monthsChange=(value:number)=>{
        setMonths(value);
        refreshPredictions();
    }
    
    return(
        <>
        <Navbar/>
        <div className="pt-20 max-w-[1200px] m-auto">
            <h1>Analytics</h1>
            <div className="">
                <CashPrediciton predictionSummary={predictionSummary||null} months={months} onMonthsChange={(months)=>setMonths(months)}/>
            </div>
            
        </div>
        </>
    )
}

export default Analytics;