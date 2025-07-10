import React, { useState,useRef } from "react";
import type {ParamFilters} from "../../../api/reccurring";
import DropDownOptions from "../../../components/ui/DropDownOptions";

function RecurringFilter({onChange}:{onChange:(filterData?:ParamFilters)=>void}){
    const [filterData,setFilterData]=useState<ParamFilters>();
    const timeoutRef = useRef<NodeJS.Timeout | null>(undefined);
    const [status,setStatus]=useState<string>("Any");
    const [sortBy,setsortBy]=useState<string>("Created Date");
    const [orderBy,setOrderBy]=useState<string>("Descending");

    const handleStatus=(value:string)=>{
        let newFilterData;

        if(value==="Any"){
            newFilterData={...filterData, is_active:undefined};
            setStatus("Any");
        }else if(value==="Active"){
            newFilterData={...filterData,is_active:true};
            setStatus("Active");
        }else{
            newFilterData={...filterData,is_active:false};
            setStatus("Paused");
        }

        onChange(newFilterData);
    }

    const handleSearch=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const newFilterData = { ...filterData, search: e.target.value };
        setFilterData(newFilterData);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onChange(newFilterData);
        }, 1000);
    }

    const handleType=(value:string)=>{
        let newFilterData;
    
        if (value === "All Types") {
            newFilterData = { ...filterData, type: undefined };
        } else {
            newFilterData = { ...filterData, type: value };
        }
    
        setFilterData(newFilterData);
        onChange(newFilterData);
    }

    const handleSortBy=(value:string)=>{
        let newFilterData;

        if(value==="Amount"){
            newFilterData={...filterData, sortBy:"amount"}
            setsortBy("Amount");
        }else if(value==="Type"){
            newFilterData={...filterData, sortBy:"type"}
            setsortBy("Type");
        }else if(value==="Start Date"){
            newFilterData={...filterData, sortBy:"start_date"}
            setsortBy("Start Date");
        }else if(value==="Next Execution"){
            newFilterData={...filterData,sortBy:"next_occurrence"}
            setsortBy("Next Execution");
        }else{
            newFilterData={...filterData, sortBy:undefined}
            setsortBy("Created Date");
        }

        setFilterData(newFilterData);
        onChange(newFilterData);
    }

    const handleOrderBy=(value:string)=>{
        let newFilterData;

        if(value==="Descending"){
            newFilterData={...filterData, sortOrder:undefined}
            setOrderBy("Descending");
        }else{
            newFilterData={...filterData, sortOrder:"asc"}
            setOrderBy("Ascending");
        }

        setFilterData(newFilterData);
        onChange(newFilterData);
    }

    return(
        <div className="bg-white rounded-2xl shadow-xl px-5 py-2 pb-10">
            <h2 className="text-2xl font-medium">Reccuring Filters & Search</h2>
            <div>
                <div className="flex gap-5 flex-wrap">
                    <div className="flex-1 min-w-56">
                        <p>Search</p>
                        <input 
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        value={filterData?.search||""}
                        onChange={handleSearch}
                        placeholder="Search Recurring..."
                        />
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Type</p>
                        <DropDownOptions values={["All Types","income","expense"]} value={filterData?.type||"All Types"} onChange={handleType}/>
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Status</p>
                        <DropDownOptions values={["Any","Active","Paused"]} value={status} onChange={handleStatus}/>
                    </div>
                </div>

                <div className="flex gap-5 flex-wrap mt-5">
                    <div className="flex-1 min-w-56">
                        <p>Sort By</p>
                        <DropDownOptions values={["Created Date","Amount","Type","Start Date","Next Execution"]} value={sortBy} onChange={handleSortBy}/>
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Order By</p>
                        <DropDownOptions values={["Ascending","Descending"]} value={orderBy} onChange={handleOrderBy}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecurringFilter;