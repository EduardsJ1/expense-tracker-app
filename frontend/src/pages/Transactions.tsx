import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import NewTransactionModal from "../components/modals/CreateNewTransaction";
import type {FileterOptions} from "../hooks/useTransactions"
import { formatLocalDateTime } from "../utils/formatDate";
import type { Transaction } from "../types/transactions";
import DeleteModal from "../components/modals/DeleteModal";
import TrashIcon from "../components/ui/icons/TrashIcon";
import EditIcon from "../components/ui/icons/EditIcon";
function TransactionsPage(){    
    const [filters,setFilters]=useState<FileterOptions>({
        page:1,
        items:10,
        sortBy:undefined,
        sortOrder: undefined,
        search:undefined,
        type:null,
        category:undefined,
        maxAmount:undefined,
        minAmount:undefined,
        from:undefined ,
        to:undefined,
        hasNote:undefined,
        refreshKey:undefined
    });

    const [Modaldisplay,setModalDisplay]=useState(false);
    const [transaction,setTransaction]=useState<Transaction|null>(null);
    const [deleteDisplay,setDeleteDisplay]=useState(false);
    const [transactionDeleteid,setDeleteTransactionId]=useState(0);

    const handleDeleteTransaction=(id:number)=>{
        setDeleteTransactionId(id)
        setDeleteDisplay(true);
    }
    const handleNewTransaction=()=>{
        setTransaction(null);
        setModalDisplay(true);
    }
    const handleEditTransaction=(transaction:Transaction)=>{
        setTransaction(transaction);
        setModalDisplay(true);
    }
    const handleRefreshTransactions = () => {
    setFilters((prev) => ({ ...prev, page:1, refreshKey: Date.now() }));
    //console.log("page set");
    };


    const {transactions,loading,error}=useTransactions(filters);
    //console.log(transactions?.data)

    const handlePage=(page:number)=>{
        setFilters((prev)=>({...prev,page}));
    }
    const handleSort = (sortBy:string)=>{
        setFilters((prev)=>({...prev,sortBy}));
    };

    const handleSortOrder = (sortOrder: string) => {
        setFilters((prev) => ({ ...prev, sortOrder }));
    };

    const handleSearch = (search:string)=>{
        setFilters((prev)=>({...prev,search}))
    };    
    
    const handleType = (type: "income" | "expense" | null) => {
        setFilters((prev) => ({ ...prev, type }));
    };
    
    const handleCategory = (category: string | undefined) => {
        setFilters((prev) => ({ ...prev, category }));
    };

    const handleMaxAmount = (maxamount: number | undefined) => {
        setFilters((prev) => ({ ...prev, maxamount }));
    };

    const handleMinAmount = (minamount: number | undefined) => {
        setFilters((prev) => ({ ...prev, minamount }));
    };

    const handleFromDate = (from: string | undefined) => {
        setFilters((prev) => ({ ...prev, from }));
    };

    const handleToDate = (to: string | undefined) => {
        setFilters((prev) => ({ ...prev, to }));
    };

    const handleHasNote = (hasNote: boolean) => {
        setFilters((prev) => ({ ...prev, hasNote }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const handleItemsPerPage = (items: number) => {
        setFilters((prev) => ({ ...prev, items }));
    };
    return(
        <>
        <Navbar/>
        <div className="pt-30 pr-10 pl-10">
            <div>
                <h1 className="text-3xl font-bold">Transactions</h1>
                <p className="mt-2">Manage and track all your financial transactions</p>
            </div>            
            <div className="bg-white rounded-2xl p-5 shadow-2xs">
                <h2 className="text-2xl">Filters & Search</h2>
                <p className="text-neutral-500">Find and filter your transactions</p>
                <div className="flex gap-4 items-center ">
                    <input 
                        className="p-2 border border-gray-300 rounded-lg" 
                        type="text" 
                        placeholder="Search transaction..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    
                    <select 
                        value={filters.type || ""} 
                        onChange={(e) => handleType(e.target.value === "" ? null : e.target.value as "income" | "expense")}
                        className="p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>
            {/* {loading && <p>Loading...</p>} */}
            {error&&<p>{error}</p>}
            <div className="w-full bg-white mt-10 rounded-2xl p-5 pb-10 mb-10 shadow-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-medium">Transaction history</h2>
                        <p className="mt-1 text-neutral-600">Page: {transactions?.currentpage}/{transactions?.totalPages}</p>
                    </div>
                    <div >
                        <button onClick={handleNewTransaction} className="bg-green-600 text-white rounded-xl px-4 py-1 font-medium cursor-pointer hover:bg-green-700"><span className="mr-2 text-[20px] font-bold leading-none">+</span>Add Transaction</button>
                    </div>
                </div>
                <table className="mt-5 rounded-t-lg border-separate border border-neutral-400 w-full">
                    <thead>
                        <tr>
                            <th scope="col"  className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3" >Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {transactions?.data.map((transaction)=>(
                        <tr key={transaction.id} className="">
                            <td className="px-6 py-3 text-center">{formatLocalDateTime(transaction.created_at)}</td>
                            <td className="px-6 py-3 text-center">{transaction.type==="income"?<span className="bg-green-100 text-green-600 text-xs font-medium rounded-full px-2 py-0.5">Income</span>:<span className="bg-red-100 text-red-600 font-medium text-xs rounded-full px-2 py-0.5 ">Expense</span>}</td>
                            <td className="px-6 py-3 text-center"><span className="bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full text-xs">{transaction.category}</span></td>
                            <td className="px-6 py-3 text-center">{transaction.note}</td>
                            <td className="px-6 py-3 text-center">{transaction.type==="income"?<span className="text-green-700 font-bold">+$ {transaction.amount}</span>:<span className="text-red-700 font-bold">-$ {transaction.amount}</span>}</td>
                            <td className="px-6 py-3 text-center">{transaction.recurring_id ? (<span className="bg-cyan-50 text-blue-700 font-bold rounded-full px-2 py-0.5 text-xs ">recurring</span>) : ""}</td>
                            
                            <td className="px-6 py-3 flex justify-around">
                                <button  onClick={()=>handleEditTransaction(transaction)} className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"><span><EditIcon size={20} color="#3b3b3b"/></span></button>
                                
                                <button onClick={()=>handleDeleteTransaction(transaction.id)} className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"><span><TrashIcon size={20}/></span></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination totalPages={transactions?.totalPages||1} currentPage={Number(transactions?.currentpage)||1} setPage={handlePage}/>
            </div>
        </div>
        <DeleteModal display={deleteDisplay} closeModal={()=>setDeleteDisplay(false)} onDeleted={handleRefreshTransactions} transactionid={transactionDeleteid}/>
        <NewTransactionModal display={Modaldisplay} closeModal={()=>setModalDisplay(false)} onTransactionCreate={handleRefreshTransactions} transactionToEdit={transaction}/>
        </>
    )
}

export default TransactionsPage;