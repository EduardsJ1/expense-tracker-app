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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed");
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
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Login
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
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