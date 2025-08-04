import React from 'react';
import { motion } from 'framer-motion';
import { WifiIcon, MonitorIcon, ApertureIcon as TemperatureIcon, ThermometerIcon, ShieldIcon } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 tracking-wider">
            <span className="text-neon-green">Advanced</span> Monitoring Features
          </h2>
          <p className="text-deep-gray max-w-2xl mx-auto">
            Comprehensive tracking and management of all electronic devices throughout the campus with real-time alerts and intelligent analytics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MonitorIcon className="text-neon-green" size={24} />}
            title="Smart Display Monitoring"
            description="Real-time tracking of all monitors and displays with automatic issue detection and reporting."
            delay={0.1}
          />
          <FeatureCard 
            icon={<WifiIcon className="text-cool-blue" size={24} />}
            title="Network Infrastructure"
            description="Continuous monitoring of all network devices including routers, switches, and access points."
            delay={0.2}
          />
          <FeatureCard 
            icon={<ThermometerIcon className="text-neon-green" size={24} />}
            title="Climate Control"
            description="Automated monitoring and management of HVAC systems and air conditioners across all buildings."
            delay={0.3}
          />
          <FeatureCard 
            icon={<ShieldIcon className="text-cool-blue" size={24} />}
            title="Security Systems"
            description="Comprehensive surveillance system management with AI-powered anomaly detection."
            delay={0.4}
          />
          <FeatureCard 
            icon={<TemperatureIcon className="text-neon-green" size={24} />}
            title="Environmental Metrics"
            description="Track temperature, humidity, and air quality metrics for optimal learning environments."
            delay={0.5}
          />
          <FeatureCard 
            icon={<MonitorIcon className="text-cool-blue" size={24} />}
            title="Predictive Maintenance"
            description="AI-powered analytics to predict device failures before they occur, reducing downtime."
            delay={0.6}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cool-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl"></div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="glassmorphism rounded-lg p-6 neon-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
    >
      <div className="mb-4 p-3 rounded-full w-12 h-12 flex items-center justify-center bg-darker-blue">
        {icon}
      </div>
      <h3 className="font-orbitron text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-deep-gray">{description}</p>
    </motion.div>
  );
};

export default Features;