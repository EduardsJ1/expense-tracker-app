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