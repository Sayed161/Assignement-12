import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useLoaderData, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../Providers/AuthProviders';
import axios from 'axios';
import Swal from 'sweetalert2';


const TaskDetails = () => {
    const data = useLoaderData();
    const task = data[0];
    const navigate = useNavigate();
    const { Quser } = useContext(AuthContext);
    const [submissionDetails, setSubmissionDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("task",data);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submissionData = {
            task_id: task?._id,
            task_title: task?.task?.task_title,
            payable_amount: task?.task?.payable_amount,
            worker_email: Quser?.email,
            submission_details: submissionDetails,
            worker_name: Quser?.displayName,
            Buyer_name: task?.task?.created_by?.displayName,
            Buyer_email: task?.task?.created_by?.email,
            current_date: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const response = await axios.post('http://localhost:5000/submissions', {submissionData
            });
            
            const result = await response.data;
            if (result) {
                Swal.fire({
                          title: 'Submission Successfull',
                          text: 'Submission have been added to your account',
                          icon: 'success'
                        });
                
                setSubmissionDetails('');
            } else {
                toast.error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit. Please try again.');
        } finally {
            setTimeout(() => navigate("/"), 1000);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen p-12">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10"
                >
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Task Image */}
                        {task?.task?.task_image_url && (
                            <div className="md:w-1/3">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="overflow-hidden rounded-lg"
                                >
                                    <img 
                                        src={task?.task?.task_image_url} 
                                        alt={task?.task?.task_title} 
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            </div>
                        )}
                        
                        {/* Task Details */}
                        <div className="md:w-2/3">
                            <div className="flex justify-between items-start mb-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
                                >
                                    {task?.task?.task_title}
                                </motion.h1>
                                
                                <span className={`px-4 py-1 rounded-full text-sm ${
                                    task?.task?.status === 'active' 
                                        ? 'bg-green-900/50 text-green-300' 
                                        : 'bg-yellow-900/50 text-yellow-300'
                                }`}>
                                    {task?.task?.status}
                                </span>
                            </div>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg mb-6"
                            >
                                {task?.task?.task_detail}
                            </motion.p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <h3 className="text-sm text-gray-400 mb-2">Payment Information</h3>
                                    <div className="space-y-2">
                                        <p>Pay per worker: <span className="text-[#00E1F9]">${task?.task?.payable_amount?.toFixed(2)}</span></p>
                                        <p>Total workers needed: <span className="text-[#00E1F9]">{task?.task?.required_workers}</span></p>
                                        <p>Total budget: <span className="text-[#00E1F9]">${task?.task?.total_cost?.toFixed(2)}</span></p>
                                    </div>
                                </div>
                                
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <h3 className="text-sm text-gray-400 mb-2">Task Information</h3>
                                    <div className="space-y-2">
                                        <p>Due date: <span className="text-[#00E1F9]">{new Date(task?.task?.completion_date).toLocaleDateString()}</span></p>
                                        <p>Created on: <span className="text-[#00E1F9]">{new Date(task?.task?.created_at).toLocaleDateString()}</span></p>
                                        <p>Submission: <span className="text-[#00E1F9]">{task?.task?.submission_info}</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Submission Form */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-[#00E1F9]">Submit Your Work</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="submissionDetails" className="block text-sm font-medium mb-2">
                                            Submission Details
                                        </label>
                                        <textarea
                                            id="submissionDetails"
                                            name="submission_Details"
                                            rows="5"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E1F9]"
                                            placeholder="Enter your submission details here..."
                                            value={submissionDetails}
                                            onChange={(e) => setSubmissionDetails(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white font-medium ${
                                            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                                        }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Work'}
                                    </button>
                                </form>
                            </motion.div>
                            
                            {/* Creator Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/10"
                            >
                                <img 
                                    src={task?.task?.created_by?.photoURL} 
                                    alt={task?.task?.created_by?.displayName}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">Created by</p>
                                    <p className="text-[#00E1F9]">{task?.task?.created_by?.displayName}</p>
                                    <p className="text-sm text-gray-400">{task?.task?.created_by?.email}</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
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

export default TaskDetails;