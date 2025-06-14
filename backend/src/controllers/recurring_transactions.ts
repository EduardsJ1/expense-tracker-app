import express from 'express';
import db from '../db';
import {calculateNextOccurrence} from '../helpers/index';
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
            interval_hours,
            calendar_unit,
            start_date,
            end_date,
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
        values.push(amount,type,category,recurrence_type);
        query+='amount, type, category, recurrence_type, ';

        if(recurrence_type==='calendar'){
            if(calendar_unit!=='daily' && calendar_unit!== 'weekly' && calendar_unit !=='monthly' && calendar_unit!=='yearly'){
                res.status(400).json({message:'calendar_unit dosent include daily, weekly, monthly or yearly'});
                return;
            }else{
                query+='calendar_unit,';
                values.push(calendar_unit);
            }
        }else if(recurrence_type==='hourly'){
            if(!interval_hours){
                res.status(400).json({message: 'hours not provided'});
                return;
            }else{
                query+='interval_hours,';
                values.push(interval_hours);
            }
        }else{
            res.status(400).json({message: 'recurrence_type dosent have values hourly or calendar'});
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

        if(end_date){
            const endDate = new Date(end_date);
            if(isNaN(endDate.getTime())){
                res.status(400).json({message:"end_date must be a valid date"});
                return;
            }
            if(endDate <= startDate){
                res.status(400).json({message:"end_date must be after start_date"});
                return;
            }
            query+='end_date,';
            values.push(endDate);
        }
        const next_occurence = calculateNextOccurrence(startDate,recurrence_type,calendar_unit,parseInt(interval_hours));

        if(transactionNote){
            query+='note,';
            values.push(transactionNote);
        }
        if(is_active!=false && is_active!=true){
            res.status(400).json({message:'is_active can only be true or false'});
            return;
        }

        let active = is_active !== undefined ? is_active : true; // will set is_active to false if nextOcurrence is higher than end_date (it wont execute);
        if(end_date && next_occurence >= new Date(end_date)){
            active=false;
        }
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
            recurrence_type, //what recurrence_type income or expense
            is_active, //what recurring transactions are active


            maxAmount, // maximum amount
            minAmount, // minimum amount

            sortBy='created_at', // sort by category, amount, type, updated_at, recurrence_type, interval_hours, calendar_unit,start_date,end_date,next_occurrence,is_active default(created_at)
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

        if(recurrence_type && ['calendar','hourly'].includes(recurrence_type as string)){
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