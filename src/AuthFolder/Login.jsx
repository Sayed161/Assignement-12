import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../Providers/AuthProviders";
import { FaGoogle, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const { userLogin, GoogleLogin, setUser, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Using an SVG illustration URL from Undraw
  const loginIllustrationUrl = "https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleLogin = () => {
    GoogleLogin().then(res => {
      const user = res.user;
      setUser(user);
      setLoading(false);
      showSuccessAlert();
    });
  };

  const handleLogin = (data) => {
    userLogin(data).then(res => {
      const user = res.user;
      setUser(user);
      setLoading(false);
      showSuccessAlert();
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Login Successful!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
      background: '#1a1a2e',
      color: '#fff'
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>

      <div className="relative container mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 xl:grid-cols-5 text-white z-10">
        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-6 py-16 xl:col-span-2 flex items-center justify-center"
        >
          <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70]">
                Welcome Back
              </h2>
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-[#00E1F9] hover:text-[#6A1B70] transition-colors font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 mb-6 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
            >
              <FaGoogle className="text-xl" />
              <span>Continue with Google</span>
            </motion.button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-gray-400">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#00E1F9] focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link to="#" className="text-sm text-[#00E1F9] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#00E1F9] focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 font-medium rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] hover:from-[#6A1B70] hover:to-[#00E1F9] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <FaArrowRight />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center xl:col-span-3"
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
              alt="Login illustration"
              className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-3xl font-bold mb-2">Join Our Community</h3>
                <p className="text-gray-300 max-w-md">
                  Connect with thousands of users and explore amazing features designed just for you.
                </p>
              </div>
            </div>
          </div>
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

export default Login;