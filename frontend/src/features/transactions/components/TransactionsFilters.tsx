import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import useDebounce from "../../../hooks/useDebounce";
import type {TransactionFilters as Tfilters} from "../types/transactions";
import DropDownOptions from "../../../components/ui/DropDownOptions";

function TransactionFilters({onFiltersChange}:{onFiltersChange:(filters:Tfilters)=>void}){
    const [searchValue,setSearchValue]=useState<string>("");
    const DebouncedSearch = useDebounce(searchValue,500);
    const [type,setType]= useState<"income"|"expense"|"all types">("all types");
    const [status,setStatus]=useState<"all"|"recurring"|"one time">("all");
    const [sort,setSort]=useState<"date"|"type"|"category"|"amount">("date");
    const [order,setOrder]=useState<"Ascending"|"Descending">("Descending");
    useEffect(()=>{
        onFiltersChange({
            search: DebouncedSearch || undefined,
            type: type ==="all types"?undefined:type,
            isRecurring: status ==="all"? undefined:(status==="recurring"?true:false),
            sortBy:sort==="date"?"created_at":sort,
            sortOrder:order==="Ascending"?"asc":"desc"
        })
    },[DebouncedSearch,type,status,sort,order])



    return (
        <div className="bg-white rounded-2xl px-5 py-5 mt-10 shadow-xl">
            <div>
                <h2 className="text-2xl font-medium">Transaction Filters</h2>
            </div>
            <div className="flex flex-wrap gap-5">
                <div className="flex-1/4">
                    <p>Search</p>
                    <Input placeholder="Search..." value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
                </div>
                <div className="flex-1/4">
                    <p>Type</p>
                    <DropDownOptions values={["all types","income","expense"]} value={type} onChange={(value)=>setType(value)}/>
                </div>
                <div className="flex-1/4">
                    <p>Status</p>
                    <DropDownOptions values={["all","recurring","one time"]} value={status} onChange={(value)=>setStatus(value)}/>
                </div>
                <div className="flex-1/4">
                    <p>Sort By</p>
                    <DropDownOptions values={["date","type","category","amount"]} value={sort} onChange={(value)=>setSort(value)}/>
                </div>
                <div className="flex-1/4">
                    <p>Order By</p>
                    <DropDownOptions values={["Descending","Ascending"]} value={order} onChange={(value)=>setOrder(value)}/>
                </div>
            </div>
        </div>
    )
}

export default TransactionFilters;