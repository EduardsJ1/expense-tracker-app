import PieChart from "../../../components/charts/PieChart";
import { useCategorySummary } from "../../../hooks/useCategories";
import AnalyticsArrow from "../../../components/ui/icons/AnalyticsArrow";
import Input from "../../../components/ui/Input";
import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import TabStyleInput from "../../../components/ui/TabStyleInput";


function CategoryAnalytics(){
    const [limit,setLimit]=useState("5");
    const debouncedLimit = useDebounce(Number(limit),1000);
    const [timeFrameValue,setTimeFrameValue]=useState<"1M"|"3M"|"6M"|"1Y"|"All">("1M");
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [startDate,setStartDate]=useState<string|undefined>(firstDayOfMonth.toISOString());
    const [descriptionText,setDescriptionText]=useState<string>("this month");

    const {categoryData:categoryExpense,loading:categoryExpenseLoading,error:categoryExpenseError} = useCategorySummary({limit:debouncedLimit, type:"expense", startDate:startDate});
    const {categoryData:categoryIncome,loading:categoryIncomeLoading,error:categoryIncomeError} = useCategorySummary({limit:debouncedLimit, type:"income"})
    //console.log(categoryExpense);

    const handleTimeFrame= (value:any)=>{
        setTimeFrameValue(value);
        switch (value){
            case "1M":
                setStartDate(firstDayOfMonth.toISOString());
                setDescriptionText("this month");
                break;
            case "3M":
                const ThirdMonth = new Date(now.getFullYear(), now.getMonth()-3);
                setStartDate(ThirdMonth.toISOString());
                setDescriptionText("in 3 months");
                break;
            case "6M":
                const SixthMonth = new Date(now.getFullYear(),now.getMonth()-6);
                setStartDate(SixthMonth.toISOString());
                setDescriptionText("in 6 months");
                break;
            case "1Y":
                const thisYear = new Date(now.getFullYear(),1,1);
                setStartDate(thisYear.toISOString());
                setDescriptionText("this year");
                break;
            case "All":
                setStartDate(undefined);
                setDescriptionText("all time");
                break;

        }
    }

    const handleLimit=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        if(isNaN(Number(value))){
            return;
        }
        setLimit(e.target.value)
    }

    return(
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl px-5 py-5">
            <div className="mb-5 flex justify-between flex-wrap">
                <div className="mb-5">
                    <h2 className="text-3xl">Category Statistics</h2>
                    <p className="text-neutral-500">Category statistics {descriptionText}</p>
                </div>
                <div className="flex flex-wrap gap-5 justify-center">
                    <div>
                        <p className="block text-sm font-medium text-gray-700 mb-1">Time frame</p>
                        <TabStyleInput data={["1M","3M","6M","1Y","All"]} value={timeFrameValue} onChange={handleTimeFrame}/>
                    </div>
                    <div className="w-5xs">
                        <Input label="Category Limit" inputSize="sm" value={limit} onChange={handleLimit}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap flex-col lg:flex-row gap-5">
                <div className="flex-1 border rounded-2xl border-neutral-300 shadow-2xs pb-4">
                    <div className="text-2xl mt-2 flex justify-center">
                        <span>Expense</span><span><AnalyticsArrow direction="down" strokeColor="#6e0000"/></span>
                    </div>
                    <div className="w-full h-[400px]">
                        {categoryExpense&&
                        <PieChart data={categoryExpense} valueData="totalamount" valueName="category" valueSign="-$"/>
                        }
                    </div>
                </div>
                <div className="flex-1 border rounded-2xl border-neutral-300 shadow-2xs pb-4">
                    <div className="text-2xl mt-2 flex justify-center">
                        <span>Income</span><span><AnalyticsArrow direction="up" strokeColor="#016917"/></span>
                    </div>
                    <div className="w-full h-[400px]">
                        {categoryIncome&&
                        <PieChart data={categoryIncome} valueData="totalamount" valueName="category" valueSign="+$"/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryAnalytics;