import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {useSummary,useTransactions} from "../hooks/useTransactions";

import TotalBalance from "../components/TotalBalance";
import MonthsStats from "../components/MonthStatsModule";
import RecentTransactions from "../components/RecentTransactions";
import QuickActions from "../components/QuickActionModule";
import NewTransactionModal from "../components/modals/CreateNewTransaction";
import NewReccurringModal from "../features/analytics/components/CreateNewReccurring";
import LinkCard from "../components/ui/LinkCard";
import CategoryExpenseStats from "../components/CategoryExpenseStats";

//icons
import TransactionIcon from "../components/ui/icons/TransactionIcon";
import RecurringIcon from "../components/ui/icons/ReccurringIcon";
import AnalyticsIcon from "../components/ui/icons/AnalyticsIcon";


//hooks

function Dashboard(){
    const [Transactiondisplay,setTransactionDisplay] = useState(false);
    const [Recurringdisplay,setRecurringDisplay]=useState(false);
    const [refreshKey,setRefreshKey]=useState(0);
    const { summary, loading: summaryLoading, error: summaryError } = useSummary({groupBy:"month"});
    const {transactions,loading: transactionsLoading,error:transactionsError} = useTransactions({page:1,items:4,refreshKey});

    //console.log(transactions);
    //console.log(summary?.data);
    const handleRefreshTransactions=()=>{
        setRefreshKey(prev=>prev+1);
    }
    return(
        <>
            <Navbar/>
            <div className="pt-20 max-w-[1200px] mx-auto px-5">
                <h1 className="text-[50px]">hello</h1>
                <div className="flex space-x-2 justify-center flex-wrap gap-2 mb-5">
                    <TotalBalance balance={Number(summary?.totalBalance)} />
                    <MonthsStats type="income" data={summary?.data}/>
                    <MonthsStats type="expense" data={summary?.data}/>
                </div>
                <div className="flex space-x-2 justify-between gap-5 flex-wrap mb-5">
                    <QuickActions AddTransaction={()=>setTransactionDisplay(true)} AddRecurring={()=>setRecurringDisplay(true)} styles="flex-1 min-w-[300px] min-h-[310px]"/>
                    <RecentTransactions data={transactions?.data ?? []} style="flex-1 min-w-[300px] min-h-[310px]"/>
                    <CategoryExpenseStats style="flex-1 min-w-[300px] min-h-[310px]"/>
                </div>
                <div className="flex space-x-2 justify-center gap-5 flex-wrap">
                    <LinkCard to="/transactions" title="Transactions" description="View and Manage all your transactions" icon={<TransactionIcon size={50} />} iconbackground="bg-blue-100"/>
                    <LinkCard to="/reccurring" title="Reccurring" description="Setup Reccurring Transactions" icon={<RecurringIcon size={50} color="#b45309"/>} iconbackground="bg-yellow-100"/>
                    <LinkCard to="/analytics" title="Analytics" description="View statistics" icon={<AnalyticsIcon size={50} color="#800080"/>} iconbackground="bg-purple-300"/>
                </div>
            </div>
            <NewTransactionModal display={Transactiondisplay} closeModal={()=>setTransactionDisplay(false)} onTransactionCreate={handleRefreshTransactions}/>
            <NewReccurringModal display={Recurringdisplay} closeModal={()=>setRecurringDisplay(false)} onRecurringCreate={()=>{}}/>
        </>
    );
}

export default Dashboard;