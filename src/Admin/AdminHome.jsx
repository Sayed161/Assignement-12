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
import Swal from "sweetalert2";

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
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    if (Userinfo.length > 0) {
      const counts = {
        total: Userinfo.length,
        admin: Userinfo.filter((user) => user.role === "Admin").length,
        worker: Userinfo.filter((user) => user.role === "Worker").length,
        buyer: Userinfo.filter((user) => user.role === "Buyer").length,
      };

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
  }, [Userinfo, payment]);

  const { Quser } = useContext(AuthContext);
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
        setPayment(Array.isArray(dres.data) ? dres.data : [dres.data]);
        setUser(res.data);
      } catch (err) {
        console.log("Message", err.response?.data?.message || err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    const fetchUser = async () => {
      try {
        if (!Quser?.email) return;
        const token = localStorage.getItem("access-token");
        const response = await axiosSecure.get(`/users?email=${Quser?.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setTotalCoins(response.data.balance);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
    
    }
  }
    fetchUser();
    fetchTask();
  }, []);

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



  const handleStatus = async (checkId, status) => {
    try {
      const token = localStorage.getItem("access-token");
      // First update the payment status
      await axiosSecure.patch(
        `/checkout/${checkId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If approved, update user balance
      if (status === "Approved") {
        const request = payment.find((p) => p._id === checkId);
        if (request) {
          await axiosSecure.patch(
            `/users/${request.userId}`,
            {
              balance: request.coinsToDeduct, // or whatever field contains the amount to deduct
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      // Update local state
      setPayment(
        payment.map((p) => (p._id === checkId ? { ...p, status } : p))
      );

      Swal.fire({
        title: "Success!",
        text: `Withdrawal request ${status.toLowerCase()}`,
        icon: "success",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
      });
    }
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#E2E8F0",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
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
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="p-4 md:p-8 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <motion.h1 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
            Admin Dashboard
          </motion.h1>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {[
              {
                title: "Workers",
                value: stats.totalWorkers,
                color: "from-[#00E1F9] to-[#00B4D8]",
              },
              {
                title: "Buyers",
                value: stats.totalBuyers,
                color: "from-[#6A1B70] to-[#9D4EDD]",
              },
              {
                title: "Coins",
                value: stats.totalCoins,
                color: "from-[#FF9E00] to-[#FF7B00]",
              },
              {
                title: "Payments",
                value: `$${stats.totalPayments}`,
                color: "from-[#4CC9F0] to-[#4361EE]",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${stat.color} rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-white/10`}
              >
                <h3 className="text-sm md:text-lg font-medium mb-1 md:mb-2">
                  {stat.title}
                </h3>
                <p className="text-xl md:text-3xl font-bold">
                  {loading ? "..." : stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart Section */}
          <motion.div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 backdrop-blur-sm mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-0">
                Weekly Visitors
              </h2>
              <div className="flex space-x-2 md:space-x-4">
                <span className="flex items-center text-xs md:text-sm">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00E1F9] mr-1"></span>
                  Visitors
                </span>
                <span className="flex items-center text-xs md:text-sm">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#6A1B70] mr-1"></span>
                  Page Views
                </span>
              </div>
            </div>

            <div className="h-60 md:h-80">
              <Line data={weeklyVisitors} options={chartOptions} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              {[
                { label: "Avg. Visitors", value: "652" },
                { label: "Peak Day", value: "Thu" },
                { label: "Total Visitors", value: "4,560" },
                { label: "Bounce Rate", value: "32%" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-2 md:p-4 rounded-lg border border-white/10"
                >
                  <p className="text-xs md:text-sm text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-lg md:text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-0">
                Withdrawal Requests
              </h2>
              {loading ? (
                <span className="text-sm">Loading...</span>
              ) : (
                <span className="text-sm">
                  {Array.isArray(payment)
                    ? payment.filter((w) => w.status === "pending").length
                    : 0}{" "}
                  Pending
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-[#00E1F9]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">User</th>
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">
                        Amount
                      </th>
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">
                        Method
                      </th>
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">
                        Account
                      </th>
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">Date</th>
                      <th className="pb-2 md:pb-4 text-xs md:text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment
                      .filter((w) => w.status === "pending")
                      .map((request) => (
                        <tr
                          key={request._id}
                          className="border-b border-white/10 hover:bg-white/5"
                        >
                          <td className="py-2 md:py-4 text-xs md:text-sm">
                            {request?.email}
                          </td>
                          <td className="py-2 md:py-4 text-xs md:text-sm">
                            {request?.price} coins
                          </td>
                          <td className="py-2 md:py-4 text-xs md:text-sm">
                            {request?.currency}
                          </td>
                          <td className="py-2 md:py-4 text-xs md:text-sm">
                            {request?.coins}
                          </td>
                          <td className="py-2 md:py-4 text-xs md:text-sm">
                            {new Date(request?.createdat).toLocaleDateString(
                              "en-US"
                            )}
                          </td>
                          <td className="py-2 md:py-4">
                            <select
                              value={request?.status}
                              onChange={(e) =>
                                handleStatus(request?._id, e.target.value)
                              }
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00E1F9]"
                              disabled={loading}
                            >
                              <option value="pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Declined">Declined</option>{" "}
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {payment.filter((w) => w.status === "pending").length === 0 && (
                  <div className="text-center py-6 md:py-8 text-gray-400 text-sm md:text-base">
                    No pending withdrawal requests
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
