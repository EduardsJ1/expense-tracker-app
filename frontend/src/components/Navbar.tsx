import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import AnalyticsArrow from "../components/ui/icons/AnalyticsArrow";
import RecurringIcon from "./ui/icons/ReccurringIcon";
import DollarSign from "./ui/icons/DollarSign";
import ActivityIcon from "./ui/icons/ActivityIcons";
import HamburgerIcon from "./ui/icons/HamburgerIcon";

function Navbar(){
    const {user, logoutUser} = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const NavLink = ({ to, icon, children }: { 
        to: string; 
        icon: React.ReactNode; 
        children: string;
    }) => (
        <Link 
            to={to} 
            className={`text-gray-600 font-medium rounded-lg py-2 px-2 block lg:inline-block
                ${isActive(to) ? "bg-neutral-800 text-white hover:bg-neutral-700" : "hover:bg-neutral-200 hover:text-gray-800"}`}
            onClick={closeMobileMenu}
        >
            <span className="flex items-center gap-2">
                {icon}
                {children}
            </span>
        </Link>
    );

    return(
        <>
            <nav className="bg-neutral-50 border-b z-50 border-neutral-400 shadow-md p-4 flex justify-between items-center fixed w-full">
                <div className="flex items-center gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
                    </div>
                    
                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex space-x-4">
                            <NavLink 
                                to="/dashboard" 
                                icon={<ActivityIcon size={25} strokeColor={isActive("/dashboard") ? "#FFFFFF" : "#000000"} strokeWidth={2} />}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink 
                                to="/transactions" 
                                icon={<DollarSign size={25} fillColor={isActive("/transactions") ? "#FFFFFF" : "#000000"} />}
                            >
                                Transactions
                            </NavLink>

                            <NavLink 
                                to="/reccurring" 
                                icon={<RecurringIcon size={25} color={isActive("/reccurring") ? "#FFFFFF" : "#000000"} />}
                            >
                                Recurring
                            </NavLink>

                            <NavLink 
                                to="/analytics" 
                                icon={<AnalyticsArrow direction="up" strokeColor={isActive("/analytics") ? "#FFFFFF" : "#000000"} strokeWidth={2} size={25} />}
                            >
                                Analytics
                            </NavLink>
                        </div>
                    )}
                </div>
               
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="hidden sm:inline text-gray-600">Welcome, {user.name}</span>
                            <button 
                                onClick={logoutUser} 
                                className="hidden lg:block bg-white text-black font-semibold border px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
                            >
                                Logout
                            </button>
                            
                            
                            <button 
                                onClick={toggleMobileMenu}
                                className="lg:hidden p-2 rounded hover:bg-neutral-200"
                            >
                                <HamburgerIcon size={24} strokeWidth={3} strokeColor="#374151" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="hidden lg:flex space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                                <Link to="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
                            </div>
                            <button 
                                onClick={toggleMobileMenu}
                                className="lg:hidden p-2 rounded hover:bg-neutral-200"
                            >
                                <HamburgerIcon size={24} strokeWidth={3} strokeColor="#374151" />
                            </button>
                        </>
                    )}
                </div>
            </nav>

            
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 backdrop-blur-xs z-40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Navigation</h3>
                        <button 
                            onClick={closeMobileMenu}
                            className="p-2 rounded hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {user ? (
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-200">
                                <span className="text-gray-600">Welcome, {user.name}</span>
                            </div>
                            
                            <NavLink 
                                to="/dashboard" 
                                icon={<ActivityIcon size={25} strokeColor={isActive("/dashboard") ? "#FFFFFF" : "#000000"} strokeWidth={2} />}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink 
                                to="/transactions" 
                                icon={<DollarSign size={25} fillColor={isActive("/transactions") ? "#FFFFFF" : "#000000"} />}
                            >
                                Transactions
                            </NavLink>

                            <NavLink 
                                to="/reccurring" 
                                icon={<RecurringIcon size={25} color={isActive("/reccurring") ? "#FFFFFF" : "#000000"} />}
                            >
                                Recurring
                            </NavLink>

                            <NavLink 
                                to="/analytics" 
                                icon={<AnalyticsArrow direction="up" strokeColor={isActive("/analytics") ? "#FFFFFF" : "#000000"} strokeWidth={2} size={25} />}
                            >
                                Analytics
                            </NavLink>
                            
                            <div className="pt-4 border-t border-gray-200">
                                <button 
                                    onClick={() => {
                                        logoutUser();
                                        closeMobileMenu();
                                    }}
                                    className="w-full bg-neutral-800 text-white font-semibold px-4 py-2 rounded hover:bg-neutral-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Link 
                                to="/login" 
                                className="block text-gray-600 hover:text-gray-800 py-2"
                                onClick={closeMobileMenu}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="block text-gray-600 hover:text-gray-800 py-2"
                                onClick={closeMobileMenu}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;