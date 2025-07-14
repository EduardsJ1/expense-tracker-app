import type {ReccurringData, ReccurringType} from "../types/reccurring"
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import { formatLocalDateTime } from "../../../utils/formatDate";
import {ResumeIcon, PausedIcon,EditIcon, TrashIcon} from "../../../components/ui/icons";
import ReccuringTransactionsCards from "./ReccuringTransactionsCards";
import firstCharToUpperCase from "../../../utils/firstCharToUpperCase";
import HoverModal from "../../../components/HoverModal";
import limitString from "../../../utils/limitString";
function ReccurringTransactionView(
    {RecurringTransactionsData, onPageChange,onCreateRecurring,onSetActive,onDelete}:
    {
        RecurringTransactionsData?:ReccurringData, 
        onPageChange:(page:number)=>void,
        onCreateRecurring:(recurring?:ReccurringType)=>void,
        onSetActive:(id:number,isActive:boolean)=>void,
        onDelete:(id:number)=>void,
    }){
        const TableData = FromatTableData({
        ReccurringTransactioData: RecurringTransactionsData,
        handleEdit: onCreateRecurring,
        handleActive: onSetActive,
        handleDelete: onDelete
    });
    
    return(
        <div className="w-full bg-white mt-10 rounded-2xl p-5 pb-10 mb-10 shadow-xl">
            <div className="flex justify-between flex-wrap items-center">
                <div>
                    <h2 className="text-2xl font-medium">Reccuring Transactions</h2>
                    <p className="text-base mt-1 text-neutral-500">Manage your automatic transactions</p>
                </div>
                <div>
                    <button onClick={()=>onCreateRecurring()} className="bg-green-600 text-white rounded-xl px-4 py-1 font-medium cursor-pointer hover:bg-green-700">Add Reccurring</button>
                </div>
            </div>
            <div className="hidden lg:block">
                <Table columns={["Transaction","Amount","Reccurence","Next Execution","Status","Actions"]} data={TableData}/>
            </div>
            <div className="block lg:hidden">
                <ReccuringTransactionsCards ReccurringData={RecurringTransactionsData} handleEdit={onCreateRecurring} handlePause={onSetActive} handleDeleteReccuring={onDelete}/>
            </div>
            <Pagination totalPages={RecurringTransactionsData?.totalPages||1} currentPage={RecurringTransactionsData?.currentpage||1} setPage={onPageChange}/>
        </div>
    )
}

export default ReccurringTransactionView;


const FromatTableData=(
    {ReccurringTransactioData,handleEdit,handleActive,handleDelete}:
    {
        ReccurringTransactioData?:ReccurringData,
        handleEdit:(recurring:ReccurringType)=>void,
        handleActive:(id:number,isActive:boolean)=>void,
        handleDelete:(id:number)=>void
    })=>{

    const TableData = ReccurringTransactioData?.data.map((recurring)=>{
        return{
        "Transacton":<div>
                        <div className="flex items-center gap-2">
                            {recurring.type==="income"?
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>:
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            }
                            <p className="font-medium">
                                {firstCharToUpperCase(recurring.category)}
                            </p>
                        </div>
                        <div>
                            <p className="text-left text-neutral-400 cursor-default">
                                <HoverModal 
                                    content={<p className="text-black">{recurring.note}</p>}
                                    delay={200}
                                >
                                    {limitString({string:recurring.note||"",charCount:12})}
                                </HoverModal>
                                </p>
                        </div>
                    </div>,
        "Amount":recurring.type==="income"?
                    <div className="text-green-600 font-medium">+$ {recurring.amount}</div>:
                    <div className="text-red-600 font-medium">-$ {recurring.amount}</div>,
        "Reccurence":recurring.recurrence_type==="custom"?
                    <p>Every {recurring.custom_interval} {recurring.custom_unit}</p>:
                    <p>{recurring.recurrence_type}</p>,
        "Next Execution": <p>{formatLocalDateTime(recurring.next_occurrence)}</p>,
        "Status":<span className={`flex items-center rounded-full w-fit min-w-[75px] px-1 pr-2 py-0.5 text-sm font-normal gap-1 ${recurring.is_active?"bg-neutral-700 text-white":"bg-neutral-200 text-black"}`}>
                    {recurring.is_active?(<><ResumeIcon size={16} color="#ffffff"/>Active</>):(<><PausedIcon size={16} color="#000000"/>Paused</>)}
                </span>,
        "Actions":<div className="flex items-center gap-1">
                    <button className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer" onClick={()=>handleEdit(recurring)}>
                        <EditIcon/>
                    </button>
                    <button className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer" onClick={()=>handleActive(recurring.id,!recurring.is_active)}>
                        {recurring.is_active ?
                            <PausedIcon size={20} color="#f56a00" />:
                            <ResumeIcon size={20} color="#4ca300" />
                        }
                    </button>
                    <button className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer" onClick={()=>handleDelete(recurring.id)}>
                        <TrashIcon size={20} />
                    </button>
                </div>
        }
    })||[]

    return TableData;
}