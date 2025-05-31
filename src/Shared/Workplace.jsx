import React from 'react';
import { motion } from 'framer-motion';
import { LuRocket, LuUsers, LuCoffee, LuBrain } from 'react-icons/lu';
import { FaQuoteLeft } from "react-icons/fa";

const Workplace = () => {
  const perks = [
    {
      icon: <LuRocket className="text-3xl" />,
      title: "Zero-Gravity Workspace",
      description: "Our virtual offices eliminate all friction - work from anywhere in the cosmos",
      color: "from-[#00E1F9] to-[#00B4D8]"
    },
    {
      icon: <LuUsers className="text-3xl" />,
      title: "Interstellar Team",
      description: "Collaborate with top talent across galaxies (and timezones)",
      color: "from-[#6A1B70] to-[#9D4EDD]"
    },
    {
      icon: <LuCoffee className="text-3xl" />,
      title: "Cosmic Cafés",
      description: "Virtual coffee breaks with colleagues orbiting the same projects",
      color: "from-[#FF9E00] to-[#FF6D00]"
    },
    {
      icon: <LuBrain className="text-3xl" />,
      title: "Neural Boosters",
      description: "Access to cutting-edge productivity tools and AI co-pilots",
      color: "from-[#00F5A0] to-[#00D9F5]"
    }
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Cosmic Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>
      
      {/* Floating Planets */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#6A1B70] to-[#9D4EDD] opacity-20 blur-xl"></div>
      <div className="absolute bottom-1/3 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-[#00E1F9] to-[#00B4D8] opacity-10 blur-xl"></div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
            Our Cosmic Workplace
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Where gravity doesn't limit productivity and ideas can orbit freely across the universe
          </p>
        </motion.div>

        {/* Perks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${perk.color} rounded-full`}>
                {perk.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{perk.title}</h3>
              <p className="text-gray-300">{perk.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Virtual Office Views</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="relative h-48 rounded-xl overflow-hidden group"
              >
                <img 
                  src={img} 
                  alt="Workplace environment" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Cosmic Zone {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#00E1F9]/30 mx-auto md:mx-0">
                <img 
                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <FaQuoteLeft className="text-3xl text-[#00E1F9]/30 mb-4 mx-auto md:mx-0" />
              <p className="text-lg text-gray-300 italic mb-6">
                "Working at CosmicWorks feels like being part of an interstellar mission - every day brings new challenges and opportunities to collaborate with brilliant minds across the galaxy. The virtual offices make me feel connected despite lightyears of distance."
              </p>
              <div>
                <h4 className="text-white font-bold">Dr. Elena Vega</h4>
                <p className="text-[#00E1F9]">Quantum Team Lead, Joined 2023</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Workplace;