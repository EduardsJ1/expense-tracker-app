import type { ReccurringData,ReccurringType } from "../types/reccurring";
import Pagination from "./Pagination";
import { formatLocalDateTime } from "../utils/formatDate";
import ResumeIcon from "./ui/icons/ResumeIcons";
import PausedIcon from "./ui/icons/PausedIcon";
import EditIcon from "./ui/icons/EditIcon";
import TrashIcon from "./ui/icons/TrashIcon";
import DeleteModal from "./modals/DeleteModal";
import { useState } from "react";

function ReccuringTransactionsCards({
  ReccurringData,
  handlePage,
  handlePause,
  handleDeleteReccuring,
  openReccuringModal
}: {
  ReccurringData?: ReccurringData;
  handlePage: (page: number) => void;
  handlePause: (id: number, is_active: boolean) => void;
  handleDeleteReccuring: () => void;
  openReccuringModal:(reccurringData?:ReccurringType)=>void
}) {
  const [deleteDisplay, setDeleteDisplay] = useState(false);
  const [deleteid, setDeleteId] = useState(0);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDisplay(true);
  };

  const handleCloseDelete = () => {
    setDeleteDisplay(false);
  };

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
          <button onClick={()=>openReccuringModal()} className="bg-green-600 text-white rounded-xl px-4 py-1 font-medium cursor-pointer hover:bg-green-700">
            Add Reccurring
          </button>
        </div>
      </div>

      {/* Mobile-first card layout */}
      <div className="mt-6 space-y-4">
        {ReccurringData &&
          ReccurringData.data.map((reccuring) => (
            <div
              key={reccuring.id}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 transition-shadow hover:shadow-md"
            >
              {/* Top Section: Category and Amount */}
              <div className="flex justify-between items-center pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      reccuring.type === "income"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">
                      {reccuring.category}
                    </h3>
                    <p className="text-neutral-500 text-sm">{reccuring.note}</p>
                  </div>
                </div>
                <div
                  className={`text-xl font-semibold ${
                    reccuring.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {reccuring.type === "income" ? "+$" : "-$"}
                  {reccuring.amount}
                </div>
              </div>

              {/* Middle Section: Details */}
              <div className="flex justify-between text-sm py-4 border-y border-neutral-200">
                <div>
                  <p className="text-neutral-500">Recurrence</p>
                  <p className="font-medium text-neutral-700">
                    {reccuring.recurrence_type === "custom"
                      ? `Every ${reccuring.custom_interval} ${reccuring.custom_unit}`
                      :reccuring.recurrence_type}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Next Execution</p>
                  <p className="font-medium text-neutral-700">
                    {formatLocalDateTime(reccuring.next_occurrence)}
                  </p>
                </div>
              </div>

              {/* Bottom Section: Status and Actions */}
              <div className="flex justify-between items-center pt-3">
                <span className={`flex items-center rounded-full w-fit min-w-[75px] px-1 pr-2 py-0.5 text-sm font-normal gap-1 ${reccuring.is_active?"bg-neutral-700 text-white":"bg-neutral-200 text-black"}`}>
                    {reccuring.is_active?(<><ResumeIcon size={16} color="#ffffff"/>Active</>):(<><PausedIcon size={16} color="#000000"/>Paused</>)}
                </span>
                <div className="flex items-center space-x-1">
                  <button onClick={()=>openReccuringModal(reccuring)} className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer">
                    <EditIcon size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handlePause(reccuring.id, !reccuring.is_active)
                    }
                    className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                  >
                    {reccuring.is_active ? (
                      <PausedIcon size={20} color="#f56a00" />
                    ) : (
                      <ResumeIcon size={20} color="#4ca300" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(reccuring.id)}
                    className="border-1 border-neutral-400 rounded-md p-2 hover:bg-neutral-300 cursor-pointer"
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Pagination
        totalPages={ReccurringData?.totalPages || 1}
        currentPage={ReccurringData?.currentpage || 1}
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

export default ReccuringTransactionsCards;