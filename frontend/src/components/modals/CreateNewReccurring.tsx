import { useState,useEffect } from "react";
import {createReccurring,updateReccuring} from "../../api/reccurring";
import type {CreateReccurringType,ReccurringType} from "../../types/reccurring";
import { useAuth } from "../../hooks/useAuth";
import DropDownOptions from "../ui/DropDownOptions";
import CategoryInput from "../ui/CategoryInput";

function NewReccurringModal(
    {display,closeModal,onRecurringCreate,ReccuringToEdit}:
    {display:boolean,closeModal:()=>void,onRecurringCreate:()=>void,ReccuringToEdit?:ReccurringType|null}){
    const getDefaultStartDate = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    
    // If we're past the hour mark (minutes > 0), round up to next hour
    if (currentMinutes > 0) {
        now.setHours(now.getHours() + 1);
    }
    
    // Set minutes, seconds, and milliseconds to 0
    now.setMinutes(0, 0, 0);
    
    return now.toISOString();
    };

    const {user}=useAuth();
    const [data,setData]=useState<CreateReccurringType>({user_id:0,type:"income",category:"",amount:0,note:null,recurrence_type:"daily",custom_interval:1,custom_unit:"hours",start_date:getDefaultStartDate(),is_active:true});
    const [errorCategory,setCategoryError]=useState(false);
    const [errorAmount,setAmountError]=useState(false);
    const [amount,setAmount]=useState("");
    
    const resetInput = ()=>{
        setData((prev)=>({...prev,type:"income",category:"",amount:0,note:null,recurrence_type:"daily",custom_interval:1,custom_unit:"hours",start_date:getDefaultStartDate(),is_active:true}));
        setAmount("");
    }
    useEffect(() => {
        if (user?.id) {
            setData(prev => ({ ...prev, user_id: user.id }));
        }
        if(ReccuringToEdit){
            setData({
                user_id:user?.id||0,
                type:ReccuringToEdit.type,
                category:ReccuringToEdit.category,
                amount:Number(ReccuringToEdit.amount),
                note:ReccuringToEdit.note,
                recurrence_type:ReccuringToEdit.recurrence_type,
                custom_unit:ReccuringToEdit.custom_unit,
                custom_interval:ReccuringToEdit.custom_interval,
                start_date:ReccuringToEdit.start_date,
                is_active:ReccuringToEdit.is_active
            })
            setAmount(ReccuringToEdit.amount.toString());
        }else{
            setData({user_id: user?.id ?? 0,type:"income",category:"",amount:0,note:null,recurrence_type:"daily",custom_interval:1,custom_unit:"hours",start_date:getDefaultStartDate(),is_active:true});
            setAmount("");
        }
    }, [ReccuringToEdit,user]);

    if(!display) return null;
    const handleSumbit=(e:React.FormEvent)=>{
        e.preventDefault();
        const isCategoryInvalid = !data.category || data.category === "";
        const isAmountInvalid = !data.amount || data.amount <= 0;

        setCategoryError(isCategoryInvalid);
        setAmountError(isAmountInvalid);

        if (isCategoryInvalid || isAmountInvalid) {
            return;
        }
        //console.log(data);
        //console.log(user);
        if(ReccuringToEdit){
            updateReccuring(ReccuringToEdit.id,data).then(()=>{
                resetInput();
                onRecurringCreate();
                closeModal();
            }).catch(error=>{
                console.error("Failed to create transaction:", error);
            })
        }else{
            createReccurring(data).then(() => {
                //console.log("created transaction");
                //console.log(data);
                resetInput();
                onRecurringCreate();
                closeModal();
            })
            .catch(error => {
                console.error("Failed to create transaction:", error);
            });
        }
    }


      const handleAmount = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value;
        if (!/^\d*\.?\d*$/.test(value)) {
            return;
        }
        setAmount(value);
        setData(prev => ({ ...prev, amount:Number(value)}))
    }

    return(
        <>
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs `}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-xl mx-12 max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <h2 className="text-xl font-bold text-center">{ReccuringToEdit?"Edit Reccurring Transaction":"Create new Reccurring Transaction"}</h2>
                    <button onClick={()=>{closeModal(); resetInput()}} className="px-3 py-1 text-neutral-400 text-xl rounded absolute -top-4 -right-2 hover:bg-neutral-200 hover:cursor-pointer">X</button>
                
                </div>
                <form className="" onSubmit={handleSumbit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Type</label>
                        <DropDownOptions values={["income","expense"]} value={data.type} onChange={(value)=> setData(prev => ({ ...prev, type: value }))}/>
                    </div>

                    <div>
                        <label className="pl-1">Category</label>
                        <CategoryInput value={data.category} onChange={(value)=>setData((prev)=>({...prev,category:value}))} type={data.type}/>
                        <div className="text-red-400 h-5 pl-1">{errorCategory&&"Category cant be empty!"}</div>
                    </div>
                    <div>
                        <label>Amount</label>
                        <input 
                        onChange={handleAmount}
                        type="text"
                        value={amount} 
                        className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-2 transition duration-300 ease focus:outline-none  shadow-sm focus:shadow ${errorAmount?"border-red-300 focus:border-red-400":"border-slate-200 focus:border-slate-400 hover:border-slate-300"}`}/>
                        <div className="text-red-400 h-5 pl-1">{errorAmount&&"Amount cant be empty!"}</div>
                    </div>
                    <div>
                        <label>Description (Optional)</label>
                        <input
                            onChange={e => setData(prev => ({ ...prev, note: e.target.value }))} 
                            type="text"
                            value={data.note||""} 
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"/>
                    </div>

                    <div className="bg-blue-50 mt-5 rounded-lg px-2 py-2">
                        <h3 className="text-2xl">Recurrence Setting</h3>
                        <div>
                            <label className="text-neutral-600 ml-1">Recurrence Pattern</label>
                            <DropDownOptions values={["daily","weekly","monthly","yearly","custom"]} value={data.recurrence_type} onChange={(value)=>setData((prev)=>({...prev,recurrence_type:value}))}/>
                        </div>
                        {data.recurrence_type==="custom"&&
                        <div className="flex flex-wrap justify-between gap-4">
                            <div className="flex-1 w-min-[60px]">
                                <label>Every</label>
                                <div>
                                    <input
                                        className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        type="number"
                                        value={data.custom_interval || 1}
                                        onChange={e => setData(prev => ({ ...prev, custom_interval: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 w-min-[60px]">
                                <label>Unit</label>
                                <div>
                                    <DropDownOptions
                                        values={["hours", "days", "weeks", "months"]}
                                        value={data.custom_unit}
                                        onChange={value => setData(prev => ({ ...prev, custom_unit: value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="bg-blue-100 mt-5 rounded-lg px-2 py-2">
                        <h3 className="text-2xl">Schedule Settings</h3>
                        <div className="flex flex-wrap justify-between gap-4">
                                <div className="flex-1 w-min-[60px]">
                                    <label>Start Date</label>
                                    <div>
                                        <input
                                            className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            type="date"
                                            value={data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : ''}
                                            onChange={e => {
                                                const selectedDate = e.target.value; // This will be in YYYY-MM-DD format
                                                if (selectedDate) {
                                                    // Get the existing date to preserve the time
                                                    const existingDate = new Date(data.start_date);
                                                    const [year, month, day] = selectedDate.split('-');
                                                    
                                                    // Create new date with selected date but preserve existing time
                                                    const newDate = new Date(existingDate);
                                                    newDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
                                                    
                                                    setData(prev => ({ ...prev, start_date: newDate.toISOString() }));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 w-min-[60px]">
                                    <label>Time</label>
                                    <div>
                                        <DropDownOptions
                                            values={[
                                                "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
                                                "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
                                                "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
                                                "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
                                            ]}
                                            value={
                                                (() => {
                                                    if (!data.start_date) return "00:00";
                                                    const date = new Date(data.start_date);
                                                    let hours = date.getHours();
                                                    const minutes = date.getMinutes();
                                                    // Round up if minutes > 0
                                                    if (minutes > 0) {
                                                        hours = (hours + 1) % 24;
                                                    }
                                                    return `${hours.toString().padStart(2, "0")}:00`;
                                                })()
                                            }
                                            onChange={value => {
                                                setData(prev => {
                                                    const date = new Date(prev.start_date || new Date().toISOString());
                                                    const [hours, minutes] = value.split(":").map(Number);
                                                    date.setHours(hours, minutes, 0, 0);
                                                    return { ...prev, start_date: date.toISOString() };
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div className="flex justify-center space-x-5 pt-5">
                        <button 
                            type="submit" 
                            className="hover:cursor-pointer bg-green-600 rounded-2xl px-3 py-0.5 font-medium text-white hover:bg-green-700">
                            {ReccuringToEdit?"Save Changes":"Create"}
                        </button>
                        <button type="button" className="hover:cursor-pointer bg-red-400 rounded-2xl px-3 py-0.5 font-medium text-white hover:bg-red-500" onClick={()=>{closeModal(),resetInput()}}>Cancel</button>
                    </div>
                </form>
                
            </div>
        </div>
        </>
    )
}

export default NewReccurringModal;