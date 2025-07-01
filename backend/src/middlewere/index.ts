import express from 'express';
import jwt from 'jsonwebtoken';

declare global{
    namespace Express{
        interface Request{
            userId?:number;
        }
    }
}
export const isAuthenticated = (req:express.Request, res:express.Response, next:express.NextFunction) =>{
    const sessionToken = req.cookies['token'];

    if(!sessionToken){
        res.status(401).json({message:"session token not included"});
        return;
    }

    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            res.sendStatus(500);
            return;
        }
        const decoded = jwt.verify(sessionToken,secret) as {userId:number};
        req.userId = decoded.userId;


        next();
    }catch(error){
        console.log(error);
        res.status(401).json({message: 'Invalid or expired token'});
        return;
    }
}