import PredictionChart from "./charts/PredictionChart";
import DataCard from "./ui/DataCard";
import {useSummary} from "../hooks/useTransactions";
import { useState } from "react";
import TabStyleInput from "./ui/TabStyleInput";
import type {SummaryData, SummaryFilters} from "../types/transactions"
function calculateAverage(data:SummaryData[],datakey:"income"|"expense"){
    const datalenght = data.length;
    let sum = 0;
    if(datakey==="income"){
        for (let item of data) {
            sum+=item.income;
        }
    }else{
        for (let item of data) {
            sum+=item.expense;
        }
    }

    return (sum/datalenght).toFixed(2);

}


function FinanceHistory(){
    const currentDate = new Date();
    const currentMonthFirstDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1));

    const [filters,setFilters]=useState<SummaryFilters>({groupBy:"day",from:currentMonthFirstDay,to:null})
    const {summary,loading,error} = useSummary(filters);
    const [timeFrameValue,setTimeFrameValue]=useState<"1M"|"3M"|"6M"|"1Y"|"All">("1M");
    const [titleDescription,setTitleDescription]=useState("This Month");
    console.log(summary)
    const handleTimeFrame=(value:string)=>{
        switch(value){
            case "1M":
                setTimeFrameValue("1M");
                setTitleDescription("This Month");
                setFilters({groupBy:"day",from:currentMonthFirstDay,to:null})
                break;
            case "3M":
                setTimeFrameValue("3M");
                setTitleDescription("In 3 Months");
                setFilters({groupBy:"month",from:new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth()-3, 1)),to:null});
                break;
            case "6M":
                setTimeFrameValue("6M");
                setTitleDescription("In 6 Months");
                setFilters({groupBy:"month",from:new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth()-6, 1)),to:null});
                break;
            case "1Y":
                setTimeFrameValue("1Y");
                setTitleDescription("This Year");
                setFilters({groupBy:"month",from:new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth()-12, 1)),to:null});
                break;
            case "All":
                setTimeFrameValue("All");
                setTitleDescription("All Time");
                setFilters({groupBy:"month",from:null,to:null});
                break;
        }
    }
    return(
        <DataCard>
            <div className="flex justify-between mb-5">
                <div>
                <h1 className="text-2xl">Finance History</h1>
                <p>Your Finance History {titleDescription}</p>
                </div>
                <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">Time frame</p>
                    <TabStyleInput data={["1M","3M","6M","1Y","All"]} value={timeFrameValue} onChange={handleTimeFrame}/>
                </div>
            </div>
            <div className="h-60 px-5">
            <PredictionChart data={summary?.data||[]} dataKey={["income","expense","balance"]} xLabelKey="period" dateFormat={timeFrameValue==="1M"?"day":"month"} dateKey="period" colors={["#1f6e2c","#630d0d"]}/>
            </div>
            <div className="flex gap-5 flex-wrap mt-5 mb-5">
                <DataCard className="flex-1 min-w-65">
                    <DataCard.Title>Current Balance</DataCard.Title>
                    <DataCard.Value className={` ${(summary?.totalBalance||0) >0?"text-green-800":"text-red-800"}`}>$ {summary?.totalBalance.toFixed(2)}</DataCard.Value>
                </DataCard>

                <DataCard className="flex-1 min-w-65">
                    <DataCard.Title>Total Income</DataCard.Title>
                    <DataCard.Value className="text-green-800">+$ {summary?.totalIncome.toFixed(2)}</DataCard.Value>
                    <DataCard.Title>Average Income</DataCard.Title>
                    <DataCard.Value className="text-green-800">+$ {calculateAverage(summary?.data || [], "income")}</DataCard.Value>
                </DataCard>

                <DataCard className="flex-1 min-w-65">
                    <DataCard.Title>Total Expense</DataCard.Title>
                    <DataCard.Value className="text-red-800">-$ {summary?.totalExpense.toFixed(2)}</DataCard.Value>
                    <DataCard.Title>Average Expense</DataCard.Title>
                    <DataCard.Value className="text-red-800">-$ {calculateAverage(summary?.data || [], "expense")}</DataCard.Value>
                </DataCard>
            </div>
        </DataCard>
    );
}

export default FinanceHistory;