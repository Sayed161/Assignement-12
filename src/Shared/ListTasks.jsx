import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { LuClipboardList, LuCalendar, LuUser, LuDollarSign, LuArrowRight } from "react-icons/lu";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

const ListTasks = () => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  };

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <section className="min-h-screen p-6 relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
        </div>
        <div className="relative container mx-auto max-w-6xl z-10 flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#00E1F9] border-t-transparent rounded-full"
          ></motion.div>
        </div>
      </section>
    );
  }

  if (isError) {
    Swal.fire({
      title: "Error!",
      text: "Failed to load tasks",
      icon: "error",
      background: '#1a1a2e',
      color: '#fff'
    });
    return (
      <section className="min-h-screen p-6 relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="relative container mx-auto max-w-6xl z-10 flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl text-red-400 mb-4">Error loading tasks</h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen p-6 relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>

      <div className="relative container mx-auto max-w-6xl z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
            Available Tasks
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Browse through available tasks and find one that matches your skills
          </p>
        </motion.div>

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks?.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#00E1F9]/20 transition-all"
            >
              {/* Task Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={task.task?.task_image_url}
                  alt={task.task?.task_title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Task Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{task.task?.task_title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.task?.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {task.task?.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-6">{task.task?.task_detail}</p>

                {/* Task Meta */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <LuUser className="mr-2" />
                    <span>Posted by: {task.task?.created_by?.displayName}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <LuDollarSign className="mr-2" />
                    <span>Pay: ${task.task?.payable_amount} per worker</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <LuClipboardList className="mr-2" />
                    <span>Workers needed: {task.task?.required_workers}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <LuCalendar className="mr-2" />
                    <span>Due: {new Date(task.task?.completion_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 font-medium rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] hover:from-[#6A1B70] hover:to-[#00E1F9] transition-all flex items-center justify-center gap-2"
                >
                  <span>View Details</span>
                  <LuArrowRight />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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
    </section>
  )
}

export default ListTasks;