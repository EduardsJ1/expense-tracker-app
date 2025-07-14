import React, { useState,useEffect } from "react";
import type {RecurringFilters} from "../types/reccurring";
import DropDownOptions from "../../../components/ui/DropDownOptions";
import useDebounce from "../../../hooks/useDebounce";
function RecurringFilter({onFiltersChange}:{onFiltersChange:(filterData?:RecurringFilters)=>void}){
    const [searchValue,setSearchValue]=useState<string>("");
    const DebouncedSearch = useDebounce(searchValue,500);
    const [type,setType]= useState<"income"|"expense"|"All Types">("All Types");
    const [status,setStatus]=useState<"Any"|"Active"|"Paused">("Any");
    const [sort,setSort]=useState<"Date"|"Amount"|"Type"|"Start Date"|"Next Execution">("Date");
    const [order,setOrder]=useState<"Ascending"|"Descending">("Descending");
    useEffect(()=>{
        onFiltersChange({
            search: DebouncedSearch || undefined,
            type: type ==="All Types"?undefined:type,
            is_active: status ==="Any"? undefined:(status==="Active"?true:false),
            sortBy:FormatSort(sort),
            sortOrder:order==="Ascending"?"asc":"desc"
        })
    },[DebouncedSearch,type,status,sort,order])

    const FormatSort=(sort:string)=>{
        switch(sort){
            case "Date":
                return "created_at";
            case "Amount":
                return "amount";
            case "Type":
                return "type";
            case "Start Date":
                return "next_occurence";
            case "Next Execution":
                return "mext_occurrence";
            default:
                return undefined;
        }
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
                        value={searchValue}
                        onChange={(e)=>setSearchValue(e.target.value)}
                        placeholder="Search Recurring..."
                        />
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Type</p>
                        <DropDownOptions values={["All Types","income","expense"]} value={type} onChange={(value)=>setType(value)}/>
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Status</p>
                        <DropDownOptions values={["Any","Active","Paused"]} value={status} onChange={(value)=>setStatus(value)}/>
                    </div>
                </div>

                <div className="flex gap-5 flex-wrap mt-5">
                    <div className="flex-1 min-w-56">
                        <p>Sort By</p>
                        <DropDownOptions values={["Date","Amount","Type","Start Date","Next Execution"]} value={sort} onChange={(value)=>setSort(value)}/>
                    </div>
                    <div className="flex-1 min-w-56">
                        <p>Order By</p>
                        <DropDownOptions values={["Ascending","Descending"]} value={order} onChange={(value)=>setOrder(value)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecurringFilter;