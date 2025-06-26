
import type {Transaction} from "../types/transactions";
import {getRelativeDayLabel} from "../utils/formatDate";


function RecentTransactions({ data, style }: { data?: Transaction[], style?:string }){
    return(
        <div className={`bg-white rounded-2xl w-2xs shadow-xl pb-5 ${style}`}>
            <div className="px-4 pt-4 mb-3">
                <h2 className="text-2xl font-medium">Recent Transactions</h2>
                <p className="text-neutral-500">Your latest created Transactions</p>
            </div>
            {data?.map((transaction)=>(
                <div key={transaction.id} className="flex justify-between px-8 ">
                    <div className="mb-2">
                        <h3 className="text-xl">{transaction.category}</h3>
                        <p className="text-xs text-neutral-500">{getRelativeDayLabel(transaction.created_at)}</p>
                    </div>
                    <div>
                        <p className={`pt-1 font-medium ${transaction.type==="income"?"text-green-400":"text-red-400"}`}>
                            <span>{transaction.type==="income"?"+$ ":"-$ "}</span>
                            {transaction.amount}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )

}


export default RecentTransactions;