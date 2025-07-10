import express from 'express';
import db from '../db';
import { hashPassword,verifyPassword,generateJWTtoken } from '../helpers';
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const register = async (req: express.Request, res: express.Response)=>{
    try{
        const {email,password,name}= req.body;
        if(!email || !password){
            res.status(400).json({message:"email or password not provided"});
            return;
        }
        let username;
        if(!name){
            username = "Guest";
        }else{
            username = name;
        }
        const hashedPassword = await hashPassword(password);
        const result = await db.query(`INSERT INTO users (email,password,name) VALUES ($1,$2,$3) RETURNING id, email, name`,[email,hashedPassword,username]);
        const newUser = result.rows[0];
        const token = generateJWTtoken(newUser.id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge: 2*60*60*1000,
            secure: false,
            sameSite:'lax'
        });
        res.status(201).json({
            message:"user created",
            id:newUser.id,
            email:newUser.email,
            name: newUser.name
        })

    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const login = async (req: express.Request, res: express.Response)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            res.status(400).json({message:"email and password not provided!"});
            return;
        }

        const result= await db.query('SELECT * FROM users WHERE email=$1', [email]);
        if(result.rows.length === 0){
            res.status(400).json({message:"Email or password is incorrect"});
            return;
        }

        const user = result.rows[0];
        const passwordIsValid = await verifyPassword(user.password, password);
        if(!passwordIsValid){
            res.status(400).json({message:"Email or password is incorrect"});
            return;
        }

        const token = generateJWTtoken(user.id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge: 2*60*60*1000,
            secure: false,
            sameSite:'lax'
        });

        res.status(200).json({message:"user logged in",id:user.id,email:user.email});
        
        
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const getUsers = async (req: express.Request, res: express.Response)=>{//testing remove later
    try{
        const result = await db.query("SELECT * FROM users");
        res.status(200).json(result.rows);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const getUserInfo = async (req: express.Request, res: express.Response)=>{
    try{
        const userId= req.userId;
        const result = await db.query(`SELECT id, email, name FROM users WHERE id=$1`,[userId]);

        res.status(200).json(result.rows);


    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

export const logout = (req: express.Request, res:express.Response)=>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite: 'lax'
        })
        res.status(200).json({message:"user succesfully logedout"});
    }catch(error){
        res.sendStatus(500);
        console.log(error);
    }
}

export const updateUser = async (req: express.Request, res:express.Response)=>{
    try{
        const userId=req.userId;
        const {email,password,name} = req.body;
        const setClause = [];
        const values = [];
        let paramIndex = 1;
        if(!email&&!password&&!name){
            res.status(400).json({message:"email or password or name not provided"});
            return;
        }
        if(email){
            setClause.push(`email = $${paramIndex}`);
            values.push(email);
            paramIndex++;
        }

        if(password){
            setClause.push(`password = $${paramIndex}`);
            const hashedPassword = await hashPassword(password);
            values.push(hashedPassword);
            paramIndex++;
        }

        if(name){
            setClause.push(`name =$${paramIndex}`);
            values.push(name);
            paramIndex++;
        }
        values.push(userId);
        const joinedSetClause = setClause.join(', ')

        const query = `UPDATE users SET ${joinedSetClause} WHERE id = $${paramIndex} RETURNING id, email, password, name`;
        const result = await db.query(query,values)

        res.status(200).json(result.rows[0]);

    }catch(error){
        res.sendStatus(500);
        console.log(error);
    }
}