import axios from "axios";
import type { User } from "../types/User"

const api = axios.create({baseURL:"http://localhost:8000", withCredentials:true});


export const login = (data:{email:string;password:string})=>api.post("/auth/login",data);

export const register = (data:{email:string;password:string,name?:string})=>api.post("/auth/register",data);

export const logout = ()=>api.post("/auth/logout");

export const getCurrentUser= ()=>api.get<User[]>("/users/me");
