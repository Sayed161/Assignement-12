import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit, FiUser } from "react-icons/fi";
import useAxiosSecure from "../hooks/useAxiosSecure";

const UserMangement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await axiosSecure.get(`/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle remove user
  const handleRemoveUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Replace with actual API call
        console.log(`Deleting user with ID: ${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      // Replace with actual API call
      console.log(`Updating user ${userId} role to ${newRole}`);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError("Failed to update user role");
    }
  };
  return (
    <div className="w-full">
      <div className=" p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
          >
            Manage Users
          </motion.h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E1F9]"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Coins</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt={user.Name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <FiUser className="text-lg" />
                              </div>
                            )}
                            <span>{user.Name}</span>
                          </div>
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleUpdate(user._id, e.target.value)
                            }
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00E1F9]"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Worker">Worker</option>
                          </select>
                        </td>
                        <td className="p-4">{user.balance}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveUser(user.id)}
                              className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Remove User"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No users found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0,
            }}
            animate={{
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute w-1 h-1 rounded-full bg-[#00E1F9]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserMangement;
