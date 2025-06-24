import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside"

function SuggestionWrapper({ children,suggestionData, onSelect, onClose, display = false }: { children: React.ReactNode, suggestionData:string[], onSelect:(value:string)=>void, onClose:()=>void, display?: boolean }) {


    const suggestionRef = useRef<HTMLDivElement>(null);

    useClickOutside(suggestionRef as React.RefObject<HTMLElement>,()=>{onClose()});

    const handleSelect=(selectedValue:string)=>{
        onSelect(selectedValue);
        onClose();
    }

    const shouldDisplay = display && suggestionData.length>0;
    return (
        <div className="relative" ref={suggestionRef}>
            {children}
            <div className={`mt-1 bg-white absolute z-40 border border-neutral-300 rounded-lg w-full shadow-lg max-h-60 overflow-y-auto ${shouldDisplay?"block":"hidden"}`}>
                {suggestionData.map((item)=>(
                    <div className="w-full text-left px-3 py-2 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                        key={item} onClick={()=>handleSelect(item)}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuggestionWrapper;