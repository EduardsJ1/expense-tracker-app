import type {Summary} from "../types/transactions";

interface MonthsStatProps{
    type:"income"|"expense",
    data?:Summary["data"]
}


function MonthsIncome({type,data}:MonthsStatProps){
    let value = 0
    let percentage=0;
    if (data && data.length > 0) {
        value = data[0][type];
        if (data.length > 1 && typeof data[1][type] === "number") {
            const prev = data[1][type];
            percentage = prev !== 0 ? ((value - prev) / prev) * 100 : 0;
        } else {
            percentage = 0;
        }
    }
    return(
        <div className={`shadow-xl ml-2 rounded-2xl px-5 w-2xs py-5 flex justify-between items-center bg-white`}>
            <div>
                <h3 className="text-neutral-400 font-medium">
                    {type === "income" ? "Months Income" : "Months Expense"}
                </h3>
                <p className="text-2xl text-black font-medium">
                    $ {value}
                </p>
                <span
                    className={`font-bold
                        ${percentage === 0
                            ? "text-neutral-400"
                            : type === "income"
                                ? percentage > 0
                                    ? "text-green-300"
                                    : "text-red-400"
                                : percentage > 0
                                    ? "text-red-400"
                                    : "text-green-300"
                        }`
                    }
                >
                    {percentage === 0
                        ? "0%"
                        : `${percentage > 0 ? "+" : ""}${percentage.toFixed(0)}%`}
                </span>
            </div>
            <div className="flex items-center justify-center h-full">
                {type==="income"?
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" className="fill-green-300"/>
                    <polyline
                        points="10,24 16,16 20,20 26,12"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <polyline
                        points="22,12 26,12 26,16"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                :
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" className="fill-red-400"/>
                    <polyline
                        points="10,12 16,20 20,16 26,24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <polyline
                        points="22,24 26,24 26,20"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            }
                
            </div>
        </div>
    );
}

export default MonthsIncome;