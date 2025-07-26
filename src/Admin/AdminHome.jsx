import React, { useState, useEffect, useContext } from "react";
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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Providers/AuthProviders";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { setLoading, loading } = useContext(AuthContext);
  const [Userinfo, setUser] = useState([]);
  const [payment, setPayment] = useState([]);
  useEffect(() => {
    if (Userinfo.length > 0) {
      // Count users by role
      const counts = {
        total: Userinfo.length,
        admin: Userinfo.filter((user) => user.role === "Admin").length,
        worker: Userinfo.filter((user) => user.role === "Worker").length,
        buyer: Userinfo.filter((user) => user.role === "Buyer").length,
      };

      // Calculate balances (assuming balance property exists)
      const totalBalance = Userinfo.reduce(
        (sum, user) => sum + (user.balance || 0),
        0
      );
      const total_payment = payment.reduce(
        (sum, user) => sum + (user.price || 0),
        0
      );

      setStats({
        totalWorkers: counts.worker,
        totalBuyers: counts.buyer,
        totalCoins: totalBalance,
        totalPayments: total_payment,
      });
    }
  }, [Userinfo]);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await axiosSecure.get(`/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dres = await axiosSecure.get(`/checkout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setPayment(Array.isArray(dres.data) ? dres.data : [dres.data]);
        console.log("user information", dres.data);
        setUser(data);
      } catch (err) {
        console.log("Message", err.response?.data?.message || err.message);
      } finally {
          setTimeout(() => {
        setLoading(false);
      }, 1000);
      }
    };
    fetchTask();
  }, []);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });

  const weeklyVisitors = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Unique Visitors",
        data: [650, 590, 800, 810, 560, 550, 400],
        borderColor: "#00E1F9",
        backgroundColor: "rgba(0, 225, 249, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Page Views",
        data: [1200, 1100, 1500, 1400, 1000, 900, 700],
        borderColor: "#6A1B70",
        backgroundColor: "rgba(106, 27, 112, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#E2E8F0",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
        },
      },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="w-full">
      <div>
        <div className="p-8 relative">
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
              Admin Dashboard
            </motion.h1>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {[
                {
                  title: "Total Workers",
                  value: stats.totalWorkers,
                  color: "from-[#00E1F9] to-[#00B4D8]",
                },
                {
                  title: "Total Buyers",
                  value: stats.totalBuyers,
                  color: "from-[#6A1B70] to-[#9D4EDD]",
                },
                {
                  title: "Available Coins",
                  value: stats.totalCoins,
                  color: "from-[#FF9E00] to-[#FF7B00]",
                },
                {
                  title: "Total Payments",
                  value: `$${stats.totalPayments}`,
                  color: "from-[#4CC9F0] to-[#4361EE]",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg border border-white/10`}
                >
                  <h3 className="text-lg font-medium mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Weekly Visitors Analysis
                </h2>
                <div className="flex space-x-2">
                  <span className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full bg-[#00E1F9] mr-1"></span>
                    Unique Visitors
                  </span>
                  <span className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full bg-[#6A1B70] mr-1"></span>
                    Page Views
                  </span>
                </div>
              </div>

              <div className="h-80">
                <Line data={weeklyVisitors} options={chartOptions} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400">Avg. Daily Visitors</p>
                  <p className="text-2xl font-bold">652</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400">Peak Day</p>
                  <p className="text-2xl font-bold">Thursday</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400">Total Week Visitors</p>
                  <p className="text-2xl font-bold">4,560</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold">32%</p>
                </div>
              </div>
            </motion.div>

            {/* Withdrawal Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Withdrawal Requests
                </h2>
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    {Array.isArray(payment)
                      ? payment.filter((w) => w.status === "pending").length
                      : 0}{" "}
                    Pending
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E1F9]"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Method</th>
                        <th className="pb-4">Account</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <span>Loading...</span>
                      ) : (
                        payment
                          .filter((w) => w.status === "pending")
                          .map((request) => (
                            <tr
                              key={request._id}
                              className="border-b border-white/10 hover:bg-white/5"
                            >
                              <td className="py-4">{request?.email}</td>
                              <td className="py-4">{request?.price} coins</td>
                              <td className="py-4">{request?.currency}</td>
                              <td className="py-4">{request?.coins}</td>
                              <td className="py-4">
                                {new Date(request?.createdat).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                              <td className="py-4">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(request.id)}
                                  className="px-4 py-2 bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] rounded-lg text-sm font-medium"
                                >
                                  {request?.status}
                                </motion.button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>

                  {loading ? (
                    <div className="text-center py-8 text-gray-400">
                      Loading...
                    </div>
                  ) : payment.filter((w) => w.status === "pending").length ===
                    0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No pending withdrawal requests
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </div>
        </div>
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
  );
};

export default AdminHome;
