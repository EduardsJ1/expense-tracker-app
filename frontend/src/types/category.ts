export interface CategoryFilters{
    search?:string,
    items?:number,
    type?:"income"|"expense"
}


export interface CategorySummary{
    category:string,
    totalamount:number,
    count:number,
    precentage:number
}

export interface CategorySummaryFilters{
    startDate?:string,
    endDate?:string,
    type?:"income"|"expense",
    sortBy?:"totalAmount"|"count"|"category",
    orderBy?:"asc"|"desc",
    limit?:number|"all"
}
