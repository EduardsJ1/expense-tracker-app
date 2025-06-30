
import Navbar from "../components/Navbar"
import CashPrediciton from "../components/CashPrediction";
import { useState } from "react";
import PieChart from "../components/charts/PieChart";
//hooks
import useAnalytics from "../hooks/useAnalytics";
import { useCategorySummary } from "../hooks/useCategories";
import CategoryAnalytics from "../components/CategoryAnalytics";
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
        <div className="pt-20 max-w-[1200px] m-auto px-5 pb-30">
            <h1>Analytics</h1>
            <div className="mb-10">
                <CashPrediciton predictionSummary={predictionSummary||null} months={months} onMonthsChange={(months)=>setMonths(months)}/>
            </div>
            <div>
                <CategoryAnalytics/>
            </div>
            
        </div>
        </>
    )
}

export default Analytics;