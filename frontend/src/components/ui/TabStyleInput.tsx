
function TabStyleInput({value,data,onChange}:{value:any,data:any[],onChange:(item:any)=>void}){
    return(
        <div className="bg-neutral-300 p-1 flex justify-around rounded-lg gap-1">
            {data.map((item)=>(
                <button
                    key={item}
                    className={`font-medium flex-1 rounded-lg px-3 py-0.5 cursor-pointer ${value === item ? " bg-white hover:bg-neutral-50" : "hover:bg-neutral-100 text-neutral-500"}`}
                    onClick={() => onChange(item)}
                >
                    {item}
                </button>
            ))}

        </div>
    )
}

export default TabStyleInput;