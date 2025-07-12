import { useState } from "react";
import TransactionView from "../components/TransactionView";
import { useTransactions } from "../hooks/useTransactions";
import type {TransactionFilters,Transaction} from "../types/transactions"
import NewTransactionModal from "../components/CreateNewTransaction";
import DeleteModal from "../../../components/modals/DeleteModal";
import TransactionFiltersComponent from "../components/TransactionsFilters";
function TransactionDashboard(){
    const [filters,setFilters]=useState<TransactionFilters|undefined>({refreshKey:1});
    const [TransactionModalDisplay,setTransactionModalDisplay]=useState<boolean>(false);
    const [DeleteModalDisplay,setDeleteModalDisplay]=useState<boolean>(false);

    const [editingTransaction,setEditingTransaction]=useState<Transaction|undefined>(undefined);
    const [deletingTransactionId,setDeletingTransactionId]=useState<number|undefined>(undefined);


    const {transactions,loading,error} = useTransactions(filters);
    const handleRefreshTransactions = ()=>{
        setFilters((prev)=>({...prev,refreshKey:filters?.refreshKey+1}));
    }


    const handleFiltersChange = (filters:TransactionFilters)=>{
        setFilters(filters);
    }
    const openTransactionModal = (value?:Transaction)=>{
        if(value){
            setEditingTransaction(value)
        }else{
            setEditingTransaction(undefined);
        }
        setTransactionModalDisplay(true);
    }

    const openDeleteModal = (id:number)=>{
        setDeleteModalDisplay(true);
        setDeletingTransactionId(id);
    }
    return(
        <>
            <TransactionFiltersComponent onFiltersChange={handleFiltersChange}/>
            {transactions&&
                <TransactionView 
                    transactions={transactions} 
                    onDeleteTransaction={openDeleteModal} 
                    onEditTransaction={openTransactionModal} 
                    onNewTransaction={()=>openTransactionModal()} 
                    onPageChange={(page)=>setFilters((prev)=>({...prev,page:page}))}
                />
            }
            <NewTransactionModal 
                display={TransactionModalDisplay} 
                closeModal={()=>setTransactionModalDisplay(false)}
                onTransactionCreate={handleRefreshTransactions}
                transactionToEdit={editingTransaction}
            />
            <DeleteModal 
                display={DeleteModalDisplay}
                closeModal={()=>setDeleteModalDisplay(false)}
                onDeleted={handleRefreshTransactions}
                transactionid={deletingTransactionId}
            />
        </>
    )
}

export default TransactionDashboard;