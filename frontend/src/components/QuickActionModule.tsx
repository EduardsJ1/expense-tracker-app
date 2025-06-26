

function QuickActions({AddTransaction,AddRecurring,styles}:{AddTransaction:()=>void;AddRecurring:()=>void; styles?:string}){
    return(
        <div className={`bg-white rounded-2xl w-2xs shadow-xl ${styles}`}>
            <div className="px-4 pt-4 mb-3">
                <h2 className="text-2xl font-medium">Quick Add</h2>
                <p className="text-neutral-500">Quickly add new transactions or reacurring</p>
            </div>
            <div className="px-5">
                <button 
                    onClick={AddTransaction} 
                    className="mb-5 hover:bg-neutral-50 hover:border-neutral-400 cursor-pointer hover:shadow-xl border border-neutral-300 shadow-lg rounded-xl w-full py-2 text-left pl-5"
                >
                    + Add Transaction
                </button>
                <button 
                    onClick={AddRecurring} 
                    className="hover:bg-neutral-50 hover:border-neutral-400 cursor-pointer hover:shadow-xl border border-neutral-300 shadow-lg rounded-xl w-full py-2 text-left pl-5"
                >
                    + Add Recurring
                </button>
            </div>
        </div>
    )
}

export default QuickActions;