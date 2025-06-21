import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password:string)=>{
    const hashPassword = await bcrypt.hash(password,10);
    return hashPassword;
}

export const verifyPassword = async (hashedPassword:string, password:string):Promise<boolean>=>{
    const isValid = await bcrypt.compare(password,hashedPassword);
    return isValid;
}

export const generateJWTtoken = (userId:number) => {
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error('JWT_SECRET not defined');
    }
    const token = jwt.sign({userId},secret,{expiresIn:'2h'});
    return token;
}

export const calculateNextOccurrence = (startDate: Date, recurrenceType: string, custom_unit?: string, custom_interval?: number): Date => {
    const nextOccurrence = new Date(startDate);
    
    if (recurrenceType === 'custom') {
        if(!custom_interval){
            throw new Error('for custom type custom_interval not provided');
        }else{
            switch (custom_unit){
            case 'hours':
                nextOccurrence.setUTCHours(nextOccurrence.getUTCHours()+(custom_interval));
                break;
            case 'days':
                nextOccurrence.setUTCDate(nextOccurrence.getUTCDate()+(custom_interval));
                break;
            case 'weeks':
                nextOccurrence.setUTCDate(nextOccurrence.getUTCDate()+(custom_interval*7));
                break;
            case 'months':
                nextOccurrence.setUTCMonth(nextOccurrence.getUTCMonth()+(custom_interval));
                break;
            default:
                throw new Error("custom_unit invaldid units! only hours days weeks or months");
        }
        }
        
    } else{
        switch (recurrenceType) {
            case 'daily':
                nextOccurrence.setUTCDate(nextOccurrence.getUTCDate() + 1);
                break;
            case 'weekly':
                nextOccurrence.setUTCDate(nextOccurrence.getUTCDate() + 7);
                break;
            case 'monthly':
                nextOccurrence.setUTCMonth(nextOccurrence.getUTCMonth() + 1);
                break;
            case 'yearly':
                nextOccurrence.setUTCFullYear(nextOccurrence.getUTCFullYear() + 1);
                break;
            default:
                throw new Error('Invalid calendar unit');
        }
    }
    
    return nextOccurrence;
};