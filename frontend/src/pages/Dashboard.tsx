import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {useSummary,useTransactions} from "../hooks/useTransactions";

import TotalBalance from "../components/TotalBalance";
import MonthsStats from "../components/MonthStatsModule";
import RecentTransactions from "../components/RecentTransactions";
import QuickActions from "../components/QuickActionModule";
import NewTransactionModal from "../components/modals/CreateNewTransaction";
import LinkCard from "../components/ui/LinkCard";
import TransactionIcon from "../components/ui/icons/TransactionIcon";
import RecurringIcon from "../components/ui/icons/ReccurringIcon";
import AnalyticsIcon from "../components/ui/icons/AnalyticsIcon";
function Dashboard(){
    const [Modaldisplay,setModalDisplay] = useState(false);
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
            <div className="pt-20 max-w-7xl mx-auto">
                <h1 className="text-[50px]">hello</h1>
                <div className="flex space-x-2 justify-center flex-wrap gap-2 mb-5">
                    <TotalBalance balance={Number(summary?.totalBalance)} />
                    <MonthsStats type="income" data={summary?.data}/>
                    <MonthsStats type="expense" data={summary?.data}/>
                </div>
                <div className="flex space-x-2 justify-center gap-5 flex-wrap mb-5">
                    <QuickActions AddTransaction={()=>setModalDisplay(true)}/>
                    <RecentTransactions data={transactions?.data ?? []}/>
                    <RecentTransactions data={transactions?.data ?? []}/>
                </div>
                <div className="flex space-x-2 justify-center gap-5 flex-wrap">
                    <LinkCard to="/transactions" title="Transactions" description="View and Manage all your transactions" icon={<TransactionIcon size={50} />} iconbackground="bg-blue-100"/>
                    <LinkCard to="/reccurring" title="Reccurring" description="Setup Reccurring Transactions" icon={<RecurringIcon size={50} color="#b45309"/>} iconbackground="bg-yellow-100"/>
                    <LinkCard to="/analytics" title="Analytics" description="View statistics" icon={<AnalyticsIcon size={50} color="#800080"/>} iconbackground="bg-purple-300"/>
                </div>
            </div>
           <NewTransactionModal display={Modaldisplay} closeModal={()=>setModalDisplay(false)} onTransactionCreate={handleRefreshTransactions}/>
        </>
    );
}

export default Dashboard;