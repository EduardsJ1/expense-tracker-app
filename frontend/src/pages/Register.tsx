import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

function Register(){
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name, setName] = useState("");
    const [error,setError] = useState<string|null>(null);

    const handleSumbit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setError(null);

        try{
            await registerUser(email,password,name || undefined)
            navigate("/dashboard");
        }catch(err:any){
            setError("Registration failed");
            console.log(err);
        }
    }

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSumbit}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <input type="text" placeholder="name (optional)" value={name} onChange={(e)=>setName(e.target.value)}/>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}

            </form>
            <div><p>Already have an a account? <Link to="/login">Log in</Link></p></div>
        </div>
    )
}

export default Register;