import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
function Register(){
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name, setName] = useState("");
    const [error,setError] = useState<string|null>(null);
    const [passwordErrorMsg,setPasswordError]=useState<string|undefined>(undefined);
    const [emailErrorMsg,setEmailError]=useState<string|undefined>(undefined);

    const checkPassword = (password:string)=>{
        if(password.length<8){
            setPasswordError("Password must have 8 characters.");
            return false;
        }
        setPasswordError(undefined);
        return true;
    }

    const checkEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
            return false;
        }
        setEmailError(undefined);
        return true;
    }

    const handleSumbit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setError(null);
        if(checkPassword(password) && checkEmail(email)){
            try{
                await registerUser(email,password,name || undefined)
                navigate("/dashboard");
            }catch(err:any){
                setError("Registration failed");
                console.log(err);
            }
        }
    }

    return(
        <div className="w-lvw h-lvh flex items-center justify-center">
            <div className="border rounded-xl px-5 py-2 w-xs md:w-lg border-neutral-300 bg-white shadow-xl">
                <h2 className="text-center text-2xl">Register</h2>
                <form onSubmit={handleSumbit} className="flex flex-col gap-3">
                    <Input type="text" error={emailErrorMsg?true:false} errorMessage={emailErrorMsg} label="Email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <Input type="password" error={passwordErrorMsg?true:false} errorMessage={passwordErrorMsg} label="Password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Input type="text" label="Your name (optional)" placeholder="name (optional)" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 font-medium text-white px-2 py-2 w-2/4 rounded-xl border border-neutral-200 cursor-pointer hover:bg-blue-400">Register</button>
                    </div>
                    {error && <p>{error}</p>}

                </form>
                <div className="mt-5 text-center mb-5 text-lg"><p>Already have an a account? <Link to="/login" className="text-blue-800 font-medium hover:text-blue-400">Log in</Link></p></div>
            </div>
        </div>
    )
}

export default Register;