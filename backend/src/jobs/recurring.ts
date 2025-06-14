import cron from 'node-cron';
import db from '../db';
import {calculateNextOccurrence} from '../helpers/index';



const processRecurring = async () =>{
    try{
        console.log('checking for recurring transactions');
        const currentDate = new Date().toISOString();
        const query = 'SELECT * FROM recurring WHERE is_active=true AND next_occurrence <=$1';
        const result = await db.query(query,[currentDate]);

        for (const recurring of result.rows){
            if(await checkEndDate(recurring,currentDate)){
                continue; // end recurring process when end_date is lower than next_occurence
            }
            //console.log(`processing recurring and begininng to add transaction of recuring ${recurring.id}`)
            await createTransaction(recurring);
            await updateNextOccurrence(recurring);
        }

        console.log(`processed ${result.rows.length} recurring transactions`);
    }catch(error){
        console.log(error);
    }
}


const checkEndDate = async (recurring:any,currentDate:string)=>{
    try{
        if(!recurring.end_date){
            return false;
        }
        const endDate = new Date(recurring.end_date);
        const currentDateObj= new Date(currentDate);
        if(currentDateObj>=endDate){
            console.log(`end date reached for recurring transaction ${recurring.id}`);

            const query = `UPDATE recurring SET is_active=false, updated_at = NOW() WHERE id=$1`;
            await db.query(query,[recurring.id]);
            return true;
        }
        return false;
    }catch(error){
        console.log('error updating is_active when checking end_date',error);
        return false;
    }
}

const createTransaction = async (recurring:any)=>{
    try{
        const query = `INSERT INTO transactions(user_id,amount,type,category,note,recurring_id) VALUES ($1,$2,$3,$4,$5,$6)`;
        const result = await db.query(query,[recurring.user_id,recurring.amount,recurring.type,recurring.category,recurring.note,recurring.id]);
        //console.log(result);
        console.log(`Inserted new transaction for reacurring ${recurring.id}`);
    }catch(error){
        console.log('error creating transaction',error);
    }
}

const updateNextOccurrence = async (recurring:any)=>{
    try{
        const prev_nextOccurence=new Date(recurring.next_occurrence);
        const nextOccurrence = await calculateNextOccurrence(prev_nextOccurence,recurring.recurrence_type,recurring.calendar_unit,recurring.interval_hours);
        const endDate = new Date(recurring.end_date);
        let query;
        if(nextOccurrence>=endDate){//if next occurence is past endDate it is set to false
            query = `UPDATE recurring SET next_occurrence = $1, is_active=false, updated_at = NOW() WHERE id=$2`;
        }else{
            query= `UPDATE recurring SET next_occurrence = $1, updated_at = NOW() WHERE id=$2`;
        }
        
        await db.query(query,[nextOccurrence.toISOString(),recurring.id]);
    }catch(error){
        console.log('error updating nextOccurrence', error);
    }
}





export const startRecurringJob = ()=>{
    cron.schedule('0 * * * *',processRecurring);
    console.log('started Recurring job');
}