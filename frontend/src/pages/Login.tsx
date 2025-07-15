import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import DollarSign from "../components/ui/icons/DollarSign"
function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError]= useState<string|undefined>(undefined);
  const [passwordError, setPasswordError]=useState<string|undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address.");
        return false;
    }
    setEmailError(undefined);
    return true;
  }

  const checkPassword = (password:string)=>{
    if(password.length<8){
        setPasswordError("Password must have 8 characters.");
        return false;
    }
    setPasswordError(undefined);
    return true;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if(!checkEmail(email) || !checkPassword(password)){
      return;
    }
    
    try {
      setLoading(true);
      await loginUser(email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (error:any) {
      setLoading(false)
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <div className="mb-6">

          <div className="flex justify-center mb-5">
            <div className="bg-green-200 rounded-full p-5">
              <DollarSign fillColor="#00630f" size={20}/>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-500 text-center">
              Log into your expense tracker account
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="text"
            placeholder="Email"
            value={email}
            error={emailError!==undefined}
            errorMessage={emailError}
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            error={passwordError!==undefined}
            errorMessage={passwordError}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <button
            type="submit"
            className="w-full bg-gray-800 font-medium text-white py-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            {loading?"Loging in...":"Login"}
          </button>
          <div className="h-3">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        </form>
        <div>
          <p className="font-medium text-neutral-500 text-center mt-5">
            Dont have a account?{" "}
            <Link to="/register" className="text-green-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;