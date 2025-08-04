import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaServer,
  FaKeyboard,
  FaFan,
  FaExclamationTriangle,
} from "react-icons/fa";

const typeIcons = {
  server: <FaServer />,
  keyboard: <FaKeyboard />,
  fan: <FaFan />,
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Reports");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "https://etrack-backend.onrender.com/report/get"
        );
        setReports(response.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on search and dropdown
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.deviceBarcode?.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = report.deviceStatus?.toLowerCase().replace(/\s/g, "");

    const matchesStatus =
      statusFilter === "All Reports"
        ? true
        : statusFilter === "Maintenance"
        ? report.status?.toLowerCase() === "pending"
        : statusFilter === "Working"
        ? normalizedStatus === "working"
        : statusFilter === "Not-Working"
        ? normalizedStatus === "notworking"
        : true;

    return matchesSearch && matchesStatus;
  });

  // Count only from filtered reports for visible counts
  const totalReports = filteredReports.length;

  const workingCount = filteredReports.filter(
    (r) =>
      r.deviceStatus &&
      r.deviceStatus.toLowerCase().replace(/\s/g, "") === "working"
  ).length;

  const notWorkingCount = filteredReports.filter(
    (r) =>
      r.deviceStatus &&
      r.deviceStatus.toLowerCase().replace(/\s/g, "") === "notworking"
  ).length;

  return (
    <section className="w-full min-h-screen bg-charcoal text-white px-4 py-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">My Reports</h1>
        <p className="text-deep-gray mb-6">
          Track and manage your reported issues
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-blue p-4 rounded-xl shadow-neon-blue text-center">
            <h2 className="text-xl font-semibold">{totalReports}</h2>
            <p className="text-deep-gray">Total Reports</p>
          </div>
          <div className="bg-dark-blue p-4 rounded-xl shadow-neon-blue text-center">
            <h2 className="text-xl font-semibold text-yellow-400">
              {workingCount}
            </h2>
            <p className="text-deep-gray">Working</p>
          </div>
          <div className="bg-dark-blue p-4 rounded-xl shadow-neon-blue text-center">
            <h2 className="text-xl font-semibold text-cool-blue">
              {notWorkingCount}
            </h2>
            <p className="text-deep-gray">Not Working</p>
          </div>
        </div>

        {/* Search and Status Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-darker-blue text-white py-2 pl-10 pr-4 rounded-lg border border-glow-blue focus:outline-none"
            />
            <FaSearch className="absolute top-2.5 left-3 text-deep-gray" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto bg-darker-blue border border-glow-blue text-white px-4 py-2 rounded-lg"
          >
            <option value="All Reports">All Reports</option>
            <option value="Maintenance">Maintenance (Pending)</option>
            <option value="Working">Working</option>
            <option value="Not Working">Not Working</option>
          </select>
        </div>

        {/* Report Cards */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const device = report.deviceName?.toLowerCase();
              const type = device?.includes("keyboard")
                ? "keyboard"
                : device?.includes("server")
                ? "server"
                : device?.includes("fan")
                ? "fan"
                : null;

              return (
                <div
                  key={report._id}
                  className="bg-dark-blue p-6 rounded-xl shadow-md hover:shadow-neon-green transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-cool-blue text-2xl">
                      {typeIcons[type] || <FaExclamationTriangle />}
                      <span className="text-lg font-semibold text-white">
                        {report.deviceName || "Unknown"}
                      </span>
                    </div>
                    <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                      {report.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    <span className="text-deep-gray">Barcode:</span>{" "}
                    {report.deviceBarcode}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="text-deep-gray">Reported Status:</span>{" "}
                    <span className="text-red-400 font-semibold">
                      {report.deviceStatus}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-deep-gray mt-10">
            No matching reports found.
          </div>
        )}
      </div>
    </section>
  );
};

export default MyReports;