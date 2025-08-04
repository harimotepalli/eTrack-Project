// src/components/BarcodeSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchProductData } from "../data/sampledata";

const BarcodeSearch = ({ onSearch }) => {
  const [barcode, setBarcode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const inputRef = useRef(null);

  // Fetch product data on component mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchProductData();
      setProductData(data);
    }
    loadData();
  }, []);

  // Handle input change and filter suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setBarcode(value);

    if (value.trim()) {
      const filteredSuggestions = productData
        .filter((p) =>
          p.barcode.toLowerCase().includes(value.toLowerCase().trim())
        )
        .map((p) => p.barcode)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setBarcode(suggestion);
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  // Handle search
  const handleSearch = () => {
    const found = productData.find((p) => p.barcode === barcode.trim());
    onSearch(found);
    setIsDropdownOpen(false);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        className="relative w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[40vw] mx-auto"
        ref={inputRef}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Enter barcode number..."
            value={barcode}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gradient-to-r from-green-400 to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-black/80 backdrop-blur-md text-sm sm:text-base font-orbitron font-semibold shadow-lg shadow-neon-green/50 glow-text"
          />
          <motion.button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
            aria-label="Search product"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>

        {isDropdownOpen && suggestions.length > 0 && (
          <motion.ul
            className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-2 z-20 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 text-sm sm:text-base text-gray-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                {suggestion}
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
};

export default BarcodeSearch;
