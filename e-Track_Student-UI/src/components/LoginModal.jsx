import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, AtSign } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthContext from './context/AuthContext';

const LoginModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Mock login
    login({ id: 1, email: formData.email });
    toast.success("Logged in successfully!");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glassmorphism relative rounded-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-orbitron font-bold text-cool-blue">Login Required</h2>
              <button 
                onClick={onClose}
                className="text-deep-gray hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-deep-gray mb-6">
              Please login to report device issues and access the full functionality of the Etrack System.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-deepGray mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-deepGray" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-charcoal/50 border border-deep-gray/30 rounded-lg focus:border-cool-blue focus:ring focus:ring-cool-blue/20 focus:outline-none text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-deepGray mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-deepGray" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-charcoal/50 border border-deep-gray/30 rounded-lg focus:border-cool-blue focus:ring focus:ring-cool-blue/20 focus:outline-none text-white"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cool-blue focus:ring-cool-blue/20 border-deep-gray/30 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-deepGray">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-cool-blue hover:text-cool-blue/80">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cool-blue to-neon-green text-charcoal font-bold font-orbitron"
                >
                  Sign In
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-deepGray">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-cool-blue hover:text-cool-blue/80">
                Register Now
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;