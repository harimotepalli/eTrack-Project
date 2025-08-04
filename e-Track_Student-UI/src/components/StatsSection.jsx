import React, { useState, useEffect, useRef } from 'react';

const StatCard = ({ icon, value, label, colorClass, shadowClass }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className="bg-[#1c1e24]/90 rounded-xl p-6 text-center w-full max-w-xs hover:shadow-lg hover:shadow-sky-400/30 hover:scale-105 transition-all duration-300"
    >
      {icon}
      <div className={`text-3xl md:text-5xl font-bold ${colorClass} ${shadowClass}`}>
        {count.toLocaleString()}+
      </div>
      <div className="text-slate-400 text-sm md:text-base mt-2">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-[#0f1115] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h3 className="text-sky-400 text-base font-semibold mb-2">Our Stats</h3>
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-8">
            5000+ Assets Managed
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-around items-center gap-6">
          <StatCard
            icon={
              <svg className="w-10 h-10 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            }
            value={350}
            label="Monitors"
            colorClass="text-sky-400"
            shadowClass="drop-shadow-[0_0_10px_#38bdf8]"
          />
          <StatCard
            icon={
              <svg className="w-10 h-10 mx-auto mb-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            value={420}
            label="CC Cams"
            colorClass="text-neon-green"
            shadowClass="drop-shadow-[0_0_10px_#4ade80]"
          />
          <StatCard
            icon={
              <svg className="w-10 h-10 mx-auto mb-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            }
            value={95}
            label="ACs"
            colorClass="text-pink-400"
            shadowClass="drop-shadow-[0_0_10px_#f472b6]"
          />
        </div>
        <p className="text-slate-500 text-sm text-center mt-8">
          Last updated: June 2025
        </p>
      </div>
    </section>
  );
};

export default StatsSection;