import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Monitor,
  WifiIcon,
  Keyboard,
  Mouse,
  Fan,
  Lightbulb,
  AirVent,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BarcodeScannerComponent from "./BarcodeScannerComponent";
import BarcodeSearch from "./BarcodeSearch";
import AuthContext from "./context/AuthContext";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import { toast } from "react-toastify";

// ProductCardModal Component
const ProductCardModal = ({ product, onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  console.log("ProductCardModal received product:", product);

  const propertyIcons = {
    keyboard: <Keyboard className="h-8 w-8" />,
    monitor: <Monitor className="h-8 w-8" />,
    mouse: <Mouse className="h-8 w-8" />,
    fan: <Fan className="h-8 w-8" />,
    light: <Lightbulb className="h-8 w-8" />,
    "wifi-router": <WifiIcon className="h-8 w-8" />,
    wifi: <WifiIcon className="h-8 w-8" />,
    default: <AirVent className="h-8 w-8" />,
  };

  const formatType = (type) => {
    return (
      type
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Unknown"
    );
  };

  const getBrand = (name) => {
    return name || "Unknown";
  };

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        deviceBarcode: product?.barcode || "",
        deviceName: product?.name || "Unknown",
        deviceStatus: status,
        description: reportText,
        deviceModel: product?.model || "Unknown",
      };

      const response = await axios.post(
        "https://etrack-backend.onrender.com/report/create",
        payload
      );

      toast.success("Report submitted successfully!");
      setIsSubmitting(false);
      setIsReporting(false);
      setReportText("");
      setStatus("");
      onClose();
    } catch (error) {
      console.error("POST /report/create failed:", {
        status: error?.response?.status || "Unknown",
        data: error?.response?.data || "No data",
      });
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const modalContent = (
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
              <h2 className="text-2xl font-orbitron font-bold text-neon-green">
                Device Details
              </h2>
              <button
                onClick={onClose}
                className="text-deep-gray hover:text-white"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!product || !product.barcode ? (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="text-center py-6"
              >
                <p className="text-lg text-red-500">Device not found.</p>
              </motion.div>
            ) : !isReporting && !isSubmitting ? (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="flex items-center justify-start mb-6">
                  <div
                    className={cn(
                      "p-4 rounded-full mr-4",
                      product.status === "working"
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-red-500/20 text-red-500"
                    )}
                  >
                    {propertyIcons[product.name.toLowerCase()] ||
                      propertyIcons.default}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {formatType(product.name)}
                    </h3>
                    <p className="text-sm text-deep-gray">{product.model}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-deep-gray mb-1">
                        Brand
                      </h4>
                      <p className="text-base text-white">
                        {getBrand(product.name)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-gray mb-1">
                        Model
                      </h4>
                      <p className="text-base text-white">{product.model}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-deep-gray mb-1">
                        Status
                      </h4>
                      <p
                        className={cn(
                          "inline-flex items-center px-2.5 text-sm font-semibold py-1 rounded-full w-full",
                          product.status === "working"
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-red-500/20 text-red-400"
                        )}
                      >
                        {product.status === "working"
                          ? "Working"
                          : "Not Working"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-deep-gray mb-1">
                        Location
                      </h4>
                      <p className="text-sm text-white">
                        {product.location.floor.name},{" "}
                        {product.location.hall.name},{" "}
                        {product.location.room.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      // if (!isLoggedIn) {
                      //   toast.error("Please log in to report an issue.");
                      //   onClose();
                      // } else {
                        setIsReporting(true);
                      // }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cool-blue to-neon-green text-charcoal font-medium"
                    aria-label="Report device issue"
                  >
                    Report Issue
                  </motion.button>
                </div>
              </motion.div>
            ) : isReporting && !isSubmitting ? (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium text-deep-gray mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={product.barcode}
                    readOnly
                    className="w-full p-3 bg-charcoal/50 border border-deep-gray/30 rounded-lg focus:outline-none text-white cursor-not-allowed opacity-80"
                    placeholder="No barcode available"
                    aria-label="Device barcode"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-deep-gray mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 bg-charcoal/50 border border-deep-gray/30 rounded-lg focus:border-neon-green focus:ring-none focus:outline-none text-white"
                    aria-label="Select device status"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="working">Working</option>
                    <option value="not-working">Not Working</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-deep-gray mb-2">
                    Issue Details
                  </label>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="w-full p-3 bg-charcoal/50 border border-deep-gray/30 rounded-lg focus:border-neon-green focus:ring-none focus:outline-none text-white"
                    rows="4"
                    placeholder="Describe the issue you're experiencing..."
                    aria-label="Report issue description"
                  />
                </div>

                <div className="p-4 rounded-lg bg-charcoal border border-deep-gray/30 mb-6">
                  <h3 className="font-orbitron text-sm mb-2 text-white">
                    Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-deep-gray">Type:</span>
                    <span className="text-white">
                      {formatType(product.name)}
                    </span>
                    <span className="text-deep-gray">Brand:</span>
                    <span className="text-white">{getBrand(product.name)}</span>
                    <span className="text-deep-gray">Model:</span>
                    <span className="text-white">{product.model}</span>
                    <span className="text-deep-gray">Location:</span>
                    <span className="text-white">
                      {product.location.floor.name},{" "}
                      {product.location.hall.name}, {product.location.room.name}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    onClick={() => setIsReporting(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border border-deep-gray/30 hover:border-deep-gray/50 text-white"
                    aria-label="Cancel report"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cool-blue to-neon-green text-charcoal font-medium"
                    aria-label="Submit report"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="text-center py-6"
              >
                <Check className="w-12 h-12 text-neon-green mx-auto mb-4" />
                <p className="text-lg text-white">
                  Report submitted successfully!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

const Hero = () => {
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleComplaintClick = () => {
    setShowComplaintModal(true);
  };

  const closeComplaintModal = () => {
    setShowComplaintModal(false);
  };

  const electronicItems = {
    MONITOR: { icon: Monitor, name: "Monitor" },
    KEYBOARD: { icon: Keyboard, name: "Keyboard" },
    MOUSE: { icon: Mouse, name: "Mouse" },
    FAN: { icon: Fan, name: "Fan" },
    LIGHT: { icon: Lightbulb, name: "Light" },
    WIFI_ROUTER: { icon: WifiIcon, name: "Wi-Fi Router" },
    AC: { icon: AirVent, name: "Air Conditioner" },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0, opacity: 0.8 },
    hover: {
      scale: 1.2,
      rotate: 10,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const handleBarcodeDetected = (data) => {
    console.log("Barcode detected:", data);
    if (!data || !data.barcode) {
      setNotFound(true);
      setSelectedProduct(null);
    } else {
      setSelectedProduct(data);
      setNotFound(false);
    }
    setShowScanner(false);
  };

  const handleBarcodeSearch = (productData) => {
    console.log("Barcode search result:", productData);
    if (productData) {
      setSelectedProduct(productData);
      setNotFound(false);
    } else {
      setNotFound(true);
      setSelectedProduct(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setNotFound(false);
  };

  return (
    <main className="flex-grow overflow-x-hidden relative mt-4">
      <section className="min-h-[80vh] w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 to-charcoal z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 py-24 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-0 flex-1 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6 glow-text"
            >
              ETRACK <span className="text-neon-green">SYSTEM</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-sm font-medium text-white md:text-xl mb-2 sm:mb-4 max-w-3xl mx-auto"
            >
              Advanced IoT monitoring system for electronic devices across
              campus
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="hidden md:flex flex-wrap justify-center gap-4 sm:gap-6 mb-2 sm:mb-4"
            >
              {Object.entries(electronicItems).map(
                ([key, { icon: Icon, name }]) => (
                  <motion.div
                    key={key}
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    className="flex flex-col items-center p-2 sm:p-4 rounded-lg bg-charcoal/50 hover:bg-charcoal/80 transition-colors shadow-neon-green/50"
                  >
                    <Icon className="w-10 h-10 text-neon-green" />
                    <span className="text-xs sm:text-sm font-exo text-white mt-2">
                      {name}
                    </span>
                  </motion.div>
                )
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-4 mb-4"
            >
              <button
                onClick={() => setShowScanner(false)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cool-blue to-neon-green text-charcoal font-medium hover:scale-105 transition-transform"
              >
                Search Barcode
              </button>
              <button
                onClick={() => setShowScanner(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cool-blue to-neon-green text-charcoal font-medium hover:scale-105 transition-transform"
              >
                Scan Barcode
              </button>
            </motion.div>

            {showScanner ? (
              <>
                {console.log("Rendering BarcodeScannerComponent")}
                <BarcodeScannerComponent onBarcode={handleBarcodeDetected} />
              </>
            ) : (
              <BarcodeSearch onSearch={handleBarcodeSearch} />
            )}

            {notFound && (
              <motion.p
                className="mt-4 text-red-500 font-medium text-center sm:text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Device not found.
              </motion.p>
            )}

            {selectedProduct && !notFound && (
              <>
                {console.log(
                  "Rendering ProductCardModal with product:",
                  selectedProduct
                )}
                <ProductCardModal
                  product={selectedProduct}
                  onClose={handleCloseModal}
                />
              </>
            )}
          </div>
        </div>
        {showComplaintModal && <ComplaintModal onClose={closeComplaintModal} />}
      </section>
    </main>
  );
};

export default Hero;