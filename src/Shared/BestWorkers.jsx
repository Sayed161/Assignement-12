import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { LuCrown , LuCoins , LuChevronRight } from "react-icons/lu";
const BestWorkers = () => {
  const [topWorkers, setTopWorkers] = useState([]);

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users'); // Replace with your actual API endpoint
        const data = await response.json();

        // Sort by balance descending and pick top 6
        const sorted = data
          .filter(user => user.role === 'Worker') // Optional: filter only workers
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 6);

        setTopWorkers(sorted);
      } catch (error) {
        console.error("Error fetching top workers:", error);
      }
    };

    fetchTopWorkers();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-[#0f0c29] to-[#302b63]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] bg-clip-text text-transparent">
            <LuCrown className="inline-block mr-2 mb-1" /> Top Performers
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our most valuable workers with the highest earnings this month
          </p>
        </motion.div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {topWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-[#00E1F9]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Worker Avatar with Rank Badge */}
                <div className="relative">
                  <img 
                    src={worker.avatar} 
                    alt={worker.name}
                    className="w-16 h-16 rounded-full border-2 border-[#00E1F9] object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                  )}
                </div>

                {/* Worker Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{worker.name}</h3>
                  <div className="flex items-center text-[#00E1F9] mt-1">
                    <LuCoins className="mr-1" />
                    <span className="font-mono">{worker.balance?.toLocaleString()} coins</span>
                  </div>
                </div>

                {/* Rank Indicator */}
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' : 
                  index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' : 
                  'bg-white/10 text-white'
                }`}>
                  #{index + 1}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(worker.coins / topWorkers[0].coins) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' : 
                      'bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]'
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {Math.round((worker.coins / topWorkers[0].coins) * 100)}% of top earner
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white font-medium hover:shadow-lg hover:shadow-[#00E1F9]/30 transition-all"
          >
            View All Top Workers
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestWorkers;
