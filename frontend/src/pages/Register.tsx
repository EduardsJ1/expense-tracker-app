import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import { DollarIcon } from "../components/ui/icons";
function Register(){
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [secondPassword,setSecondPassword]=useState("");
    const [name, setName] = useState("");
    const [error,setError] = useState<string|null>(null);
    const [passwordErrorMsg,setPasswordError]=useState<string|undefined>(undefined);
    const [confirmPasswordErrorMsg,setConfirmPasswordErrorMsg] = useState<string|undefined>(undefined);
    const [emailErrorMsg,setEmailError]=useState<string|undefined>(undefined);
    const [loading,setLoading]=useState<boolean>(false);

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

    const confirmPassword = (password:string, secondPassword:string) =>{
        if(password === secondPassword){
            setConfirmPasswordErrorMsg(undefined);
            return true;
        }else{
            setConfirmPasswordErrorMsg("Passwords do not match!")
            return false;
        }
    }

    const handleSumbit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setError(null);
        if(checkPassword(password) && checkEmail(email) && confirmPassword(password,secondPassword)){
            try{
                setLoading(true);
                await registerUser(email,password,name || undefined);
                setLoading(false);
                navigate("/dashboard");
            }catch(err:any){
                setLoading(false);
                setError("Registration failed");
                console.log(err);
            }
        }
    }

    return(
        <div className="w-lvw h-lvh flex items-center justify-center bg-gray-100 px-5">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex flex-col">
                    <div className="flex justify-center mb-5">
                        <div className="bg-green-200 rounded-full p-5">
                        <DollarIcon fillColor="#00630f" size={20}/>
                        </div>
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-center text-neutral-500">Create your account to track expenses</p>
                </div>
                <form onSubmit={handleSumbit} className="flex flex-col gap-5 mt-5">
                    <Input type="text" error={emailErrorMsg?true:false} errorMessage={emailErrorMsg} label="Email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <Input type="password" error={passwordErrorMsg?true:false} errorMessage={passwordErrorMsg} label="Password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Input type="password" error={confirmPasswordErrorMsg?true:false} errorMessage={confirmPasswordErrorMsg} label="Confirm Password" placeholder="Confirm Password" value={secondPassword} onChange={(e)=>setSecondPassword(e.target.value)}/>
                    <Input type="text" label="Your name (optional)" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-gray-800 font-medium text-white px-2 py-2 w-full rounded-xl border border-neutral-200 cursor-pointer hover:bg-gray-700">
                        {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>
                    {error && <p>{error}</p>}

                </form>
                <div className="mt-10 text-center mb-3 text-lg"><p className="text-neutral-500 font-medium">Already have an a account? <Link to="/login" className="text-green-800 font-medium hover:text-green-600">Log in</Link></p></div>
            </div>
        </div>
    )
}

export default Register;