import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit, FiUser } from "react-icons/fi";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access-token");
        const res = await axiosSecure.get(`/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle remove user
  const handleRemoveUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        background: "#1a1a2e",
        color: "#fff"
      });

      if (result.isConfirmed) {
        setLoading(true);
        const token = localStorage.getItem("access-token");
        await axiosSecure.delete(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1a1a2e",
          color: "#fff"
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete user");
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete user",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access-token");
      const res = await axiosSecure.patch(
        `/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      Swal.fire({
        title: "Success!",
        text: `User role updated to ${newRole}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff"
      });
    } catch (err) {
      console.error("Role update error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update role"
      );

      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update user role",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <motion.h1 
            className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Manage Users
          </motion.h1>

          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                      <motion.tr
                        key={user._id}
                        className="border-b border-white/10 hover:bg-white/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
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
                            disabled={loading}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Worker">Worker</option>
                          </select>
                        </td>
                        <td className="p-4">{user.balance || 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveUser(user._id)}
                              className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Remove User"
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && !loading && (
                  <motion.div 
                    className="text-center py-12 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No users found
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;