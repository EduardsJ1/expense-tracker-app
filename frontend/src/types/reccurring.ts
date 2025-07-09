

export interface ReccurringData{
    currentpage:number,
    totalPages:number,
    data:{
        id:number,
        user_id:number,
        amount:number,
        type:"income"|"expense",
        category:string,
        note?:string|null,
        recurrence_type: "daily" | "weekly"|"monthly"|"yearly"|"custom",
        custom_unit?:"hours"|"days"|"weeks"|"months",
        custom_interval?: number,
        
        start_date:string,
        end_date:string,
        next_occurrence:string,
        is_active:boolean,
        created_at:string,
        updated_at:string
    }[]
}

export interface updateReccuringType{
    amount?:number,
    type?:"income"|"expense",
    category?:string,
    recurrence_type?: "daily" | "weekly"|"monthly"|"yearly"|"custom",
    custom_unit?:"hours"|"days"|"weeks"|"months",
    custom_interval?: number,
    is_active?:boolean
}

export interface ReccurringType {
    id: number,
    user_id: number,
    amount: number,
    type: "income" | "expense",
    category: string,
    note?: string | null,
    recurrence_type: "daily" | "weekly"|"monthly"|"yearly"|"custom",
    custom_unit?:"hours"|"days"|"weeks"|"months",
    custom_interval?: number,
    start_date: string,
    next_occurrence: string,
    is_active: boolean,
    created_at: string,
    updated_at: string
}

export interface CreateReccurringType{
    user_id: number,
    amount: number,
    type: "income" | "expense",
    category: string,
    note?: string | null,
    recurrence_type: "daily" | "weekly"|"monthly"|"yearly"|"custom",
    custom_unit?:"hours"|"days"|"weeks"|"months",
    custom_interval?: number,
    start_date: string,
    is_active: boolean
}