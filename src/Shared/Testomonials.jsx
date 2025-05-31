import React from 'react';
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      content: 'This service completely transformed our workflow. The team delivered exceptional results beyond our expectations.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO, TechStart',
      content: 'Incredible attention to detail and professionalism. We saw measurable improvements within the first month.',
      rating: 4,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Small Business Owner',
      content: 'Affordable yet high-quality service. The support team is responsive and genuinely cares about your success.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/63.jpg'
    }
  ];

  return (
    <section className="p-6 relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>

      <div className="relative container mx-auto max-w-6xl z-10 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
            Client Testimonials
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear what our clients say about their experience working with us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#00E1F9]/20 transition-all p-6"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <FaQuoteLeft className="absolute -top-2 -left-2 text-[#00E1F9]/20 text-3xl" />
                <p className="pl-6 text-gray-300 italic">
                  {testimonial.content}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#00E1F9]/30"
                />
                <div>
                  <h3 className="font-bold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] hover:from-[#6A1B70] hover:to-[#00E1F9] transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <span>View More Testimonials</span>
            <LuArrowRight />
          </motion.button>
        </motion.div>
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
  );
};

export default Testimonials;