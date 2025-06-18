import React, {useState} from "react";

const Pagination =({totalPages,currentPage,setPage}:{totalPages:number,currentPage:number,setPage:(page:number)=>void})=>{
    //console.log(currentPage);
    const getPageNumbers=()=>{
        const pageNumbers=[];
        const maxVisibleButtons = 3;

        let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 1);

        // Adjust startPage if endPage is at the maximum limit
        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(2, endPage - maxVisibleButtons + 1);
        }

        for(let i=startPage; i<=endPage; i++){
            pageNumbers.push(i);
        }
        return pageNumbers;
    }

    return(
        <div className="flex justify-center space-x-5 pt-10">
            <button
        className={`rounded-xl w-25 py-1 hover:bg-neutral-200 shadow-2xs cursor-pointer disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-default ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>

        <button
        className={`rounded-xl w-10 py-1 hover:bg-neutral-200 shadow-2xs cursor-pointer ${
            1 === currentPage ? "bg-neutral-200 text-black font-bold" : ""
          }`}
        onClick={() => setPage(1)}
        disabled={currentPage <= 1}
      >
        1
      </button>
      {/* Page Buttons */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`rounded-xl w-10 py-1 hover:bg-neutral-200 shadow-2xs cursor-pointer ${
            page === Number(currentPage) ? "bg-neutral-200 text-black font-bold" : ""
          }`}
          onClick={() => setPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`rounded-xl w-10 py-1 hover:bg-neutral-200 shadow-2xs cursor-pointer ${
            Number(totalPages) ===currentPage ? "bg-neutral-200 text-black font-bold" : ""
          }${Number(totalPages)===1?" hidden":""}`}
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        {totalPages}
      </button>
      <button
        className={`rounded-xl w-25 py-1 hover:bg-neutral-200 shadow-2xs cursor-pointer  disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-default ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => {setPage(Number(currentPage) + 1);}}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>

      
      
      
        </div>
    )

}

export default Pagination;