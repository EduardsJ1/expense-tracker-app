import type {ReccurringData} from "../types/reccurring"
import Pagination from "./Pagination"
import {formatLocalDateTime} from "../utils/formatDate"
import ResumeIcon from "./ui/icons/ResumeIcons"
import PausedIcon from "./ui/icons/PausedIcon"
import EditIcon from "./ui/icons/EditIcon"
import TrashIcon from "./ui/icons/TrashIcon"
import DeleteModal from "./modals/DeleteModal"
import { useState } from "react"

function ReccuringTransactionsTable({ReccuringData,handlePage,handlePause,handleDeleteReccuring}:{ReccuringData?:ReccurringData,handlePage:(page:number)=>void,handlePause:(id:number,is_active:boolean)=>void,handleDeleteReccuring:()=>void}){
    const [deleteDisplay,setDeleteDisplay]=useState(false);
    const [deleteid,setDeleteId]=useState(0);
    const handleDelete=(id:number)=>{
        setDeleteId(id);
        setDeleteDisplay(true);
    }

    const handleCloseDelete=()=>{
        setDeleteDisplay(false);
    }
    
  return (
    <div className="w-full bg-white mt-10 rounded-2xl p-5 pb-10 mb-10 shadow-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium">Reccuring Transactions</h2>
          <p className="text-base mt-1 text-neutral-500">
            Manage your automatic transactions
          </p>
        </div>
        <div>
          <button className="bg-green-600 text-white rounded-xl px-4 py-1 font-medium cursor-pointer hover:bg-green-700">
            Add Reccurring
          </button>
        </div>
      </div>

      {/* Table for larger screens */}
      <div className="hidden lg:block">
        <table className="mt-5 w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Transaction</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Reccurence</th>
              <th className="px-6 py-3 text-left">Next Execution</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ReccuringData &&
              ReccuringData.data.map((reccuring) => (
                <tr key={reccuring.id} className="border-t-1 border-neutral-300">
                  <td className="px-6 py-3 h-15 inline-block text-left">
                    <div className="flex">
                      <div>
                        <span
                          className={`w-3 h-3 inline-block rounded-full mr-2 ${
                            reccuring.type === "income"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3>{reccuring.category}</h3>
                        <p className="text-neutral-500 text-xs">
                          {reccuring.note}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <span
                      className={`text-2xs font-medium ${
                        reccuring.type === "income"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      $ {reccuring.amount}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <span>
                      {reccuring.recurrence_type === "hourly"
                        ? `Every ${reccuring.interval_hours} hours`
                        : reccuring.calendar_unit}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <span>{formatLocalDateTime(reccuring.next_occurrence)}</span>
                  </td>
                  <td className="px-6 py-3 text-left">
                    <span
                      className={`flex items-center rounded-full w-fit min-w-[75px] px-1 pr-2 py-0.5 text-sm font-normal gap-1 ${
                        reccuring.is_active
                          ? "bg-neutral-700 text-white"
                          : "bg-neutral-100 text-black"
                      }`}
                    >
                      {reccuring.is_active ? (
                        <>
                          <ResumeIcon size={16} color="#ffffff" />
                          Active
                        </>
                      ) : (
                        <>
                          <PausedIcon size={16} color="#000000" />
                          Paused
                        </>
                      )}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer">
                      <span>
                        <EditIcon size={20} color="#3b3b3b" />
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        handlePause(reccuring.id, !reccuring.is_active)
                      }
                      className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                    >
                      <span>
                        {reccuring.is_active ? (
                          <PausedIcon size={20} color="#f56a00" />
                        ) : (
                          <ResumeIcon size={20} color="#4ca300" />
                        )}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(reccuring.id)}
                      className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                    >
                      <span>
                        <TrashIcon size={20} />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="lg:hidden mt-5 space-y-4">
        {ReccuringData &&
          ReccuringData.data.map((reccuring) => (
            <div
              key={reccuring.id}
              className="bg-gray-50 rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 inline-block rounded-full mr-2 ${
                        reccuring.type === "income"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    />
                    <h3 className="font-bold">{reccuring.category}</h3>
                  </div>
                  <p className="text-neutral-500 text-sm">{reccuring.note}</p>
                </div>
                <span
                  className={`font-medium text-xl ${
                    reccuring.type === "income"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  $ {reccuring.amount}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Recurrence: </span>
                  {reccuring.recurrence_type === "hourly"
                    ? `Every ${reccuring.interval_hours} hours`
                    : reccuring.calendar_unit}
                </p>
                <p>
                  <span className="font-semibold">Next Execution: </span>
                  {formatLocalDateTime(reccuring.next_occurrence)}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span
                  className={`flex items-center rounded-full w-fit px-2 py-1 text-xs font-normal gap-1 ${
                    reccuring.is_active
                      ? "bg-neutral-700 text-white"
                      : "bg-neutral-100 text-black"
                  }`}
                >
                  {reccuring.is_active ? (
                    <>
                      <ResumeIcon size={14} color="#ffffff" /> Active
                    </>
                  ) : (
                    <>
                      <PausedIcon size={14} color="#000000" /> Paused
                    </>
                  )}
                </span>
                <div className="flex space-x-2">
                  <button className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer">
                    <EditIcon size={20} color="#3b3b3b" />
                  </button>
                  <button
                    className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                    onClick={() => handlePause(reccuring.id, !reccuring.is_active)}
                  >
                    {reccuring.is_active ? (
                      <PausedIcon size={20} color="#f56a00" />
                    ) : (
                      <ResumeIcon size={20} color="#4ca300" />
                    )}
                  </button>
                  <button 
                  className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                  onClick={() => handleDelete(reccuring.id)}>
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Pagination
        totalPages={ReccuringData?.totalPages || 1}
        currentPage={ReccuringData?.currentpage || 1}
        setPage={handlePage}
      />
      <DeleteModal
        display={deleteDisplay}
        closeModal={handleCloseDelete}
        onDeleted={handleDeleteReccuring}
        reccurringid={deleteid}
      />
    </div>
  );
}

export default ReccuringTransactionsTable;