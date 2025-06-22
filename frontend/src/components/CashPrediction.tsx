import PredictionChart from "./charts/PredictionChart";
import type {PredictionSummary} from "../types/analytics";
import useDebounce from "../hooks/useDebounce";
import TotalBalance from "./TotalBalance";
import DataCard from "./ui/DataCard";
import Input from "./ui/Input";
import { useEffect, useState } from "react";
function CashPrediciton({predictionSummary,months,onMonthsChange}:{predictionSummary:PredictionSummary|null,months:number,onMonthsChange:(months:number)=>void}){
    const [monthsInputValue,setMonths]=useState("12");
    const debouncedMonths = useDebounce(Number(monthsInputValue),1000);
    const [monthError,setMonthError]=useState(false);
    const [monthErrorMsg,setMonthErrorMsg]=useState('');


    useEffect(()=>{
        if(debouncedMonths<3){
            setMonthError(true);
            setMonthErrorMsg("Min 3 months")
        }else if (debouncedMonths>48){
            setMonthError(true);
            setMonthErrorMsg("Max 48 months")
        }else{
            onMonthsChange(debouncedMonths);
            setMonthError(false);
        }
    },[debouncedMonths,onMonthsChange]);

    const handleMonthsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonths(e.target.value);
    }
    
    return(
        <div className="border border-neutral-200 rounded-2xl bg-white shadow-xl px-5 py-2">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl">Financial Predictions</h2>
                    <p className="text-neutral-500">Based on your recurring transactions in {months} months</p>
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
            {predictionSummary ? (
            <div>
                <div className="h-60">
                    <PredictionChart data={predictionSummary.projectedData} />
                </div>
                <div className="flex gap-5 flex-wrap mt-5 mb-5">
                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Current Balance</DataCard.Title>
                        <DataCard.Value className={` ${predictionSummary.currentBalance>0?"text-green-800":"text-red-800"}`}>$ {predictionSummary.currentBalance}</DataCard.Value>
                    </DataCard>

                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Monthly Average Income</DataCard.Title>
                        <DataCard.Value className="text-green-800">+$ {Math.round(predictionSummary.summary.monthlyAverageIncome)}</DataCard.Value>
                    </DataCard>

                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Monthly Average Expense</DataCard.Title>
                        <DataCard.Value className="text-red-800">-$ {Math.round(predictionSummary.summary.monthlyAverageExpense)}</DataCard.Value>
                    </DataCard>

                    <DataCard className="flex-1 min-w-65">
                        <DataCard.Title>Future Balance</DataCard.Title>
                        <DataCard.Value className={`${predictionSummary.summary.finalBalance>0?"text-green-800":"text-red-800"}`}>$ {predictionSummary.summary.finalBalance}</DataCard.Value>
                        <DataCard.Description>Balance in {months} months</DataCard.Description>
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