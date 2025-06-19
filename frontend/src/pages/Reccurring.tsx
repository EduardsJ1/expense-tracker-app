import Navbar from "../components/Navbar";
import { useReccurring } from "../hooks/useReccurring";
import ReccuringTransactionsTable from "../components/ReccuringTransactionsTable";
import { useState } from "react";
import {updateReccuring} from "../api/reccurring";
function Recurring(){
    const [currentPage,setCurrentPage]=useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const {reccuringData,loading,error}=useReccurring({page:currentPage,refreshKey:refreshKey});

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
        <div className="pt-50">
            <h1>AAA</h1>
            <ReccuringTransactionsTable ReccuringData={reccuringData} handlePage={handlepage} handlePause={handleActive} handleDeleteReccuring={refreshReccurring}/>
        </div>
        </>
    )
}

export default Recurring;