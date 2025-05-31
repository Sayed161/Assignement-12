import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';

const Submission = () => {
    const { Quser } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/submissions?worker_email=${Quser?.email}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setSubmissions(data.data);
                } else {
                    toast.error(data.message || 'Failed to fetch submissions');
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
                toast.error('Failed to fetch submissions');
            } finally {
                setLoading(false);
            }
        };

        if (Quser?.email) {
            fetchSubmissions();
        }
    }, [Quser?.email]);

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
                    <div className="flex justify-between items-center mb-8">
                        <motion.h1 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]"
                        >
                            My Submissions
                        </motion.h1>
                        <p className="text-[#00E1F9]">{submissions.length} submissions found</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E1F9]"></div>
                        </div>
                    ) : submissions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center py-12"
                        >
                            <p className="text-xl mb-4">You haven't made any submissions yet</p>
                            <Link 
                                to="/tasks" 
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white font-medium hover:opacity-90 inline-block"
                            >
                                Browse Tasks
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {submissions.map((submission, index) => (
                                <motion.div
                                    key={submission._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#00E1F9]/30 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#00E1F9] mb-2">
                                                {submission.submissionData.task_title}
                                            </h3>
                                            <p className="text-sm text-gray-400 mb-1">Submitted on: {new Date(submission.submissionData.current_date).toLocaleDateString()}</p>
                                            <p className="mb-4 line-clamp-2">{submission.submissionData.submission_details}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs ${
                                                    submission.submissionData.status === 'approved' 
                                                        ? 'bg-green-900/50 text-green-300' 
                                                        : submission.status === 'rejected'
                                                        ? 'bg-red-900/50 text-red-300'
                                                        : 'bg-yellow-900/50 text-yellow-300'
                                                }`}>
                                                    {submission.submissionData.status}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs bg-purple-900/50 text-purple-300">
                                                    ${submission.submissionData.payable_amount?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Buyer:</p>
                                            <p className="text-[#00E1F9]">{submission.submissionData.Buyer_name}</p>
                                            <Link 
                                                to={`/tasklist/${submission.submissionData.task_id}`}
                                                className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-all"
                                            >
                                                View Task
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
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

export default Submission;