import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import type {TransactionData,Transaction} from "../types/transactions";

import { formatLocalDateTime } from "../../../utils/formatDate";
import HoverModal from "../../../components/HoverModal";
import firstCharToUpperCase from "../../../utils/firstCharToUpperCase";
import limitString from "../../../utils/limitString";

import EditIcon from "../../../components/ui/icons/EditIcon";
import TrashIcon from "../../../components/ui/icons/TrashIcon";
import DataCard from "../../../components/ui/DataCard";
function TransactionView(
    {transactions,onEditTransaction,onDeleteTransaction,onNewTransaction,onPageChange}:{
        transactions:TransactionData
        onEditTransaction:(transaction:Transaction)=>void,
        onDeleteTransaction:(id:number)=>void,
        onNewTransaction:()=>void,
        onPageChange:(page:number)=>void
    }){


    const TableData = formatTransactionForTable({transactionArray:transactions.data,handleEditTransaction:onEditTransaction,handleDeleteTransaction:onDeleteTransaction});
    return(
        <div className="w-full bg-white mt-10 rounded-2xl p-5 pb-10 mb-10 shadow-xl">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-medium">Transaction history</h2>
                    <p className="mt-1 text-neutral-600">Page: {transactions?.currentpage}/{transactions?.totalPages}</p>
                </div>
                <div >
                    <button onClick={onNewTransaction} className="bg-green-600 text-white rounded-xl px-4 py-1 font-medium cursor-pointer hover:bg-green-700"><span className="mr-2 text-[20px] font-bold leading-none">+</span>Add Transaction</button>
                </div>
            </div>
            <div className="hidden lg:block">
            <Table 
                columns={["Date","Type","Category","Description","Amount","Status","Actions"]}
                data={TableData}
            />
            </div>
            <div className="block lg:hidden">
                {transactions.data.map((transaction)=>(
                    <DataCard key={transaction.id} className="mt-5">
                        <div className="border-b border-neutral-300 flex justify-between pb-2">
                            {transaction.type==="income"?
                            <>
                                <p className="font-medium">
                                    <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2 align-middle"></span>
                                    {firstCharToUpperCase(transaction.category)}
                                </p>
                                <p className="text-green-800 font-medium">+$ {transaction.amount}</p>
                            </>
                            :
                            <>
                                <p className="font-medium">
                                    <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2 align-middle"></span>
                                    {firstCharToUpperCase(transaction.category)}
                                </p>
                                <p className="text-red-800 font-medium">-$ {transaction.amount}</p>
                            </>
                            }
                        </div>
                        <div className="flex justify-between border-b border-neutral-300 py-5">
                            <HoverModal content={transaction.note} delay={200}><p className="cursor-default">{limitString({string:transaction.note||"",charCount:20})}</p></HoverModal>
                            <p>{transaction.recurring_id?
                                <span className="border border-neutral-800 rounded-2xl px-2 py-0.5 bg-neutral-700 font-medium text-white">Recurring</span>
                                :
                                <span className="border border-neutral-200 rounded-2xl px-2 py-0.5 bg-neutral-50 font-medium">One time</span>}
                            </p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <p>{formatLocalDateTime(transaction.created_at)}</p>
                            <div className="flex justify-center gap-2">
                                <button 
                                    onClick={() => onEditTransaction(transaction)} 
                                    className="border border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                                >
                                    <EditIcon size={20} color="#3b3b3b"/>
                                </button>
                                <button 
                                    onClick={() => onDeleteTransaction(transaction.id)} 
                                    className="border border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                                >
                                    <TrashIcon size={20}/>
                                </button>
                            </div>
                        </div>
                    </DataCard>
                ))}
            </div>
            <Pagination totalPages={transactions?.totalPages||1} currentPage={Number(transactions?.currentpage)||1} setPage={onPageChange}/>
        </div>
    )
}

export default TransactionView;










const formatTransactionForTable =(
    {transactionArray,handleEditTransaction,handleDeleteTransaction}:
    {
        transactionArray:Transaction[],
        handleEditTransaction:(transaction:Transaction)=>void,
        handleDeleteTransaction:(id:number)=>void
    })=>{
    const TableData=transactionArray.map((value)=>{
        return{
            'Date': formatLocalDateTime(value.created_at),
            'Type': value.type === "income"? 
                    <span className="bg-green-200 border border-green-400 rounded-2xl px-2 py-0.5 text-green-900 font-medium">Income</span>
                    :
                    <span className="bg-red-200 border border-red-400 rounded-2xl px-2 py-0.5 text-red-900 font-medium">Expense</span>,
            'Category':<span className="border border-neutral-200 rounded-2xl px-2 py-0.5 font-medium text-neutral-800">{firstCharToUpperCase(value.category)}</span>,
            'Description':<HoverModal 
                            content={<div><p>{firstCharToUpperCase(value.note||"")}</p></div>}
                            delay={200}
                            >
                                <span className={value.note?"border rounded-2xl border-neutral-400 px-2 py-1 hover:bg-neutral-200 cursor-pointer":""}>
                                    {firstCharToUpperCase(limitString({string:value.note||"",charCount:12}))}
                                </span>
                            </HoverModal>,
            'Amount':value.type==="expense"?
                    <span className="text-red-600 font-medium">-$ {value.amount}</span>
                    :
                    <span className="text-green-600 font-medium">+$ {value.amount}</span>,
            'Status': value.recurring_id ? 
                    <span className="border border-neutral-800 rounded-2xl px-2 py-1 bg-neutral-700 font-medium text-white">Recurring</span>
                    :
                    <span className="border border-neutral-200 rounded-2xl px-2 py-1 bg-neutral-50 font-medium">One time</span>,
            'Actions':(
                <div className="flex justify-center gap-2">
                    <button 
                        onClick={() => handleEditTransaction(value)} 
                        className="border border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                    >
                        <EditIcon size={20} color="#3b3b3b"/>
                    </button>
                    <button 
                        onClick={() => handleDeleteTransaction(value.id)} 
                        className="border border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                    >
                        <TrashIcon size={20}/>
                    </button>
                </div>
                )
        }
    })||[];

    return TableData;
}