import { useReccurring } from "../hooks/useReccurring";
import RecurringFilters from "../components/RecurringFilters";
import ReccurringTransactionView from "../components/RecurringTransactionView";
import { useState } from "react";
import type {RecurringFilters as filters,ReccurringType} from "../types/reccurring"
import NewReccurringModal from "../components/CreateNewReccurring";
import DeleteModal from "../../../components/modals/DeleteModal";
import { updateReccuring } from "../api/reccurring";

function RecurringDashboard(){
    const [filters,setFilters]=useState<filters|undefined>({refreshKey:1});
    const {reccuringData,loading,error}=useReccurring(filters);
    const [createModalDisplay,setCreateModalDisplay]=useState(false);
    const [DeleteModalDisplay,setDeleteModalDisplay]=useState(false);
    const [deleteRecurringId,setDeleteRecurringId]=useState<number|undefined>(undefined);
    const [recurringToEdit,setRecurringToEdit]=useState<ReccurringType|undefined>(undefined);

    const UpdateActive= async (id:number,is_active:boolean)=>{
        await updateReccuring(id,{is_active});
        refreshReccurring();
    }


    const refreshReccurring=()=>{
        setFilters((prev)=>({...prev, refreshKey:(prev?.refreshKey||0)+1}));
    }
    return(
        <>
        <RecurringFilters onFiltersChange={(filters)=>setFilters(filters)}/>
        <ReccurringTransactionView 
            RecurringTransactionsData={reccuringData} 
            onPageChange={(page)=>setFilters((prev)=>({...prev,page:page}))} 
            onCreateRecurring={(recurring)=>{setCreateModalDisplay(true); setRecurringToEdit(recurring)}} 
            onDelete={(id)=>{setDeleteRecurringId(id); setDeleteModalDisplay(true)}} 
            onSetActive={UpdateActive}
        />
        <NewReccurringModal 
            display={createModalDisplay} 
            closeModal={()=>setCreateModalDisplay(false)} 
            onRecurringCreate={()=>{refreshReccurring();setRecurringToEdit(undefined)}} 
            ReccuringToEdit={recurringToEdit}/>
        <DeleteModal 
            display={DeleteModalDisplay} 
            closeModal={()=>setDeleteModalDisplay(false)} 
            onDeleted={()=>{refreshReccurring(); setDeleteModalDisplay(false)}} 
            reccurringid={deleteRecurringId}/>
        </>
    )
}

export default RecurringDashboard;