import express from 'express';
import db from '../db';
import {calculateNextOccurrence} from '../helpers/index';
import { UpdateRecurring} from '../types/index';
declare global {
    namespace Express {
        interface Request {
            userId?: number;
            
        }
    }
}


export const createRecurring = async (req: express.Request, res: express.Response)=>{
    try{
        const user_id= req.userId;
        const {
            amount,
            type,
            category,
            note,
            recurrence_type,
            custom_unit,
            custom_interval,
            start_date,
            is_active
        } = req.body;

        const transactionNote = note || null;
        const values = [];
        let query = 'INSERT INTO recurring (user_id,';
        values.push(user_id);

        if(!amount || !type || !category){
            res.status(400).json({message:"amount, type or category not provided"});
            return;
        }
        if(type !== 'income' && type !=='expense'){
            res.status(400).json({message:'type must be expense or income'});
            return;
        }
        const categoryLowerCase = typeof category === 'string' ? category.toLowerCase() : category;
        values.push(amount, type, categoryLowerCase, recurrence_type);
        query+='amount, type, category, recurrence_type, ';

        if(recurrence_type==='custom'){
            if(custom_unit!=='hours' && custom_unit!== 'days' && custom_unit !=='weeks' && custom_unit!=='months'){
                res.status(400).json({message:'custom_unit doesn\'t include hours,days,weeks,months'});
                return;
            }else{
                query+='custom_unit,';
                values.push(custom_unit);
                if(!custom_interval){
                    res.status(400).json({message: 'custom interval number not provided'});
                    return;
                }else{
                    query+='custom_interval,';
                    values.push(custom_interval);
                }
            }
        }else if(recurrence_type!=='daily' && recurrence_type!=='weekly' && recurrence_type!=='monthly' && recurrence_type!=='yearly'){
            res.status(400).json({message:"recurence_type needs to have values daily,weekly,monthly,yearly or custom"});
            return;
        }
        
        let startDate;
        if(start_date === undefined || start_date === null || start_date === ''){
            // Use current exact timestamp if not provided
            startDate = new Date();
        } else {
            startDate = new Date(start_date);
            if(isNaN(startDate.getTime())){
                res.status(400).json({message: 'start_date must be a valid date (YYYY-MM-DD or ISO format)'});
                return;
            }
        }
        
        query += 'start_date,';
        values.push(startDate);

        const next_occurence = start_date?start_date:new Date();
        //calculateNextOccurrence(startDate,recurrence_type,custom_unit,parseInt(custom_interval));

        if(transactionNote){
            query+='note,';
            values.push(transactionNote);
        }
        if(is_active!=false && is_active!=true){
            res.status(400).json({message:'is_active can only be true or false'});
            return;
        }

        const active = is_active !== undefined ? is_active : true; 
        query +='is_active, ';
        values.push(active);


        query+='next_occurrence) VALUES (';
        values.push(next_occurence);

        const placeholders = values.map((value,index)=>`$${index+1}`).join(', ');
        query+=placeholders+') RETURNING *';


        const result = await db.query(query,values);

        res.status(201).json(result.rows[0]);

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}


export const getRecurringTransactions = async (req:express.Request, res:express.Response)=>{
    try{
        const userId= req.userId;
        const {
            includeUpdated,//set date type to include updated_at (true / false)
            from, // start date "YYYY-MM-DD"
            to, // end date "YYYY-MM-DD"
            
            type, // set type for "income" or "expense"
            category, // specific category "wage" or multiple "wage,food,car"
            recurrence_type, //what recurrence_type daily/weekly/monthly/yearly/custom
            is_active, //what recurring transactions are active


            maxAmount, // maximum amount
            minAmount, // minimum amount

            sortBy='created_at', // sort by category, amount, type, updated_at, recurrence_type, custom_interval,start_date,next_occurrence,is_active default(created_at)
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

        if(recurrence_type && ['daily','weekly','monthly','yearly','custom'].includes(recurrence_type as string)){
            conditions.push(`recurrence_type=$${paramIndex}`);
            values.push(recurrence_type);
            paramIndex++;
        }

        if(is_active !== undefined){
            if(is_active === 'true' || is_active === 'false'){
            const activeValue = is_active === 'true';
            conditions.push(`is_active = $${paramIndex}`);
            values.push(activeValue);
            paramIndex++;
            }else{
                res.status(400).json({message:'is_active can only be true or false'});
                return;
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
        const validSortBy = [
            'created_at', 'amount', 'type', 'category', 'updated_at',
            'recurrence_type', 'interval_hours', 'calendar_unit', 
            'start_date', 'end_date', 'next_occurrence', 'is_active'
        ].includes(sortBy as string) ? sortBy : 'created_at';
        const validOrder = sortOrder === 'asc' ? 'ASC':'DESC';

        const pageNum = parseInt(page as string) || 1;
        const itemsPerPage = parseInt(items as string) || 10;
        const offset = (pageNum -1) * itemsPerPage;

        const countQuery = `SELECT COUNT(*) FROM recurring WHERE ${whereClause}`;
        const countResult = await db.query(countQuery,values);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems/itemsPerPage);


        const query = `SELECT * FROM recurring WHERE ${whereClause} ORDER BY ${validSortBy} ${validOrder} LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;

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


export const deleteRecurring = async (req:express.Request, res:express.Response)=>{
    try{
        const user_id = req.userId;
        const {id} = req.params;
        const result = await db.query("DELETE FROM recurring WHERE user_id = $1 AND id=$2 RETURNING id, user_id, amount, type, category, note, recurrence_type",[user_id,id]);

        res.status(200).json(result.rows[0]);

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}


export const updateRecurring = async (req:express.Request, res:express.Response):Promise<void>=>{
    try{
        const user_id = req.userId;
        const {id} = req.params;
        const update: UpdateRecurring = req.body;
        if(!id){
            res.status(400).json({message:"ID for recurring not provided"});
            return;
        }
        const checkQuery = `SELECT * FROM recurring WHERE id = $1 AND user_id = $2`;//check if user owns the recurring
        const checkResult = await db.query(checkQuery, [id, user_id]);

        if (checkResult.rows.length === 0) {
         res.status(404).json({ message: "Recurring transaction not found" });
         return;
        }

        const currentRecurring = checkResult.rows[0];

        if(update.type && update.type !== 'income' && update.type !== 'expense'){
            res.status(400).json({message:"type must be income or expense"});
            return;
        }
        
        if(update.recurrence_type){
            if(update.recurrence_type==='custom'){
                if(update.custom_unit && !['hours', 'days', 'weeks', 'months'].includes(update.custom_unit)){
                    res.status(400).json({message:"custom_unit must be hours, days, weeks, or months"});
                    return;
                }
                if(update.custom_interval && (update.custom_interval <= 0 || !Number.isInteger(update.custom_interval))){
                    res.status(400).json({message:"custom_interval must be a positive integer"});
                    return;
                }
            }else if (!["daily","weekly","monthly","yearly"].includes(update.recurrence_type)){
                res.status(400).json({message:"recurrence_type must be daily, weekly, monthly, yearly, or custom"});
                return;
            }
        }
        const query: string[] = [];
        const values: any[]=[];
        let paramCount = 0;        const addQuery=(field:string,value:any)=>{
            if(value!==undefined){
                paramCount++;
                query.push(`${field} = $${paramCount}`);
                values.push(value);
            }
        };
        
        addQuery('amount', update.amount);
        addQuery('type', update.type);
        addQuery('category', update.category);
        addQuery('note', update.note);
        addQuery('recurrence_type', update.recurrence_type);
        addQuery('custom_unit', update.custom_unit);
        addQuery('custom_interval', update.custom_interval);
        addQuery('start_date', update.start_date);
        addQuery('is_active', update.is_active);

        if(query.length===0){
            res.status(400).json({message:"update params not provided"});
            return;
        }

        query.push(`updated_at = NOW()`);        if (update.start_date || update.recurrence_type || update.custom_unit || update.custom_interval) {
            const newStartDate = update.start_date || currentRecurring.start_date;
            const newRecurrenceType = update.recurrence_type || currentRecurring.recurrence_type;
            const newCustomUnit = update.custom_unit || currentRecurring.custom_unit;
            const newCustomInterval = update.custom_interval || currentRecurring.custom_interval;

            const nextOccurrence = calculateNextOccurrence(
                new Date(newStartDate),
                newRecurrenceType,
                newCustomUnit,
                newCustomInterval
            );            addQuery('next_occurrence',nextOccurrence);
        }

        paramCount++;
        values.push(id);
        paramCount++;
        values.push(user_id);
        console.log(values);
        const updateQuery = `UPDATE recurring SET ${query.join(',')} WHERE id=$${paramCount-1} AND user_id=$${paramCount} RETURNING *`;
        console.log(updateQuery);
        const result = await db.query(updateQuery,values);
        res.status(200).json(result.rows[0]);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}