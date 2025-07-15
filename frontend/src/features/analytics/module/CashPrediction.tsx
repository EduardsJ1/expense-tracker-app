import PredictionChart from "../components/charts/PredictionChart";
import useDebounce from "../../../hooks/useDebounce";
import DataCard from "../../../components/ui/DataCard";
import Input from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import usePredictions from "../hooks/usePredictions";
function CashPrediciton(){
    const [monthsInputValue,setMonths]=useState("12");
    const debouncedMonths = useDebounce(Number(monthsInputValue),1000);
    const [monthError,setMonthError]=useState(false);
    const [monthErrorMsg,setMonthErrorMsg]=useState('');
    const [filters,setFilters]=useState<number>(12)

    const {predictionSummary:predictionData,loading,error}=usePredictions(filters);

    useEffect(()=>{
        if(debouncedMonths<3){
            setMonthError(true);
            setMonthErrorMsg("Min 3 months")
        }else if (debouncedMonths>48){
            setMonthError(true);
            setMonthErrorMsg("Max 48 months")
        }else{
            setFilters(debouncedMonths)
            setMonthError(false);
        }
    },[debouncedMonths]);

    const handleMonthsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonths(e.target.value);
    }
    
    const percentageChange = calculateProcentage(predictionData?.currentBalance||0, predictionData?.summary.finalBalance||0);
    return(
        <div className="border border-neutral-200 rounded-2xl bg-white shadow-xl px-5 py-2">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl">Financial Predictions</h2>
                    <p className="text-neutral-500">Based on your recurring transactions in {filters} months</p>
                </div>
                <div className="w-30">
                    <Input
                         label="Months"
                         inputSize="sm"
                         value={monthsInputValue}
                         onChange={handleMonthsInputChange}
                         error={monthError}
                         errorMessage={monthErrorMsg}
                    />
                </div>
            </div>
            {predictionData ? (
            <div>
                <div className="h-100 px-5">
                    <PredictionChart data={predictionData.projectedData} dataKey={["income","expense","balance"]} colors={["#1f6e2c","#630d0d"]} xLabelKey="date" dateKey="date"/>
                </div>
                <div className="flex gap-5 flex-wrap mt-5 mb-5">
                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Current Balance</DataCard.Title>
                        <DataCard.Value className={` ${predictionData.currentBalance>0?"text-green-800":"text-red-800"}`}>$ {predictionData.currentBalance.toFixed(2)}</DataCard.Value>
                    </DataCard>

                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Monthly Average Income</DataCard.Title>
                        <DataCard.Value className="text-green-800">+$ {predictionData.summary.monthlyAverageIncome.toFixed(2)}</DataCard.Value>
                    </DataCard>

                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Monthly Average Expense</DataCard.Title>
                        <DataCard.Value className="text-red-800">-$ {predictionData.summary.monthlyAverageExpense.toFixed(2)}</DataCard.Value>
                    </DataCard>

                    
                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Future Balance<p className="text-sm text-neutral-500">in {filters} months</p></DataCard.Title>
                        <DataCard.Value className={`${predictionData.summary.finalBalance>0?"text-green-800":"text-red-800"}`}>$ {predictionData.summary.finalBalance.toFixed(2)}</DataCard.Value>
                        <DataCard.Description className={`font-medium ${percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)} %
                        </DataCard.Description>
                    </DataCard>
                </div>
            </div>
            ) : (
            <div>
                <h2>No data Available</h2>
            </div>
            )}
        </div>
    )
}

export default CashPrediciton;


const calculateProcentage = (previousValue: number, currentValue: number): number => {
    if (previousValue === 0) {
        return currentValue >= 0 ? 100 : -100;
    }
    
    const change = currentValue - previousValue;
    
    if (previousValue < 0) {
        if (currentValue >= 0) {
            return Math.abs((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        } else {
            return (change / Math.abs(previousValue)) * 100;
        }
    } else {
        return (change / previousValue) * 100;
    }
}