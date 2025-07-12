import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import useDebounce from "../../../hooks/useDebounce";
import type {TransactionFilters as Tfilters} from "../types/transactions";
import DropDownOptions from "../../../components/ui/DropDownOptions";

function TransactionFilters({onFiltersChange}:{onFiltersChange:(filters:Tfilters)=>void}){
    const [searchValue,setSearchValue]=useState<string>("");
    const DebouncedSearch = useDebounce(searchValue,500);
    const [type,setType]= useState<"income"|"expense"|undefined>(undefined)
    useEffect(()=>{
        onFiltersChange({
            search: DebouncedSearch || undefined
        })
    },[DebouncedSearch])

    const handleType=(value:String)=>{
        if(value==="All Types"){

        }
    }
    return (
        <div className="bg-white rounded-2xl px-2 py-2">
            <div>
                <h2 className="text-2xl font-medium">Transaction Filters</h2>
            </div>
            <div>
                <p>Search</p>
                <Input placeholder="Search..." value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
            </div>
            <div>
                <p>Type</p>
                <DropDownOptions values={["all Types","income","expnese"]} value={"all Types"} onChange={handleType}/>
            </div>
        </div>
    )
}

export default TransactionFilters;