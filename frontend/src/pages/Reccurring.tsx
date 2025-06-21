import Navbar from "../components/Navbar";
import { useReccurring } from "../hooks/useReccurring";
import ReccuringTransactionsTable from "../components/ReccuringTransactionsTable";
import { useState } from "react";
import {updateReccuring} from "../api/reccurring";
import ReccuringTransactionsCards from "../components/ReccuringTransactionsCards";
import NewReccurringModal from "../components/modals/CreateNewReccurring";
import type {ReccurringType} from "../types/reccurring"
function Recurring(){
    const [currentPage,setCurrentPage]=useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [reccuringToEdit,setReccuringToEdit]=useState<ReccurringType|null>(null);
    const {reccuringData,loading,error}=useReccurring({page:currentPage,refreshKey:refreshKey});

    const [displayReccurringModal,SetDisplayReccurringModal]=useState(false);
    const handleCloseModal=()=>{
        SetDisplayReccurringModal(false);
    }
    const handleOpenReccuringModal = (reccuringData:ReccurringType|null=null)=>{
        setReccuringToEdit(reccuringData);
        SetDisplayReccurringModal(true);
    }

    const handlepage=(page:number)=>{
        setCurrentPage(page);
    }
    const handleActive= async (id:number,is_active:boolean)=>{
        await updateReccuring(id,{is_active});
        setRefreshKey((prev)=>prev+1);
    }

    const refreshReccurring=()=>{
        setRefreshKey((prev)=>prev+1);
    }
    return(
        <>
        <Navbar/>
        <div className="pt-50 max-w-[1300px] mx-auto px-5">
            <h1>AAA</h1>
            <div>
                <div className="hidden lg:block">
                    <ReccuringTransactionsTable ReccuringData={reccuringData} handlePage={handlepage} handlePause={handleActive} handleDeleteReccuring={refreshReccurring} openReccuringModal={handleOpenReccuringModal}/>
                </div>
                <div className="block lg:hidden">
                    <ReccuringTransactionsCards ReccurringData={reccuringData} handlePage={handlepage} handlePause={handleActive} handleDeleteReccuring={refreshReccurring} openReccuringModal={handleOpenReccuringModal}/>
                </div>
            </div>
        </div>
        <NewReccurringModal display={displayReccurringModal} closeModal={handleCloseModal} onRecurringCreate={refreshReccurring} ReccuringToEdit={reccuringToEdit}/>
        </>
    )
}

export default Recurring;