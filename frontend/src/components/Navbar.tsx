import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar(){
    const {user,logoutUser} = useAuth();

    return(
        <nav className="bg-neutral-50 border-b border-neutral-400 shadow-md p-4 flex justify-between items-center fixed w-full">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
            </div>
            <div className="flex space-x-4">
                <Link to="/dashboard" className="font- text-gray-600 hover:text-gray-800">Dashboard</Link>
                <Link to="/transactions" className="text-gray-600 hover:text-gray-800">Transactions</Link>
            </div>
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="text-gray-600">Welcome, {user.name}</span>
                        <button 
                            onClick={logoutUser} 
                            className="bg-white text-black font-semibold border-1 px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                        <Link to="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;