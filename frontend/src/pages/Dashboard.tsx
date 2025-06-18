import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {useSummary} from "../hooks/useTransactions";
import type { SummaryFilters } from "../types/transactions";
import TotalBalance from "../components/TotalBalance";
import MonthsStats from "../components/MonthStatsModule";
function Dashboard(){
    const [filters,setFilters]=useState<SummaryFilters>({groupBy:"month",from:undefined,to:undefined});

    const {summary,loading,error} = useSummary(filters);
    //console.log(summary?.data);
    return(
        <>
            <Navbar/>
            <div className="pt-20">
            <h1 className="text-[50px]">hello</h1>
            <div className="flex space-x-2 justify-center flex-wrap gap-2">
                <TotalBalance balance={Number(summary?.totalBalance)} />
                <MonthsStats type="income" data={summary?.data}/>
                <MonthsStats type="expense" data={summary?.data}/>
            </div>
            </div>
        </>
    );
}

export default Dashboard;