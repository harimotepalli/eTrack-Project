import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Laptop, Monitor, AirVent, Cctv } from 'lucide-react';

const DeviceShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="devices" ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 tracking-wider">
            <span className="text-cool-blue">Monitored</span> Devices
          </h2>
          <p className="text-deep-gray max-w-2xl mx-auto">
            The Etrack System maintains and monitors a wide variety of electronic devices throughout the campus.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DeviceCard 
            title="Smart Displays & Monitors"
            description="Interactive displays and monitors with real-time health status monitoring and remote management capabilities."
            visual={<MonitorVisual />}
            stats={[
              { label: "Total Devices", value: "240+" },
              { label: "Current Status", value: "98% Active" },
              { label: "Average Lifespan", value: "5.2 Years" }
            ]}
            delay={0.1}
            isInView={isInView}
          />
          
          <DeviceCard 
            title="Climate Control Systems"
            description="Smart air conditioning units with temperature regulation, power consumption monitoring, and automated maintenance alerts."
            visual={<ACVisual />}
            stats={[
              { label: "Total Units", value: "78" },
              { label: "Power Savings", value: "32%" },
              { label: "Coverage", value: "100% Rooms" }
            ]}
            delay={0.3}
            isInView={isInView}
          />
          
          <DeviceCard 
            title="Surveillance Systems"
            description="High-definition CCTV cameras with motion detection, facial recognition, and integrated alert systems."
            visual={<CCTVVisual />}
            stats={[
              { label: "Camera Units", value: "120+" },
              { label: "Coverage", value: "24/7" },
              { label: "Storage", value: "90 Days" }
            ]}
            delay={0.5}
            isInView={isInView}
          />
          
          <DeviceCard 
            title="Computing Infrastructure"
            description="Computers, servers, and laptops with performance monitoring, software management, and security tracking."
            visual={<ComputerVisual />}
            stats={[
              { label: "Workstations", value: "350+" },
              { label: "Servers", value: "12" },
              { label: "Uptime", value: "99.9%" }
            ]}
            delay={0.7}
            isInView={isInView}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 -right-32 w-64 h-64 bg-cool-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl"></div>
    </section>
  );
};

const DeviceCard = ({ title, description, visual, stats, delay, isInView }) => {
  return (
    <motion.div 
      className="glassmorphism rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 h-48 md:h-full relative overflow-hidden bg-darker-blue flex items-center justify-center">
          {visual}
        </div>
        <div className="md:col-span-2 p-6">
          <h3 className="font-orbitron text-xl font-semibold mb-2 text-white">{title}</h3>
          <p className="text-deep-gray text-sm mb-4">{description}</p>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-neon-green font-orbitron font-bold">{stat.value}</p>
                <p className="text-deep-gray text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Visual components for each device type
const MonitorVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      animate={{ 
        rotateY: [0, 10, 0, -10, 0],
        boxShadow: [
          '0 0 10px rgba(88, 166, 255, 0.3)',
          '0 0 20px rgba(88, 166, 255, 0.5)',
          '0 0 10px rgba(88, 166, 255, 0.3)',
        ]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        repeatType: "reverse"
      }}
      className="relative w-3/4 h-3/4 flex items-center justify-center"
    >
      <Monitor size={80} className="text-cool-blue" />
      <div className="absolute inset-0 border-2 border-cool-blue/30 rounded-md"></div>
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-neon-green"
        animate={{ width: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

const ACVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <motion.div
      animate={{ 
        y: [0, -5, 0, 5, 0],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        repeatType: "reverse"
      }}
      className="relative"
    >
      <AirVent size={80} className="text-neon-green" />
      
      {/* Animated air particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cool-blue/70 rounded-full"
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 0.8 
          }}
          animate={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
            scale: [1, 1.5, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  </div>
);

const CCTVVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      animate={{ 
        rotateZ: [0, 5, 0, -5, 0],
      }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        repeatType: "reverse"
      }}
      className="relative"
    >
      <Cctv size={80} className="text-cool-blue" />
      
      {/* Blinking light */}
      <motion.div 
        className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neon-green"
        animate={{ 
          opacity: [1, 0.2, 1],
          boxShadow: [
            '0 0 4px rgba(0, 255, 204, 0.5)',
            '0 0 8px rgba(0, 255, 204, 0.8)',
            '0 0 4px rgba(0, 255, 204, 0.5)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Camera view cone */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[100px] border-l-transparent border-r-transparent border-b-cool-blue/10"
        style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}
        animate={{ 
          borderBottomColor: ['rgba(88, 166, 255, 0.05)', 'rgba(88, 166, 255, 0.15)', 'rgba(88, 166, 255, 0.05)']
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

const ComputerVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        repeatType: "reverse"
      }}
      className="relative"
    >
      <Laptop size={80} className="text-neon-green" />
      
      {/* Screen glow */}
      <motion.div 
        className="absolute inset-0 rounded-md bg-cool-blue/5"
        animate={{ 
          boxShadow: [
            'inset 0 0 10px rgba(88, 166, 255, 0.3)',
            'inset 0 0 20px rgba(88, 166, 255, 0.5)',
            'inset 0 0 10px rgba(88, 166, 255, 0.3)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Processing animation */}
      <motion.div 
        className="absolute bottom-2 left-1/4 right-1/4 h-1 bg-neon-green/50 rounded-full"
        animate={{ 
          scaleX: [0.3, 1, 0.3],
          x: ['-20%', '20%', '-20%']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

export default DeviceShowcase;