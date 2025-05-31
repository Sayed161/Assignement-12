import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen p-12">
        <div className="text-center text-xl">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen p-12">
        <div className="text-center text-xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen p-12">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
        >
          Task List
        </motion.h1>
        
        {tasks.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xl"
          >
            No tasks found. Add some tasks to get started!
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((taskItem, index) => {
              const task = taskItem.task;
              return (
                <Link to={taskItem._id}>
                <motion.div
                  key={taskItem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#00E1F9]/30 transition-all"
                >
                  {task?.task_image_url && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={task.task_image_url} 
                        alt={task.task_title} 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-[#00E1F9]">{task?.task_title}</h3>
                  <p className="mb-2">{task?.task_detail}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Workers:</span> {task?.required_workers}
                    </div>
                    <div>
                      <span className="text-gray-400">Pay:</span> ${task?.payable_amount?.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-gray-400">Total:</span> ${task?.total_cost?.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-gray-400">Due:</span> {new Date(task?.completion_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={task?.created_by?.photoURL} 
                        alt={task?.created_by?.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm">{task?.created_by?.displayName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      task?.status === 'active' 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {task?.status}
                    </span>
                  </div>
                </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * 100 - 50],
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute w-1 h-1 rounded-full bg-[#00E1F9]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
};

export default TaskList;