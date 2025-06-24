import SuggestionWrapper from "./SuggestionWrapper"
import Input from "./Input"
import { useEffect, useState } from "react";
import { useCategorySuggestions } from "../../hooks/useCategories";
import useDebounce from "../../hooks/useDebounce";
import type { CategoryFilters } from "../../api/transactions";
function CategoryInput({onChange}:{onChange:(value:string)=>void}){
    const [inputValue,setInputValue] = useState("");
    const [filters,setFilters]= useState<CategoryFilters | undefined>(undefined);

    
    const [suggestionDisplay,setSuggestionDisplay]=useState(false);
    const debouncedInput = useDebounce(inputValue,500);
    const {categories,loading,error}=useCategorySuggestions(filters);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
    }

    const handleSuggestionSelect = (value:string)=>{
        setInputValue(value);
        onChange(value);
    }

    useEffect(() => {
        if (debouncedInput.length > 0) {
            setFilters({ search: debouncedInput });
        } else {
            setFilters(undefined);
        }
    }, [debouncedInput]);


    return(
        <SuggestionWrapper display={suggestionDisplay} suggestionData={categories} onSelect={handleSuggestionSelect} onClose={()=>setSuggestionDisplay(false)}>
        <Input 
            onChange={handleInput}
            onClick={()=>setSuggestionDisplay(true)}
            type="text"
            value={inputValue}
        
        />
        </SuggestionWrapper>
    )
}

export default CategoryInput