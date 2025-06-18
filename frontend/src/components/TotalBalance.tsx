import { useState } from "react";


function TotalBalance({balance}:{balance:number}){

    const isBalanceNegative = balance <= 0;

    return(
        <div className={`shadow-xl ml-2 rounded-2xl px-5 w-2xs py-5 flex justify-between items-center ${isBalanceNegative ? "bg-gradient-to-tr from-red-400 to-red-500" : "bg-gradient-to-tr from-green-600  to-green-700"}`}>
            <div>
            <h3 className="text-neutral-100 font-medium">Total Balance</h3>
            <p className="text-2xl text-white font-medium">$ {balance}</p>
            </div>
            <div className="flex items-center justify-center h-full">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill={isBalanceNegative?"#c75148":"#2b9948"} />
                <text x="18" y="24" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">$</text>
            </svg>
            </div>
        </div>
    );
}

export default TotalBalance;