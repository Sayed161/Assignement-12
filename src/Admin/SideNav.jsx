import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiPieChart,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';
import { Link, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import Swal from "sweetalert2";
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from "../hooks/useAxiosSecure";
const SideNav = () => {

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
const { Quser, Logout } = useContext(AuthContext);

const fetchUserByEmail = async ({ queryKey }) => {
  const [_, email] = queryKey;
  try {
    const token = localStorage.getItem('access-token');
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosSecure.get(`/users?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

  const { data: userData, isError: userDataError } = useQuery({
    
    queryKey: ['user', Quser?.email],
    queryFn: fetchUserByEmail,
    enabled: !!Quser?.email,
    staleTime: 5 * 60 * 1000
  });
   console.log("user from sidenab",userData);
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

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New withdrawal request from John Doe",
      time: "2 min ago",
      read: false,
    },
    { id: 2, text: "System update available", time: "1 hour ago", read: true },
    { id: 3, text: "New user registered", time: "3 hours ago", read: true },
  ]);

  return (
    <div className="flex min-h-screen">
        <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300">
      <div className="w-64 bg-white/5 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-[#00E1F9]"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
              TaskHub
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3">
          <img
            src={userData?.photo}
            alt={userData?.Name}
            className="w-10 h-10 rounded-full border-2 border-[#00E1F9]/50"
          />
          <div>
            <p className="font-medium text-white">{userData?.Name}</p>
            <p className="text-xs text-gray-400">{userData?.role}</p>
          </div>
        </div>

<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
  {[
    {
      icon: <FiHome />,
      label: "Dashboard",
      path: "/admin-dashboard",
      match: (pathname) => pathname === "/admin-dashboard"
    },
    {
      icon: <FiUsers />,
      label: "Manage Users",
      path: "/admin-dashboard/users",
      match: (pathname) => pathname === "/admin-dashboard/users"
    },
    {
      icon: <FiPieChart />,
      label: "Manage Tasks",
      path: "/admin-dashboard/tasks",
      match: (pathname) => pathname === "/admin-dashboard/tasks"
    },
  ].map((item, index) => {
    const isActive = item.match(location.pathname);
    return (
      <motion.div key={index} whileHover={{ x: 5 }}>
        <Link
          to={item.path}
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isActive
              ? "bg-[#00E1F9]/10 text-[#00E1F9]"
              : "hover:bg-white/5"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      </motion.div>
    );
  })}
</nav>

        {/* Notification Bar at Bottom */}
        <div className="border-t border-white/10 p-4">
          <div className="relative">
            {/* Notification Dropdown (hidden by default) */}
            <div className="hidden absolute bottom-full mb-2 left-0 w-64 bg-[#0f0c29] border border-white/10 rounded-lg shadow-lg z-10">
              <div className="p-2 max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer ${
                      !notification.read ? "bg-[#00E1F9]/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center text-sm border-t border-white/5">
                <a href="#" className="text-[#00E1F9] hover:underline">
                  View All
                </a>
              </div>
            </div>
          </div>
<motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-red-600/80 transition-all"
            >
                <LuLogOut className="mr-2" /> Logout
            </motion.button>
         
        </div>
      </div>
    </div>
    </div>
  );
};

export default SideNav;
