import SuggestionWrapper from "./SuggestionWrapper"
import Input from "./Input"
import { useEffect, useState } from "react";
import { useCategorySuggestions } from "../../hooks/useCategories";
import useDebounce from "../../hooks/useDebounce";
import type { CategoryFilters } from "../../types/category";
function CategoryInput({onChange,value,type}:{onChange:(value:string)=>void; value:string, type?:"income"|"expense"}){
    


    const [filters,setFilters]= useState<CategoryFilters | undefined>({type:type});
    const [suggestionDisplay,setSuggestionDisplay]=useState(false);
    const debouncedInput = useDebounce(value,500);
    const {categories,loading,error}=useCategorySuggestions(filters);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    const handleSuggestionSelect = (value:string)=>{
        onChange(value);
    }

    useEffect(() => {
        const newFilters: CategoryFilters = { type: type };
        
        if (debouncedInput.length > 0) {
            newFilters.search = debouncedInput;
        }
        setFilters(newFilters);
    }, [debouncedInput,type]);

    return(
        <SuggestionWrapper display={suggestionDisplay} suggestionData={categories} onSelect={handleSuggestionSelect} onClose={()=>setSuggestionDisplay(false)}>
        <Input 
            onChange={handleInput}
            onClick={()=>setSuggestionDisplay(true)}
            type="text"
            value={value}
        
        />
        </SuggestionWrapper>
    )
}

export default CategoryInput