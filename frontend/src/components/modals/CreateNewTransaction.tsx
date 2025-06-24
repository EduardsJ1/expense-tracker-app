import { useState,useEffect } from "react";
import {createTransaction,updateTransaction} from "../../api/transactions";
import type {createTransactionType,Transaction} from "../../types/transactions";
import { useAuth } from "../../hooks/useAuth";
import CategoryInput from "../ui/CategoryInput";

function NewTransactionModal(
    {display,closeModal,onTransactionCreate,transactionToEdit}:
    {display:boolean,closeModal:()=>void,onTransactionCreate:()=>void,transactionToEdit?:Transaction|null}){


    const {user}=useAuth();
    const [data,setData]=useState<createTransactionType>({user_id:0,type:"income",category:"",amount:0,note:""});
    const [errorCategory,setCategoryError]=useState(false);
    const [errorAmount,setAmountError]=useState(false);
    
    useEffect(() => {
        if (user?.id) {
            setData(prev => ({ ...prev, user_id: user.id }));
        }
        if(transactionToEdit){
            setData({
                user_id:user?.id||0,
                type:transactionToEdit.type,
                category:transactionToEdit.category,
                amount:transactionToEdit.amount,
                note:transactionToEdit.note
            })
        }else{
            setData({ user_id: user?.id ?? 0, type: "income", category: "", amount: 0, note: "" });
        }
    }, [transactionToEdit,user]);

    if(!display) return null;
    const handleSumbit=(e:React.FormEvent)=>{
        e.preventDefault();
        const isCategoryInvalid = !data.category || data.category === "";
        const isAmountInvalid = !data.amount || data.amount <= 0;
        console.log("submitting with this category",data.category);
        setCategoryError(isCategoryInvalid);
        setAmountError(isAmountInvalid);

        if (isCategoryInvalid || isAmountInvalid) {
            return;
        }
        //console.log(data);
        //console.log(user);
        if(transactionToEdit){
            updateTransaction(data,transactionToEdit.id).then(()=>{
                onTransactionCreate();
                closeModal();
            }).catch(error=>{
                console.error("Failed to create transaction:", error);
            })
        }else{
            createTransaction(data).then(() => {
                //console.log("created transaction");
                //console.log(data);
                onTransactionCreate();
                closeModal();
            })
            .catch(error => {
                console.error("Failed to create transaction:", error);
            });
        }
    }

    return(
        <>
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs `}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-3xl mx-12">
                <div className="relative">
                    <h2 className="text-xl font-bold text-center">{transactionToEdit?"Edit Transaction":"Create new Transaction"}</h2>
                    <button onClick={closeModal} className="px-3 py-1 text-neutral-400 text-xl rounded absolute -top-4 -right-2 hover:bg-neutral-200 hover:cursor-pointer">X</button>
                
                </div>
                <form className="" onSubmit={handleSumbit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="income"
                                    className="accent-green-600"
                                    checked={data.type === "income"}
                                    onChange={e => setData(prev => ({ ...prev, type: e.target.value as "income" | "expense" }))}
                                />
                                <span className="ml-2">Income</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="expense"
                                    className="accent-red-500"
                                    checked={data.type === "expense"}
                                    onChange={e => setData(prev => ({ ...prev, type: e.target.value as "income" | "expense" }))}
                                />
                                <span className="ml-2">Expense</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="pl-1">Category</label>
                        <CategoryInput onChange={(value)=>setData(prev=>({...prev,category:value}))}/>
                        <div className="text-red-400 h-5 pl-1">{errorCategory&&"Category cant be empty!"}</div>
                    </div>
                    <div>
                        <label>Amount</label>
                        <input 
                        onChange={e => setData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        type="text"
                        value={data.amount} 
                        className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-2 transition duration-300 ease focus:outline-none  shadow-sm focus:shadow ${errorAmount?"border-red-300 focus:border-red-400":"border-slate-200 focus:border-slate-400 hover:border-slate-300"}`}/>
                        <div className="text-red-400 h-5 pl-1">{errorAmount&&"Amount cant be 0 or less than 0!"}</div>
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            onChange={e => setData(prev => ({ ...prev, note: e.target.value }))} 
                            type="text"
                            value={data.note||""} 
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"/>
                    </div>
                    <div className="flex justify-center space-x-5 pt-5">
                        <button 
                            type="submit" 
                            className="hover:cursor-pointer bg-green-600 rounded-2xl px-3 py-0.5 font-medium text-white hover:bg-green-700">
                            {transactionToEdit?"Save Changes":"Create"}
                        </button>
                        <button type="button" className="hover:cursor-pointer bg-red-400 rounded-2xl px-3 py-0.5 font-medium text-white hover:bg-red-500" onClick={closeModal}>Cancel</button>
                    </div>
                </form>
                
            </div>
        </div>
        </>
    )
}

export default NewTransactionModal;