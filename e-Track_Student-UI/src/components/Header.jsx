import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu, X, MonitorCheck, LogOut, User } from "lucide-react";
import AuthContext from "./context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:5174/login';
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-charcoal/80 backdrop-blur-md py-3 shadow-neon"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <MonitorCheck className="w-8 h-8 text-neon-green mr-2" />
              <span className="font-orbitron font-bold text-xl text-white">
                TECHNICAL <span className="text-neon-green">HUB</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <HashLink
                smooth
                to="/#"
                className={({ isActive }) =>
                  isActive ? "text-green-400" : "text-white"
                }
              >
                Home
              </HashLink>
              <HashLink
                smooth
                to="/#about"
                className={({ isActive }) =>
                  isActive ? "text-green-400" : "text-white"
                }
              >
                About
              </HashLink>
              <HashLink
                smooth
                to="/#devices"
                className={({ isActive }) =>
                  isActive ? "text-green-400" : "text-white"
                }
              >
                Devices
              </HashLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive ? "text-green-400" : "text-white"
                }
              >
                My Reports
              </NavLink>

              <HashLink smooth to="/#support" className="text-white">
                Support
              </HashLink>

              {isLoggedIn ? (
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-full bg-cool-blue/20 border border-cool-blue/50 text-white transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => window.location.href = 'http://localhost:5174/login'}
                  className="flex items-center px-4 py-2 rounded-full bg-neon-green/20 border border-neon-green/50 text-white transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </motion.button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 py-2" : "text-white py-2"
                  }
                  onClick={toggleMenu}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    isActive ? "text-green-400 py-2" : "text-white py-2"
                  }
                  onClick={toggleMenu}
                >
                  My Reports
                </NavLink>
                <HashLink
                  smooth
                  to="/#devices"
                  className="text-white py-2"
                  onClick={toggleMenu}
                >
                  Devices
                </HashLink>
                <HashLink
                  smooth
                  to="/#about"
                  className="text-white py-2"
                  onClick={toggleMenu}
                >
                  About
                </HashLink>
                <HashLink
                  smooth
                  to="/#support"
                  className="text-white py-2"
                  onClick={toggleMenu}
                >
                  Support
                </HashLink>

                {isLoggedIn ? (
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center py-2 text-white transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => {
                      window.location.href = 'http://localhost:5174/login';
                      toggleMenu();
                    }}
                    className="flex items-center py-2 text-white transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </motion.button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
};

export default Header;
