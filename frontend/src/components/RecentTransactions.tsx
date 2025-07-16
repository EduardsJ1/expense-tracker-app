
import type {Transaction} from "../features/transactions/types/transactions";
import {getRelativeDayLabel} from "../utils/formatDate";
import LoadingSkeleton from "./LoadingSkeleton";

function RecentTransactions({ data, loading, style }: { data?: Transaction[],loading:boolean, style?:string }){
    return(
        <div className={`bg-white rounded-2xl w-2xs shadow-xl pb-5 flex flex-col ${style}`}>
            <div className="px-4 pt-4 mb-3">
                <h2 className="text-2xl font-medium">Recent Transactions</h2>
                <p className="text-neutral-500">Your latest created Transactions</p>
            </div>
            {loading?<TransactionSkeleton times={3}/>:
                data && data.length ===0 ?(
                    <div className="flex-1 px-5">
                        <div className="w-full h-full flex justify-center items-center bg-neutral-100 rounded-2xl">
                            <p className="text-neutral-400">No data availabe</p>
                        </div>
                    </div>
                ):
                data?.map((transaction)=>(
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
                ))
            }
        </div>
    )

}


export default RecentTransactions;

const TransactionSkeleton = ({times=1}:{times?:number})=>{
    return(
        <div>
            {Array.from({length:times}).map((_,index)=>(
                <div key={index} className="px-8 flex justify-between space-y-5">
                    <div className="flex-1/3 space-y-2">
                        <LoadingSkeleton height={"25px"}/>
                        <LoadingSkeleton width={"50px"}/>
                    </div>
                    <div className="flex-1/3"></div>
                    <div className="flex-1/4">
                        <LoadingSkeleton height={"25px"}/>
                    </div>
                </div>    
            ))}
            
        </div>
        )
}