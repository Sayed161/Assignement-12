import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const slides = [
  {
    id: 1,
    title: "Efficient Task Management",
    description: "Streamline your workflow with our intuitive task management system designed for maximum productivity.",
    cta: "Get Started",
    bg: "from-[#00E1F9] to-[#6A1B70]"
  },
  {
    id: 2,
    title: "Seamless Collaboration",
    description: "Work together effortlessly with real-time updates and team coordination features.",
    cta: "Learn More",
    bg: "from-[#6A1B70] to-[#24243e]"
  },
  {
    id: 3,
    title: "Powerful Analytics",
    description: "Gain insights with detailed performance metrics and progress tracking.",
    cta: "View Demo",
    bg: "from-[#24243e] to-[#00E1F9]"
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 0: initial, 1: right, -1: left
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Memoized slide change handler
  const goToSlide = useCallback((newIndex, newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(newIndex);
  }, []);

  // Next slide with direction
  const nextSlide = useCallback(() => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex + 1) % slides.length;
    goToSlide(newIndex, 1);
  }, [currentIndex, goToSlide]);

  // Previous slide with direction
  const prevSlide = useCallback(() => {
    setIsAutoPlaying(false);
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(newIndex, -1);
  }, [currentIndex, goToSlide]);

  // Auto-play effect
  useEffect(() => {
    let intervalId;
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex, 1);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [currentIndex, isAutoPlaying, goToSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100 pt-24 pb-32 h-[600px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>
      
      {/* Optimized Floating particles - reduced quantity */}
      {[...Array(8)].map((_, i) => (
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
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#00E1F9]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 h-full">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={slides[currentIndex].id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5 
            }}
            className="flex flex-col items-center text-center h-full justify-center absolute inset-0"
          >
            <div className={`p-8 rounded-2xl bg-gradient-to-r ${slides[currentIndex].bg} mb-8 max-w-4xl mx-auto`}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold leading-tight mb-4"
              >
                {slides[currentIndex].title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
              >
                {slides[currentIndex].description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 text-lg font-semibold rounded-lg bg-white text-gray-900 hover:bg-gray-100 shadow-lg flex items-center mx-auto"
                >
                  {slides[currentIndex].cta} <LuArrowRight className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Previous slide"
          >
            <LuChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#00E1F9] w-6' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Next slide"
          >
            <LuChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </section>
   
  );
};

export default Hero;