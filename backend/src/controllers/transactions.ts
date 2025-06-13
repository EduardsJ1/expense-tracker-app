import express from 'express';
import db from '../db';
import { data } from 'react-router-dom';
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

        const result = await db.query("INSERT INTO transactions (user_id,amount,type,category,note) VALUES ($1,$2,$3,$4,$5) RETURNING id,amount,type,category,note, created_at",[userId,amount,type,category,transactionNote]);

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


            hasNote //true false, if row has note
        
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
            if(hasNote=="true"){
                conditions.push(`note IS NOT NULL AND note != ''`);
            } else{
                conditions.push(`note IS NULL OR note = ''`);
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

        res.status(200).json(result.rows);
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

export const getTransactionsSummary = async (req: express.Request, res: express.Response)=>{
    try{
        const userId = req.userId;
        const {
            groupBy, //adds group by "category" or "year" or "month" or "day"
            from, // date from YYYY-MM-DD
            to, // date to YYYY-MM-DD
        } = req.query;

        const conditions = ['user_id=$1'];
        const values = [userId] as any;
        let groupByClause = '';
        let selectClause='';
        let paramIndex = 2;
        let orderByClause='';
        if(from){
            conditions.push(`DATE(created_at) >= $${paramIndex}`);
            values.push(from);
            paramIndex++;
        }

        if(to){
            conditions.push(`DATE(created_at) <= $${paramIndex}`);
            values.push(to);
            paramIndex++;
        }

        if(groupBy && ['category','year','month','day'].includes(groupBy as string)){//needs to be last of conditions
            if (groupBy === 'category') {
                selectClause = 'category,';
                groupByClause = 'GROUP BY category';
                orderByClause = 'ORDER BY category';
            } else {
                selectClause = `DATE_TRUNC('${groupBy}', created_at) as period,`;
                groupByClause = `GROUP BY DATE_TRUNC('${groupBy}', created_at)`;
                orderByClause = 'ORDER BY period';
            }
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
            const groupedData = result.rows.map(row =>({
                [groupBy === 'category' ? 'category' : 'period']: row[groupBy === 'category' ? 'category' : 'period'],
                income: parseFloat(row.total_income) || 0,
                expense: parseFloat(row.total_expense) || 0,
                balance: parseFloat(row.balance) || 0
            }));

            res.status(200).json({
                groupBy: groupBy,
                data: groupedData,
                totalIncome: groupedData.reduce((sum, item) => sum + item.income, 0),
                totalExpense: groupedData.reduce((sum, item) => sum + item.expense, 0),
                totalBalance: groupedData.reduce((sum, item) => sum + item.balance, 0)
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

export const getTransactionCategories = async (req: express.Request, res: express.Response)=>{
    try{
        const userId = req.userId;
        const result = await db.query("SELECT DISTINCT category FROM transactions WHERE user_id = $1",[userId]);
        if(result.rows.length===0){
            res.status(404).json({message:"there arent any existing categories"});
            return;
        }
        const categories = result.rows.map(row => row.category)

        res.status(200).json(categories);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}