import { useState } from "react";


function HoverModal({children,content,delay=500}:{children:React.ReactNode, content:React.ReactNode, delay?:number}){
    const [isVisible,setIsVisible]=useState(false);
    const [timeoutId,setTimeoutId]=useState<NodeJS.Timeout|null>(null);

    const showTooltip=()=>{
        const id = setTimeout(()=>setIsVisible(true),delay);
        setTimeoutId(id);
    }

    const hideTooltip=()=>{
        if(timeoutId){
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    return(
        <div 
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && (
                <div className="absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2 w-50">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                        {content}
                    </div>
                </div>
            )}
        </div>
    )
}

export default HoverModal;