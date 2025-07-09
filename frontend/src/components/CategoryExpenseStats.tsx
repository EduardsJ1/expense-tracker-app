import { useCategorySummary } from "../hooks/useCategories";
import SingleHorizontalBar from "./charts/SingleHorizontalBar";
import firstCharToUpperCase from "../utils/firstCharToUpperCase";

const getCurrentMonthFilters = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    return { startDate: startOfMonth,type: "expense" as const };
};

const CURRENT_MONTH_FILTERS = getCurrentMonthFilters();


function CategoryExpenseStats({style}:{style:string}){
   
    const {categoryData,loading:categoryLoading,error:categoryError} = useCategorySummary(CURRENT_MONTH_FILTERS);
    return(
        <div className={`bg-white rounded-2xl w-2xs shadow-xl pb-5 flex flex-col ${style}`}>
            <div className="px-2 pt-4 mb-3">
                <h2 className="text-2xl font-medium">Top Categories</h2>
                <p className="text-neutral-500">Where your money goes this month</p>
            </div>
            <div className="flex flex-col gap-3 flex-1 h-0 px-4">
                {categoryData.map((stat)=>(
                    <div key={stat.category}>
                        <div className="flex justify-between">
                            <h3>{firstCharToUpperCase(stat.category)}</h3>
                            <p className="font-medium">$ {stat.totalamount}</p>
                        </div>
                        <SingleHorizontalBar precentage={stat.precentage}/>
                    </div>
                ))}
                {categoryData.length===0 &&(
                    <div className="flex-1">
                        <div className="w-full h-full flex justify-center items-center bg-neutral-100 rounded-2xl">
                            <p className="text-neutral-400">No data availabe</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryExpenseStats;