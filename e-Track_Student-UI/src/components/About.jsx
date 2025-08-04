import React from "react";
import { motion } from "framer-motion";
import AITHUBVideo from "../assets/AITHUB.mp4";

const AboutSection = () => {
  // Animation variants for fade-up effect
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animation variants for buttons
  const hoverEffect = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 10px rgba(0, 255, 204, 0.5)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white tracking-wider">
            About <span className="text-neon-green">ETrack</span> Property
            System
          </h2>
          <p className="text-deep-gray max-w-2xl mx-auto mt-4">
            A student-centric platform for managing campus infrastructure, smart
            facilities, and residential services with real-time insights.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Content Section */}
          {/* <motion.div
            className="md:w-1/2 bg-darker-blue/30 backdrop-blur-sm rounded-lg p-6 border border-cool-blue/30 shadow-neon-blue"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="font-orbitron text-xl font-semibold text-white mb-4">
              Empowering Campus Living
            </h3>
            <p className="text-deep-gray text-sm mb-4">
              ETrack revolutionizes campus management by providing students with
              a seamless digital platform to interact with university
              infrastructure. From reporting maintenance issues to accessing
              real-time room allocation data, ETrack ensures a hassle-free
              experience.
            </p>
            <h3 className="font-orbitron text-xl font-semibold text-white mb-4">
              Key Features
            </h3>
            <ul className="text-deep-gray text-sm list-disc list-inside space-y-2">
              <li>
                Real-time monitoring of campus facilities with automated alerts.
              </li>
              <li>
                Instant issue reporting for maintenance and infrastructure
                problems.
              </li>
              <li>
                Secure access to room assignments and facility dashboards.
              </li>
              <li>
                AI-powered analytics for predictive maintenance and optimal
                resource allocation.
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.a
                href="/learn-more"
                className="inline-block bg-cool-blue/20 text-white font-exo font-semibold py-3 px-6 rounded-lg shadow-neon-blue text-center border border-cool-blue/30 backdrop-blur-sm"
                variants={hoverEffect}
                whileHover="hover"
              >
                Learn More
              </motion.a>
              <motion.a
                href="/dashboard"
                className="inline-block bg-neon-green/20 text-white font-exo font-semibold py-3 px-6 rounded-lg shadow-neon-green text-center border border-neon-green/30 backdrop-blur-sm"
                variants={hoverEffect}
                whileHover="hover"
              >
                View Dashboard
              </motion.a>
            </div>
          </motion.div> */}

          <motion.div
            className="md:w-1/2 p-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="space-y-4">
              <h3 className="font-orbitron text-xl font-semibold text-white">
                What is ETrack?
              </h3>
              <p className="text-deep-gray text-sm">
                ETrack is a digital property and infrastructure management
                platform tailored for students and institutions. It centralizes
                service requests, facility monitoring, and room information,
                ensuring a smooth, transparent campus experience.
              </p>

              <h3 className="font-orbitron text-xl font-semibold text-white mt-6">
                How It Helps
              </h3>
              <ul className="text-deep-gray text-sm list-disc list-inside space-y-2">
                <li>One-tap issue reporting and tracking</li>
                <li>Dashboard access to room & maintenance data</li>
                <li>Predictive alerts using AI-powered analytics</li>
                <li>Efficient facility utilization and planning</li>
              </ul>

              <div className="mt-6">
                <motion.a
                  href="/features"
                  className="inline-block bg-neon-green/20 text-white font-exo font-semibold py-3 px-6 rounded-lg shadow-neon-green text-center border border-neon-green/30 backdrop-blur-sm"
                  variants={hoverEffect}
                  whileHover="hover"
                >
                  Explore Features
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <video
              src={AITHUBVideo}
              loop
              muted
              autoPlay
              playsInline
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cool-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default AboutSection;
