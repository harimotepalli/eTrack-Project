import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="text-neon-green" size={28} />
              <h2 className="text-white font-orbitron text-xl font-bold tracking-wider">
                <span className="text-cool-blue">E</span>TRACK
              </h2>
            </motion.div>
            <p className="text-deep-gray mb-6">
              An advanced IoT-based electronics tracking and management system for TECHNICAL HUB.
              Monitoring and maintaining campus devices with real-time analytics and smart reporting.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Github size={20} />} />
              <SocialLink icon={<Twitter size={20} />} />
              <SocialLink icon={<Linkedin size={20} />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-orbitron text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#devices">Devices</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-orbitron text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-deep-gray">
              <li>Technical Hub, Campus Building</li>
              <li>Floor 3, Wing B</li>
              <li>support@etrack.tech</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-cool-blue/20 text-center">
          <p className="text-deep-gray text-sm">
            © {new Date().getFullYear()} Etrack System - TECHNICAL HUB. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-darker-blue/50 to-transparent"></div>
    </footer>
  );
};

const SocialLink = ({ icon }) => (
  <motion.a
    href="#"
    className="w-10 h-10 rounded-full flex items-center justify-center bg-darker-blue text-deep-gray hover:text-neon-green border border-cool-blue/20 transition-colors"
    whileHover={{ scale: 1.1, borderColor: 'rgba(0, 255, 204, 0.5)' }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <motion.a
      href={href}
      className="text-deep-gray hover:text-white transition-colors"
      whileHover={{ x: 5, color: '#00ffcc' }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.a>
  </li>
);

export default Footer;