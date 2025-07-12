import express from 'express';
import db from '../db';
import {PredictionDataPoint,FinancialPrediction} from '../types'
declare global {
    namespace Express {
        interface Request {
            userId?: number;
            
        }
    }
}
export const createTransaction= async (req: express.Request, res: express.Response)=>{
    try{
        const userId=req.userId;
        const {amount, type, category, note} = req.body;
        if(!amount || !type || !category){
            res.status(400).json({message:"request didnt include amount, type, category"});
            return;
        }

        const transactionNote= note || null;
        const categoryLowerCase = category.toLowerCase();
        const result = await db.query(
            "INSERT INTO transactions (user_id,amount,type,category,note) VALUES ($1,$2,$3,$4,$5) RETURNING id,amount,type,category,note, created_at",
            [userId, amount, type, categoryLowerCase, transactionNote]
        );

        res.status(201).json(result.rows[0]);

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const getTransactions= async (req:express.Request, res: express.Response)=>{
    try{
        const userId= req.userId;
        const {
            includeUpdated,//set date type to include updated_at (true / false)
            from, // start date "YYYY-MM-DD"
            to, // end date "YYYY-MM-DD"
            
            type, // set type for "income" or "expense"
            category, // specific category "wage" or multiple "wage,food,car"
            
            maxAmount, // maximum amount
            minAmount, // minimum amount

            sortBy='created_at', // sort by category, amount, type, updated_at, default(created_at)
            sortOrder='desc', // sort order asc or desc

            page=1, // page number (default 1)
            items=10, // items in page (default 10)

            search, // search for what is included in note or category ("wag")=>note ("this months wage");


            hasNote, //true false, if row has note
            isRecurring //true (only with recurring id) false(only without recurring id) undefined (all)
        
        } = req.query;
        const conditions = ['user_id=$1'];
        const values = [userId] as any;
        let paramIndex = 2;
        const dateField = includeUpdated ==='true'?'updated_at' : 'created_at';
       
        //date filter
        if(from){
            conditions.push(`DATE(${dateField}) >= $${paramIndex}`);
            values.push(from);
            paramIndex++;
        }

        if(to){
            conditions.push(`DATE(${dateField}) <= $${paramIndex}`);
            values.push(to);
            paramIndex++;
        }
        // type filter
        if(type && ['income','expense'].includes(type as string)){
            conditions.push(`type = $${paramIndex}`);
            values.push(type);
            paramIndex++;
        }

        // category filter
        if (typeof category === 'string' && category.trim() !== '') {
            if (category.includes(",")) {
                // Multiple categories
                const categoryList = category.split(",").map(item => item.trim());
                const placeholders = categoryList.map(() => `$${paramIndex++}`).join(',');
                conditions.push(`category IN (${placeholders})`);
                values.push(...categoryList);
            } else {
                // Single category
                conditions.push(`category = $${paramIndex}`);
                values.push(category);
                paramIndex++;
            }
        }

        //min max amount
        if(minAmount){
            conditions.push(`amount >= $${paramIndex}`);
            values.push(minAmount);
            paramIndex++;
        }

        if(maxAmount){
            conditions.push(`amount <= $${paramIndex}`);
            values.push(maxAmount);
            paramIndex++;
        }

        //search for category or note contents
        if(search){
            conditions.push(`(note LIKE $${paramIndex} OR category LIKE $${paramIndex+1})`);
            values.push(`%${search}%`, `%${search}%`);
            paramIndex+=2;
        }


        // transaction has note attached or not
        if(hasNote){
            if(hasNote==="true"){
                conditions.push(`note IS NOT NULL AND note != ''`);
            } else{
                conditions.push(`note IS NULL OR note = ''`);
            }
        }

        if(isRecurring){
            if(isRecurring==="true"){
                conditions.push(`recurring_id IS NOT NULL`);
            }else if(isRecurring==="false"){
                conditions.push(`recurring_id IS NULL`);
            }
        }

        const whereClause = conditions.join(' AND ');
        const validSortBy = ['created_at', 'amount', 'type', 'category', 'updated_at'].includes(sortBy as string) ? sortBy: 'created_at'; //add created_at if sortby dosent include params
        const validOrder = sortOrder === 'asc' ? 'ASC':'DESC';

        const pageNum = parseInt(page as string) || 1;
        const itemsPerPage = parseInt(items as string) || 10;
        const offset = (pageNum -1) * itemsPerPage;

        const countQuery = `SELECT COUNT(*) FROM transactions WHERE ${whereClause}`;
        const countResult = await db.query(countQuery,values);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems/itemsPerPage);


        const query = `SELECT * FROM transactions WHERE ${whereClause} ORDER BY ${validSortBy} ${validOrder} LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;

        values.push(itemsPerPage,offset);

        const result = await db.query(query,values);

        res.status(200).json({
            currentpage:page,
            totalPages:totalPages,
            data:result.rows
        });
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const getTransaction = async (req:express.Request, res: express.Response)=>{
    try{
        const {id}=req.params;
        const userId = req.userId;

        const result = await db.query('SELECT * FROM transactions WHERE user_id=$1 AND id=$2',[userId,id]);

        if(result.rows.length == 0){
            res.status(404).json({message:'no transaction found'});
            return;
        }

        res.status(200).json(result.rows[0]);

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

function fillMissingPeriods(data:any[],groupBy:string,from?:string,to?:string){
    if(data.length===0){
        return data;
    }

    const startDate = from ? new Date(from): new Date(data[0].period);
    const endDate = to ? new Date(to): new Date(data[data.length-1].period);

    const dataMap = new Map();
    data.forEach(row =>{
        const key = new Date(row.period).toISOString();
        dataMap.set(key,row);
    })

    const completeData = [];
    const current = new Date(startDate);

    while(current<=endDate){
        let periodStart: Date;

        if (groupBy === 'month') {
            periodStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1));
        } else if (groupBy === 'year') {
            periodStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));
        } else if (groupBy === 'day') {
            periodStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()));
        } else {
            periodStart = new Date(current);
        }

        const key = periodStart.toISOString();

        if (dataMap.has(key)) {
            completeData.push(dataMap.get(key));
        } else {
            completeData.push({
                period: periodStart.toISOString(),
                total_income: 0,
                total_expense: 0,
                balance: 0
            });
        }

        if (groupBy === 'month') {
            current.setUTCMonth(current.getUTCMonth() + 1);
        } else if (groupBy === 'year') {
            current.setUTCFullYear(current.getUTCFullYear() + 1);
        } else if (groupBy === 'day') {
            current.setUTCDate(current.getUTCDate() + 1);
        }
    }

    return completeData;
}


export const getTransactionsSummary = async (req: express.Request, res: express.Response)=>{
    try{
        const userId = req.userId;
        const {
            groupBy, //adds group by "year" or "month" or "day"
            from, // date from YYYY-MM-DD
            to, // date to YYYY-MM-DD
        } = req.query;

        const conditions = ['user_id=$1'];
        const values = [userId] as any;
        let groupByClause = '';
        let selectClause='';
        let paramIndex = 2;
        let orderByClause='';


        let previousBalance = 0;
        if(from){
            conditions.push(`DATE(created_at) >= $${paramIndex}`);
            values.push(from);
            paramIndex++;
            const prevBalanceQuery = `
                SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0) as previous_balance
                FROM transactions 
                WHERE user_id=$1 AND DATE(created_at) < $2
            `;
            const prevBalanceResult = await db.query(prevBalanceQuery, [userId, from]);
            previousBalance = parseFloat(prevBalanceResult.rows[0].previous_balance) || 0;
        }

        if(to){
            conditions.push(`DATE(created_at) <= $${paramIndex}`);
            values.push(to);
            paramIndex++;
        }

        if(groupBy && ['year','month','day'].includes(groupBy as string)){//needs to be last of conditions
                selectClause = `DATE_TRUNC('${groupBy}', created_at) as period,`;
                groupByClause = `GROUP BY DATE_TRUNC('${groupBy}', created_at)`;
                orderByClause = 'ORDER BY period ASC';
        }

        const whereClause = conditions.join(' AND ');
        const query = `
            SELECT ${selectClause} 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense, 
                SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type='income' THEN amount ELSE -amount END) AS balance
            FROM transactions WHERE ${whereClause}
            ${groupByClause}
            ${orderByClause}`;

        const result = await db.query(query,values);

        if(groupBy && result.rows.length>0){
            let cumulativeBalance = previousBalance;

            const filledData = fillMissingPeriods(result.rows,groupBy as string,from as string,to as string);

            const groupedData = filledData.map((row,index) =>{
                const currentPeriodBalance = parseFloat(row.balance)||0;
                cumulativeBalance+=currentPeriodBalance
                return {
                period: row['period'],
                income: parseFloat(row.total_income) || 0,
                expense: parseFloat(row.total_expense) || 0,
                balance: cumulativeBalance
                }
            });

            res.status(200).json({
                groupBy: groupBy,
                data: groupedData,
                totalIncome: groupedData.reduce((sum, item) => sum + item.income, 0),
                totalExpense: groupedData.reduce((sum, item) => sum + item.expense, 0),
                totalBalance: groupedData.length > 0 ? groupedData[groupedData.length - 1].balance : 0,
            });
        }else{
            const row = result.rows[0] || { total_income: 0, total_expense: 0 };
            const income = parseFloat(row.total_income) || 0;
            const expense = parseFloat(row.total_expense) || 0;
            const balance = income - expense;

            res.status(200).json({
                totalIncome: income,
                totalExpense: expense,
                totalBalance: balance
            });
        }

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}


export const deleteTransaction = async (req: express.Request, res: express.Response)=>{
    try{
        const userId = req.userId;
        const {id} = req.params;

        const result = await db.query('DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING id, amount, type, category, note',[id,userId]);

        res.status(200).json(result.rows[0]);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const updateTransaction = async (req: express.Request, res: express.Response)=>{
    try{
        const userId= req.userId;
        const {id}= req.params;
        const {amount, type, category, note} = req.body;

        const updates: string[]=[];
        const values: any[]=[];
        let paramIndex = 1;

       if (amount) {
            updates.push(`amount = $${paramIndex}`);
            values.push(amount);
            paramIndex++;
        }

        if (type) {
            updates.push(`type = $${paramIndex}`);
            values.push(type);
            paramIndex++;
        }

        if (category) {
            updates.push(`category = $${paramIndex}`);
            values.push(category);
            paramIndex++;
        }

        if (note) {
            updates.push(`note = $${paramIndex}`);
            values.push(note || null); // Handle empty string as null
            paramIndex++;
        }

        if(values.length===0){
            res.status(400).json({message:"No fields provided for update"});
            return;
        }
        values.push(id, userId);
        const query = `UPDATE transactions SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} AND user_id = $${paramIndex+1} RETURNING id, amount, type, category, note`;
        const result = await db.query(query,values);

        if(result.rows.length === 0){
            res.status(404).json({message: 'transaction not found'});
            return;
        }

        res.status(200).json(result.rows[0]);

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}




export const getFinancePrediction = async (req: express.Request, res: express.Response)=>{
    try{
        const user_id = req.userId;
        const months:number = Number(req.query.months) || 12;//optional query set to default 12
        const getBalanceQuery = `SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END),0) as balance FROM transactions WHERE user_id = $1`;
        const balanceResult = await db.query(getBalanceQuery, [user_id]);
        const balance = parseFloat(balanceResult.rows[0].balance)||0;          
        const StartDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth()+months);        // Include active recurring transactions OR recurring transactions that will start within our prediction period
        const getRecurringQuery = `SELECT * FROM recurring WHERE user_id=$1 AND (is_active=true OR (start_date <= $2 AND start_date >= $3)) ORDER BY start_date ASC, next_occurrence ASC`;
        const recurringResult= await db.query(getRecurringQuery,[user_id, endDate, StartDate]);
        const recurringTransactions = recurringResult.rows;

        const predictions = await generatePredictions(recurringTransactions,balance,StartDate,endDate);
        const summary = predictionSummary(balance,predictions);
        res.status(200).json(summary);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const generatePredictions= async (recurringTransactions:any[],currentBalance:number,fromDate:Date,tillDate:Date)=>{
    const dataPoints: PredictionDataPoint[]=[];
    const result = new Map<string,{income:number,expenses:number}>();
    let balance = currentBalance;
    for (const recurring of recurringTransactions){
        const occurences = simulateOccurences(recurring,fromDate,tillDate)
        for (const date of occurences){
            const key = `${date.getUTCFullYear()}-${(date.getUTCMonth()+1).toString().padStart(2,'0')}`;
            if(!result.has(key)){
                result.set(key,{income:0,expenses:0});
            }
            const entry = result.get(key)!;
            if(recurring.type==='income'){
                entry.income+=Number(recurring.amount);
            }else{
                entry.expenses+=Number(recurring.amount);
            }
        }
    }

    const sortedKeys = Array.from(result.keys()).sort();

    for(const month of sortedKeys){
        const {income, expenses} = result.get(month)!;
        balance +=income - expenses;
        dataPoints.push({
            date: month,
            income:income,
            expense:expenses,
            balance:balance
        })
    }


    return dataPoints;
}

export const simulateOccurences= (recurring:any, forecastStart:Date, forecastEnd:Date):Date[]=>{
    const occurences: Date[]=[];
    
    // Determine the actual start date for this recurring transaction
    let actualStartDate;
    if (recurring.is_active && recurring.next_occurrence) {
        // If active and has next_occurrence, use that
        actualStartDate = new Date(recurring.next_occurrence);
    } else {
        // If not active or no next_occurrence, use start_date
        actualStartDate = new Date(recurring.start_date);
    }
    
    // The transaction should start no earlier than its actual start date,
    // but also no earlier than our forecast start
    let current = new Date(Math.max(forecastStart.getTime(), actualStartDate.getTime()));

    // Since end_date is no longer used, we only use forecastEnd
    const until = forecastEnd;

    while (current <= until && current <= forecastEnd){
        occurences.push(new Date(current));
        
        // Calculate next occurrence based on the new recurrence structure
        if(recurring.recurrence_type === 'custom'){
            if(!recurring.custom_interval){
                break; // Invalid custom recurring, stop
            }
            switch (recurring.custom_unit){
                case 'hours':
                    current.setUTCHours(current.getUTCHours() + recurring.custom_interval);
                    break;
                case 'days':
                    current.setUTCDate(current.getUTCDate() + recurring.custom_interval);
                    break;
                case 'weeks':
                    current.setUTCDate(current.getUTCDate() + (recurring.custom_interval * 7));
                    break;
                case 'months':
                    current.setUTCMonth(current.getUTCMonth() + recurring.custom_interval);
                    break;
                default:
                    break; // Invalid custom unit, stop
            }
        } else {
            switch (recurring.recurrence_type) {
                case 'daily':
                    current.setUTCDate(current.getUTCDate() + 1);
                    break;
                case 'weekly':
                    current.setUTCDate(current.getUTCDate() + 7);
                    break;
                case 'monthly':
                    current.setUTCMonth(current.getUTCMonth() + 1);
                    break;
                case 'yearly':
                    current.setUTCFullYear(current.getUTCFullYear() + 1);
                    break;
                default:
                    break; // Invalid recurrence type, stop
            }
        }
    }
    return occurences;
}


const predictionSummary= (balance:number,projectedData:any[]):FinancialPrediction =>{
    
    let totalProjectedIncome:number=0;
    let totalProjectedExpense:number=0;
    let months=projectedData.length;
    for(const point of projectedData){
        totalProjectedIncome+=point.income;
        totalProjectedExpense+=point.expense;
    }
    const monthlyAverageIncome=totalProjectedIncome/months;
    const monthlyAverageExpense=totalProjectedExpense/months;
    const finalBalance = projectedData[months-1].balance || 0;

    const summary:FinancialPrediction={
        currentBalance:balance,
        projectedData:projectedData,
        summary:{
            totalProjectedIncome:totalProjectedIncome,
            totalProjectedExpense:totalProjectedExpense,
            finalBalance:finalBalance,
            monthlyAverageIncome:monthlyAverageIncome,
            monthlyAverageExpense:monthlyAverageExpense
        }
    };
    return summary;

}


export const getTransactionCategories = async (req: express.Request, res: express.Response)=>{
    try{
        const userId = req.userId;
        const {search,items=5,type}=req.query;

        const whereClause=[];
        const values=[]
        let paramIndex=1;
        whereClause.push(`user_id = $${paramIndex} `);
        values.push(userId);
        paramIndex++;

        if(search){
            whereClause.push(`category LIKE $${paramIndex}`);
            values.push(`%${search}%`);
            paramIndex++;
        }

        if(type){
            if(type==="income"||type==="expense"){
                whereClause.push(`type = $${paramIndex}`);
                values.push(type);
                paramIndex++;
            }else{
                res.status(400).json({message:"type can only be income or expense!"});
            }
        }

        const queryWhere=whereClause.join(' AND ');
        values.push(items);

        const query="Select category, count(*) as categoryNum from transactions WHERE "+ queryWhere+ ` group by category order by categoryNum desc limit $${paramIndex}`
        const result = await db.query(query,values);
        if(result.rows.length===0){
            res.status(200).json({message:"there arent any existing categories"});
            return;
        }
        const categories = result.rows.map(row => row.category)

        res.status(200).json(categories);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const getCategorySummary=async (req:express.Request,res:express.Response)=>{
    try{
        const userId= req.userId;
        const {
            startDate, //include categories from startDate (iso format)
            endDate, // include categories till endDate (iso format)
            type, // only show categories that are "income" or "expense"
            sortBy, // sort by totalAmount or count or category
            orderBy, // order by asc or desc
            limit = 5, // limit number (or "all") of categories (if limit is 5 then will show 4 categories and other as the rest in total) if all then will show all
        }= req.query;

        const whereClause: string[] = [];
        const values:any[] = [];
        let paramIndex=0;

        const addQuery=(field:string,value:any)=>{
            if(value!==undefined){
                paramIndex++;
                whereClause.push(`${field} $${paramIndex}`);
                values.push(value);
            }
        };

        addQuery('user_id = ',userId);//add user to where clause

        if(type){
            
            if(["income","expense"].includes(type as string)){
                addQuery('type = ',type);
            }else{
                res.status(400).json({message: "type can only be income or expense"});
                return;
            }
        }

        
        if (startDate) {
            // Check different formats
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/; // ISO datetime
            const altRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY

            if (isoDateRegex.test(startDate as string)) {
                // Simple date format: 2025-05-31
                addQuery('created_at >= ', startDate);
            } else if (isoDateTimeRegex.test(startDate as string)) {
                // Full ISO datetime format: 2025-05-31T21:00:00.000Z
                const dateOnly = (startDate as string).split('T')[0];
                addQuery('created_at >= ', dateOnly);
            } else if (altRegex.test(startDate as string)) {
                // Convert DD-MM-YYYY to YYYY-MM-DD
                const [day, month, year] = (startDate as string).split('-');
                addQuery('created_at >= ', `${year}-${month}-${day}`);
            } else {
                res.status(400).json({ 
                    message: "Invalid startDate format. Use YYYY-MM-DD, DD-MM-YYYY, or ISO datetime (2025-05-31T21:00:00.000Z)." 
                });
                return;
            }
        }

        if (endDate) {
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
            const altRegex = /^\d{2}-\d{2}-\d{4}$/;

            if (isoDateRegex.test(endDate as string)) {
                addQuery('created_at <= ', endDate);
            } else if (isoDateTimeRegex.test(endDate as string)) {
                const dateOnly = (endDate as string).split('T')[0];
                addQuery('created_at <= ', dateOnly);
            } else if (altRegex.test(endDate as string)) {
                const [day, month, year] = (endDate as string).split('-');
                addQuery('created_at <= ', `${year}-${month}-${day}`);
            } else {
                res.status(400).json({ 
                    message: "Invalid endDate format. Use YYYY-MM-DD, DD-MM-YYYY, or ISO datetime (2025-05-31T21:00:00.000Z)." 
                });
                return;
            }
        }

        const orderByClause=[];

        if(sortBy){
            if(["totalAmount","count","category"].includes(sortBy as string)){
                orderByClause.push(` ${sortBy} `)
            }else{
                res.status(400).json({message:"sortby can only contain totalAmount, count or category"})
                return;
            }
        }else{
            orderByClause.push(' totalAmount ');
        }

        if(orderBy){
            if(["asc","desc"].includes((orderBy as string).toLocaleLowerCase())){
                orderByClause.push(` ${orderBy}`)
            }else{
                res.status(400).json({message: "orderBy clause can only contain asc or desc"});
                return;
            }
        }else{
            orderByClause.push(' desc');
        }

        if (limit && isNaN(Number(limit)) && (typeof limit !== "string" || limit.toLowerCase() !== "all")) {
            res.status(400).json({message:`limit has to be a number or "all"`});
            return;
        }

        const builtOrderByClause = orderByClause.join(" ");
        const bultWhereClause = whereClause.join(' AND ');
        const query = `select category, sum(amount) as totalAmount, count(category) as count from transactions where ${bultWhereClause} group by category order by ${builtOrderByClause}`;

        const result = await db.query(query,values);

        let newLimit;
        if (typeof limit === "string" && limit.toLowerCase() === "all") {
            newLimit = result.rows.length;
        } else if (limit === "" || limit === undefined) {
            newLimit = 5;
        } else {
            newLimit = limit;
        }
        const formatedResult = formatCategorySummary(result.rows, Number(newLimit));

        res.status(200).json(formatedResult);


    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

interface categoryDbResult{
    category:string,
    totalamount:string,
    count:string,
}

interface categorySummary{
    category:string,
    totalamount:number,
    count:number,
    precentage:number
}

const formatCategorySummary= (categoryData:categoryDbResult[],limit:number):categorySummary[] =>{
    let totalAmount = 0;
    const categoryResult: categorySummary[] = [];

    for (const category of categoryData) {
        totalAmount += Number(category.totalamount);
    }

    let otherTotalAmount = 0;
    let otherCount = 0;

    if(limit===categoryData.length){//if limit is the same as the data amount it wont add "other" category
        limit++;
    }

    for (let i = 0; i < categoryData.length; i++) {
        const cat = categoryData[i];
        if (i < limit - 1) { // if its not last add to categorys
            categoryResult.push({
                category: cat.category,
                totalamount: Number(cat.totalamount),
                count: Number(cat.count),
                precentage: totalAmount > 0 ? (Number(cat.totalamount) / totalAmount) * 100 : 0
            });
        } else { // if its over limit calculate the rest of category data
            otherTotalAmount += Number(cat.totalamount);
            otherCount += Number(cat.count);
        }
    }

    if (categoryData.length > limit - 1) { // create the last category
        categoryResult.push({
            category: "other",
            totalamount: otherTotalAmount,
            count: otherCount,
            precentage: totalAmount > 0 ? (otherTotalAmount / totalAmount) * 100 : 0
        });
    }

    return categoryResult;
}