import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {useSummary,useTransactions} from "../hooks/useTransactions";
import type { SummaryFilters } from "../types/transactions";
import TotalBalance from "../components/TotalBalance";
import MonthsStats from "../components/MonthStatsModule";
import RecentTransactions from "../components/RecentTransactions";
function Dashboard(){
    const [filters,setFilters]=useState<SummaryFilters>({groupBy:"month",from:undefined,to:undefined});

    const { summary, loading: summaryLoading, error: summaryError } = useSummary(filters);
    const {transactions,loading: transactionsLoading,error:transactionsError} = useTransactions({page:1,items:4});
    console.log(transactions);
    //console.log(summary?.data);
    return(
        <>
            <Navbar/>
            <div className="pt-20 max-w-7xl mx-auto">
                <h1 className="text-[50px]">hello</h1>
                <div className="flex space-x-2 justify-center flex-wrap gap-2">
                    <TotalBalance balance={Number(summary?.totalBalance)} />
                    <MonthsStats type="income" data={summary?.data}/>
                    <MonthsStats type="expense" data={summary?.data}/>
                </div>
                <div className="flex mt-5 gap-5">
                    <RecentTransactions data={transactions?.data ?? []}/>
                    <RecentTransactions data={transactions?.data ?? []}/>
                    <RecentTransactions data={transactions?.data ?? []}/>
                </div>
            </div>
        </>
    );
}

export default Dashboard;