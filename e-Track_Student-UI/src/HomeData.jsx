import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import DeviceShowcase from "./components/DeviceShowcase";
import StatsSection from "./components/StatsSection";

import About from "./components/About";
const Homedata = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <DeviceShowcase />
      <StatsSection />
    </>
  );
};
export default Homedata;
