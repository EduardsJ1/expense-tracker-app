

export interface ReccurringData{
    currentpage:number,
    totalPages:number,
    data:[{
        id:number,
        user_id:number,
        amount:string,
        type:"income"|"expense",
        category:string,
        note?:string|null,
        recurrence_type:"hourly"|"calendar",
        interval_hours?:number,
        calendar_unit?:"daily"|"weekly"|"monthly",
        
        start_date:string,
        end_date:string,
        next_occurrence:string,
        is_active:boolean,
        created_at:string,
        updated_at:string
    }]
}

export interface updateReccuringType{
    amount?:number,
    type?:"income"|"expense",
    category?:string,
    recurrence_type?:"hourly"|"calendar",
    calendar_unit?:"daily"|"weekly"|"monthly",
    interval_hours?:number,
    is_active?:boolean
}