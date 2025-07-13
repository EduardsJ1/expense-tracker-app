import CashPrediciton from "../features/analytics/module/CashPrediction";
import { useState } from "react";
//hooks
import useAnalytics from "../hooks/useAnalytics";
import CategoryAnalytics from "../features/analytics/module/CategoryAnalytics";
import FinanceHistory from "../features/analytics/module/FinanceHistory";

import MainLayot from "../layouts/MainLayout";
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
       <MainLayot>
        <div className="pt-10 max-w-[1200px] m-auto px-5 pb-30">
            <div className="mb-10">
                <FinanceHistory/>
            </div>
            <div className="mb-10">
                <CashPrediciton predictionSummary={predictionSummary||null} months={months} onMonthsChange={(months)=>setMonths(months)}/>
            </div>
            <div>
                <CategoryAnalytics/>
            </div>
            
        </div>
        </MainLayot>
    )
}

export default Analytics;