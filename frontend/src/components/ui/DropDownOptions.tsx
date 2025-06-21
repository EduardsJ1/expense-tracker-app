import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import DropdownIcon from "./icons/DropdownIcon";
function dropDownOptions({ values,value, placeholder,onChange }: { values: any[];value:any, placeholder?: string,onChange:(value:any)=>void }) {

    const [optionsDisplay,setOptionsDisplay] = useState(false);
    const handleSelect=(selectedValue:any)=>{
        onChange(selectedValue);
        setOptionsDisplay(false)
    }
    const dropDownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropDownRef as React.RefObject<HTMLElement>, ()=>setOptionsDisplay(false));
    
    const formatDisplay = (text: string) => {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };
    
   return (
        <div className="relative bg-white" ref={dropDownRef}>
            <button 
                className="border border-neutral-300 w-full rounded-lg py-2 px-3 hover:bg-neutral-50 cursor-pointer flex justify-between items-center text-left"
                type="button" 
                onClick={() => setOptionsDisplay(!optionsDisplay)}
            >
                <span>{formatDisplay(value) || placeholder || "Select an option"}</span>
                <DropdownIcon isOpen={optionsDisplay} />
            </button>
            
            {optionsDisplay && (
                <div className="mt-1 bg-white absolute z-50 border border-neutral-300 rounded-lg w-full shadow-lg max-h-60 overflow-y-auto">
                    {values.map((option) => (
                        <button 
                            className="w-full text-left px-3 py-2 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg"
                            type="button" 
                            onClick={() => handleSelect(option)} 
                            key={option}
                        >
                            {formatDisplay(option)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default dropDownOptions;