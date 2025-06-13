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
        if(!result){
            res.status(400).json({message:"email not correct"});
        }

        const user = result.rows[0];

        if(!verifyPassword(user.password,password)){
            res.status(400).json({message:"password is incorrect"});
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

export const getUsers = async (req: express.Request, res: express.Response)=>{
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