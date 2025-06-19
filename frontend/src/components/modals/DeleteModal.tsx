import {deleteReccuring} from "../../api/reccurring";
import { deleteTransaction } from "../../api/transactions";

function DeleteModal(
    {display,closeModal,onDeleted,transactionid,reccurringid}:
    {display:boolean,closeModal:()=>void,onDeleted:()=>void,transactionid?:number,reccurringid?:number})
    {

    const handleDelete=()=>{
        if(reccurringid){
            deleteReccuring(reccurringid);
            onDeleted();
            closeModal();
        }else if(transactionid){
            deleteTransaction(transactionid);
            onDeleted();
            closeModal();
        }else{
            console.log("id not provided");
        }
    }

    
    

    if(!display) return null;
    return(
         <>
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs `}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-xl mx-12">
                <div className="relative">
                    <h2 className="text-xl font-bold text-center">{reccurringid?"Delete this reccurring transaction?":"Delete this transaction?"}</h2>
                    <button onClick={closeModal} className="px-3 py-1 text-neutral-400 text-xl rounded absolute -top-4 -right-2 hover:bg-neutral-200 hover:cursor-pointer">X</button>
                </div>

                <div className="mt-10 flex justify-center gap-5">
                    <button className="cursor-pointer bg-red-400 rounded-2xl px-4 py-1 text-white font-medium hover:bg-red-500" onClick={()=>handleDelete()}>Delete</button>
                    <button className="cursor-pointer border border-neutral-300  rounded-2xl px-4 py-1 font-medium hover:bg-neutral-50" onClick={closeModal}>Cancel</button>
                </div>
                
            </div>
        </div>
        </>
    );
}

export default DeleteModal;