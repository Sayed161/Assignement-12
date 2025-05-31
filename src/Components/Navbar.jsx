import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuLogIn, LuUser, LuLogOut, LuPlus, LuList, LuCreditCard, LuDollarSign, LuSettings, LuClipboardList, LuCoins } from "react-icons/lu";
import { AuthContext } from '../Providers/AuthProviders';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from "framer-motion";
import { BiSolidDashboard } from "react-icons/bi";
const Navbar = () => {
    const { Quser, Logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchUserByEmail = async ({ queryKey }) => {
        const [_, email] = queryKey;
        const response = await axios.get(`http://localhost:5000/users?email=${email}`);
        return response.data;
    };

  
    const { data: userData } = useQuery({
        queryKey: ['user', Quser?.email],
        queryFn: fetchUserByEmail,
        enabled: !!Quser?.email,
        staleTime: 5 * 60 * 1000
    });

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        Logout().then(() => {
            Swal.fire({
                title: "Logout Successful!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                background: '#1a1a2e',
                color: '#fff'
            });
            setTimeout(() => navigate("/signIn"), 1000);
        });
    };

    const AuthLinks = (
        <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    to="/signIn"
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white font-medium hover:shadow-lg hover:shadow-[#00E1F9]/30 transition-all"
                >
                    <LuLogIn className="mr-2" /> Login
                </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    to="/signup"
                    className="flex items-center px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/20"
                >
                    Sign Up
                </Link>
            </motion.div>
       
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <a
      href="https://github.com/your-client-repo"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f985] to-[#1b4a70] text-white font-medium"
    >
      Join as Developer
    </a>
  </motion.div>

        </div>
    );




    const renderNavigation = () => {
        if (!userData) return null;
        
        const commonClasses = `flex items-center px-4 py-2 rounded-lg transition-all ${isActive(location.pathname) ? "active-link" : "hover:bg-white/5 hover:text-white"}`;
        
        switch (userData?.role) {
            case 'Worker':
                return (
                    <>
                    <Link to="/dashboard-worker" className={commonClasses}>
                            <BiSolidDashboard className="mr-2" /> Dashboard
                        </Link>
                        <Link to="/tasklist" className={commonClasses}>
                            <LuList className="mr-2" /> Task List
                        </Link>
                        <Link to="/submissions" className={commonClasses}>
                            <LuClipboardList className="mr-2" /> My Submissions
                        </Link>
                        <Link to="/withdrawals" className={commonClasses}>
                            <LuDollarSign className="mr-2" /> Withdrawals
                        </Link>
                    </>
                );
            case 'Buyer':
                return (
                    <>
                        <Link to="/dashboard-buyer" className={commonClasses}>
                            <BiSolidDashboard className="mr-2" /> Dashboard
                        </Link>
                        <Link to="/addtask" className={commonClasses}>
                            <LuPlus className="mr-2" /> Add Task
                        </Link>
                        <Link to="/mytasks" className={commonClasses}>
                            <LuList className="mr-2" /> My Tasks
                        </Link>
                        <Link to="/purchase" className={commonClasses}>
                            <LuCreditCard className="mr-2" /> Purchase Coin
                        </Link>
                        <Link to="/payments" className={commonClasses}>
                            <LuDollarSign className="mr-2" /> Payment History
                        </Link>
                    </>
                );
            case 'Admin':
                return (
                    <>
                        <Link to="/users" className={commonClasses}>
                            <LuUser className="mr-2" /> Manage Users
                        </Link>
                        <Link to="/tasks" className={commonClasses}>
                            <LuSettings className="mr-2" /> Manage Tasks
                        </Link>
                    </>
                );
            default:
                return <Link to="/" className={commonClasses}>Home</Link>;
        }
    };
 

    const UserProfile = () => (
        <div className="flex items-center gap-4">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
            >
                <img 
                    src={Quser?.photoURL || "https://via.placeholder.com/40"} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full border-2 border-[#00E1F9]" 
                />
                <div className="text-sm">
                    <div className="font-medium text-white">{Quser?.displayName || "User"}</div>
                    <div className="text-xs text-gray-300">{userData?.role} | Balance:  {userData?.balance || 0}</div>
                </div>
            </motion.div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-red-600/80 transition-all"
            >
                <LuLogOut className="mr-2" /> Logout
            </motion.button>
           
        </div>
    );

    return (
        <header className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-white/10">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
            </div>
            
            <div className="container mx-auto px-4 py-3 relative z-10">
                <div className="flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to={Quser ? "/" : "/"} className="flex items-center">
                            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] bg-clip-text text-transparent">
                                {Quser ? "TaskHub" : "TaskHub"}
                            </span>
                        </Link>
                    </motion.div>
                    
                    <nav className="hidden lg:flex items-center space-x-1">
                        {renderNavigation()}
                    </nav>
                    
                    <div className="hidden lg:flex items-center">
                        {Quser ? <UserProfile /> : AuthLinks}
                    </div>
                    
                    <MobileMenu 
                        renderNavigation={renderNavigation}
                        Quser={Quser}
                        userData={userData}
                        handleLogout={handleLogout}
                    />
                </div>
            </div>
        </header>
    );
};

const MobileMenu = ({ renderNavigation, Quser, userData, handleLogout }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </motion.button>
            
            <div className={`lg:hidden mobile-menu ${isOpen ? 'open' : ''}`}>
                <div className="flex flex-col space-y-2 mt-4 pb-4">
                    {renderNavigation()}
                    {Quser ? (
                        <>
                            <div className="flex items-center px-4 py-3 bg-white/5 rounded-lg backdrop-blur-sm">
                                <img 
                                    src={Quser?.photoURL || "https://via.placeholder.com/40"} 
                                    alt="avatar" 
                                    className="w-8 h-8 rounded-full mr-3 border-2 border-[#00E1F9]" 
                                />
                                <div>
                                    <div className="font-medium text-white">{Quser?.displayName}</div>
                                    <div className="text-xs text-gray-300">{userData?.role} | Balance: ${userData?.balance || 0}</div>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600/80 text-white hover:bg-red-700/80 transition-all"
                            >
                                <LuLogOut className="mr-2" /> Logout
                            </motion.button>
                           
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/signIn"
                                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white hover:shadow-lg hover:shadow-[#00E1F9]/30 transition-all"
                                >
                                    <LuLogIn className="mr-2" /> Login
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/signup"
                                    className="flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
                                >
                                    Sign Up
                                </Link>
                            </motion.div>
                          
                        </>
                    )}
                </div>
            </div>
        </>
    );
};



export default Navbar;