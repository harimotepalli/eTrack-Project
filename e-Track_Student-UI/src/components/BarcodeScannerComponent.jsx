import React, { useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

export default function BarcodeScannerComponent({ onBarcode }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stopScanner = useCallback(() => {
    if (
      codeReaderRef.current &&
      typeof codeReaderRef.current.reset === "function"
    ) {
      try {
        codeReaderRef.current.reset();
        console.log(" Scanner reset successfully");
      } catch (err) {
        console.error(" Failed to reset scanner:", err);
      }
    }
    setScanning(false);
    setErrorMessage("");
  }, []);

  const startScanner = useCallback(async () => {
    console.log("📷 Starting scanner...");
    setErrorMessage("");

    // Prevent multiple scanner instances
    if (scanning) {
      console.warn(" Scanner already running");
      return;
    }

    // Test camera permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log(" Camera access granted");
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error(" Camera access error:", err);
      setErrorMessage("Camera permission denied. Please allow camera access.");
      setScanning(false);
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setScanning(true);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      };

      await codeReader.decodeFromConstraints(
        constraints,
        videoRef.current,
        async (result, err) => {
          if (result) {
            const scannedCode = result.getText().trim();
            console.log(" Scanned Barcode:", scannedCode);
            setScanning(false);

            try {
              const response = await axios.get(
                `https://etrack-backend.onrender.com/floor/device/${scannedCode}`
              );
              const deviceData = response.data.data;

              if (!deviceData || !deviceData.device) {
                console.warn(
                  "⚠️ No device data returned for barcode:",
                  scannedCode
                );
                setErrorMessage("Device not found.");
                onBarcode({ barcode: scannedCode, error: "Device not found" });
                stopScanner();
                return;
              }

              console.log("✅ Device data fetched:", deviceData);

              const formattedDevice = {
                barcode: scannedCode,
                name: deviceData.device.deviceName || "Unknown Device",
                model: deviceData.device.deviceModel || "Unknown Model",
                status: deviceData.device.deviceStatus || "unknown",
                location: {
                  floor: { name: deviceData.floorName || "Unknown Floor" },
                  hall: { name: deviceData.wingName || "Unknown Hall" },
                  room: { name: deviceData.roomName || "Unknown Room" },
                },
              };

              console.log(" Sending formatted device:", formattedDevice);
              onBarcode(formattedDevice);
              stopScanner();
            } catch (apiError) {
              console.error(" Failed to fetch device data:", {
                message: apiError.message,
                status: apiError.response?.status,
                data: apiError.response?.data,
                code: apiError.code,
              });
              const errorMsg =
                apiError.response?.status === 404
                  ? "Device not found."
                  : apiError.response?.data?.message ||
                    "Failed to fetch device data. Please try again.";
              setErrorMessage(errorMsg);
              onBarcode({ barcode: scannedCode, error: errorMsg });
              stopScanner();
            }
          }

          if (err && err.name !== "NotFoundException") {
            console.error(" Scanning error:", err);
            setErrorMessage("Scanning error. Please try again.");
            stopScanner();
          }
        }
      );
    } catch (error) {
      console.error(" Camera access error:", error);
      setErrorMessage(
        "Error accessing camera. Ensure you're using a secure HTTPS connection or localhost."
      );
      stopScanner();
    }
  }, [scanning, onBarcode, stopScanner]);

  const simulateScan = useCallback(async () => {
    const testBarcode = "24M11MC105";
    console.log(" Simulating scan with barcode:", testBarcode);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `http://localhost:3000/floor/device/${testBarcode}`
      );
      const deviceData = response.data.data;

      if (!deviceData || !deviceData.device) {
        console.warn("No device data returned for test barcode:", testBarcode);
        setErrorMessage("Device not found.");
        onBarcode({ barcode: testBarcode, error: "Device not found" });
        return;
      }

      console.log(" Test device data fetched:", deviceData);

      const formattedDevice = {
        barcode: testBarcode,
        name: deviceData.device.deviceName || "Unknown Device",
        model: deviceData.device.deviceModel || "Unknown Model",
        status: deviceData.device.deviceStatus || "unknown",
        location: {
          floor: { name: deviceData.floorName || "Unknown Floor" },
          hall: { name: deviceData.wingName || "Unknown Hall" },
          room: { name: deviceData.roomName || "Unknown Room" },
        },
      };

      console.log(" Sending formatted device:", formattedDevice);
      onBarcode(formattedDevice);
    } catch (apiError) {
      console.error(" Failed to fetch test device data:", {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data,
        code: apiError.code,
      });
      const errorMsg =
        apiError.response?.status === 404
          ? "Device not found."
          : apiError.response?.data?.message ||
            "Failed to fetch device data. Please try again.";
      setErrorMessage(errorMsg);
      onBarcode({ barcode: testBarcode, error: errorMsg });
    }
  }, [onBarcode]);

  return (
    <div className="text-center">
      <button
        onClick={scanning ? stopScanner : startScanner}
        className="bg-neon-green text-black px-4 py-2 rounded mb-2 hover:bg-green-400"
      >
        {scanning ? "Stop Scan" : "Start Scan"}
      </button>
      {/* <button
        onClick={simulateScan}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2 ml-2"
      >
        Simulate Scan
      </button> */}

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div style={{ marginTop: 10 }}>
        <video
          ref={videoRef}
          style={{ width: "300px", height: "200px", border: "1px solid #ccc" }}
          muted
          playsInline
          autoPlay
        />
      </div>
    </div>
  );
}
