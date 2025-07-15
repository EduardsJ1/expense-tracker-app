import CashPrediciton from "./CashPrediction";
import CategoryAnalytics from "./CategoryAnalytics";
import FinanceHistory from "./FinanceHistory";
function AnalyticsDashboard(){
    return(
        <div className="space-y-10 mb-10 mt-10">
            <FinanceHistory/>
            <CashPrediciton/>
            <CategoryAnalytics/>
        </div>
    )
}

export default AnalyticsDashboard;