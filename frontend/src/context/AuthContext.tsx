import { createContext,useState,useEffect } from "react";

import {getCurrentUser,login,logout,register} from "../api/auth";
import type {User} from "../types/User";
import type {ReactNode} from 'react';
import { useNavigate } from "react-router-dom";


interface AuthContextType {
    user: User | null,
    loginUser: (email:string, password:string) => Promise<void>;
    registerUser: (email:string,password:string,name?:string)=>Promise<void>;
    logoutUser:()=>Promise<void>;
};


export const AuthContext = createContext<AuthContextType>({}as AuthContextType);

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [user,setUser] = useState<User | null>(null);
    const navigate = useNavigate();


    useEffect(()=>{
        const handleSessionExpired = ()=>{
            console.log("Session Expired");
            setUser(null);
            navigate('/');
        }

        window.addEventListener('session-expired',handleSessionExpired);
        return () => window.removeEventListener('session-expired',handleSessionExpired);
    },[navigate])

    useEffect(()=>{
       
        getCurrentUser()
        .then((res)=>setUser(res.data[0]||null))
        .catch(()=>{
            setUser(null)
        });
        
    },[]);

    const loginUser = async (email:string,password:string)=>{
        await login({email,password});
        const res = await getCurrentUser();
        setUser(res.data[0]);
    }
    const registerUser = async (email: string, password: string,name?:string) => {
        await register({ email, password,name });
        const res = await getCurrentUser();
        setUser(res.data[0]);
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    return(
    <AuthContext.Provider value={{user,loginUser,registerUser,logoutUser}}>
        {children}
    </AuthContext.Provider>
    )
}