import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password:string)=>{
    const hashPassword = await bcrypt.hash(password,10);
    return hashPassword;
}

export const verifyPassword = async (hashedPassword:string, password:string)=>{
    const isValid = await bcrypt.compareSync(password,hashedPassword);
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

export const calculateNextOccurrence = (startDate: Date, recurrenceType: string, calendarUnit?: string, intervalHours?: number): Date => {
    const nextOccurrence = new Date(startDate);
    
    if (recurrenceType === 'hourly') {
        nextOccurrence.setUTCHours(nextOccurrence.getUTCHours() + (intervalHours || 1));
    } else if (recurrenceType === 'calendar') {
        switch (calendarUnit) {
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