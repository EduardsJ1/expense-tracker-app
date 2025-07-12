type TableRow = {
    [key: string]:string|number|React.ReactNode
}



function Table({columns,data}:{columns:string[],data:TableRow[]}){

    return(
        <div className="overflow-y-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-neutral-300">
                        {columns.map((item,index)=>(
                            <th 
                                key={`thead-${index}`}
                                scope="col"
                                className="px-6 py-3"
                            >
                                {item}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <div className="w-full h-60 px-10">
                                    <div className="bg-neutral-100 rounded-2xl h-full flex items-center justify-center mt-2">
                                        <p className="text-neutral-400">No data available</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row: TableRow, rowIndex: number) => (
                            <tr key={`row-${rowIndex}`} className="border-b border-neutral-200">
                                {(Object.values(row) as React.ReactNode[]).map((value, colIndex) => (
                                    <td 
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        className="text-center py-4"
                                    
                                    >
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}


export default Table;