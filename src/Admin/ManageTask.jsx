import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit, FiAlertCircle } from 'react-icons/fi';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
     try{
        const token = localStorage.getItem("access-token");
        const res = await axiosSecure.get(`/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const mockTasks = res.data;
        console.log("Mock task ",mockTasks);  
        setTasks(mockTasks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

 const handleDeleteTask = async (taskId) => {
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
    try {
      
      const token = localStorage.getItem("access-token");
      await axiosSecure.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
       Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: "#1a1a2e",
                color: "#fff"
              });
            
      setTasks(tasks.filter(task => task._id !== taskId));
    } 
  catch (err) {
      setError(err.message);
      console.error("Failed to delete task:", err);
    }
  }
}

  

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <motion.h1 
          className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
        >
          Manage Tasks
        </motion.h1>

        {error && (
          <motion.div 
            className="mb-6 p-2 bg-red-500/20 border border-red-500 rounded-lg flex items-center space-x-2"
          >
            <FiAlertCircle />
            <span>{error}</span>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-8 border-t-2 border-b-2 border-[#00E1F9]"></div>
          </div>
        ) : (
          <motion.div 
            className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-4">Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4 font-medium">{task.task?.task_title || task.task_title}</td>
                      <td className="p-4 text-sm text-gray-400 max-w-xs truncate">{task.task?.task_detail ||task.task_detail}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(task.task?.status ||task.status)}`}>
                          {task.task?.status || task.status}
                        </span>
                      </td>
                      <td className="p-4">{task.created_by?.displayName || task.task?.created_by?.displayName }</td>
                      <td className="p-4">{task.task?.completion_date || task.completion_date}</td>
                      <td className="p-4">${task.amount }</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Delete Task"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No tasks found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

   
    </div>
  );
};

export default ManageTask;