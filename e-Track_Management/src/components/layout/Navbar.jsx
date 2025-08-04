import React, { useState, useEffect, useRef } from "react";
import {
  Laptop2,
  LogOut,
  Menu,
  User,
  X,
  Mail,
  Briefcase,
  Bell,
  Check,
  Trash2,
  Edit,
} from "lucide-react";
import axios from "axios";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";
import { cn } from "../../utils/cn";
import { toast } from "react-toastify";

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, updateUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    adminName: user?.name || "",
    adminEmail: user?.email || "",
    userRole: user?.role || "",
  });
  const menuRef = useRef(null);
  const alertsModalRef = useRef(null);

  // Update editForm when user changes
  useEffect(() => {
    setEditForm({
      adminName: user?.name || "",
      adminEmail: user?.email || "",
      userRole: user?.role || "",
    });
  }, [user]);

  // Clear localStorage on logout
  const handleLogout = () => {
    localStorage.removeItem("confirmedAlerts");
    localStorage.removeItem("confirmedAlertIds");
    logout();
    setShowUserMenu(false);
    setShowProfile(false);
  };

  const fetchAlerts = async () => {
    if (!user) {
      console.log("No user, skipping fetchAlerts");
      return;
    }
    // Implement fetchAlerts if needed
  };

  useEffect(() => {
    if (!user) return;

    socket.emit("register", "admin");

    socket.on("reportAlert", (data) => {
      const newAlert = {
        _id: data._id,
        message: ` ${data.deviceBarcode} `,
        status: data.deviceStatus || "unknown",
        time: new Date().toISOString(),
        device: `${data.deviceName} `,
        type:
          data.deviceStatus === "not-working" ||
          data.deviceStatus === "critical"
            ? "critical"
            : "warning",
        read: false,
      };
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => {
      socket.off("reportAlert");
    };
  }, [user]);

  const handleConfirmAlert = async (alert) => {
    if (!user) {
      toast.error("Please log in to confirm alerts");
      return;
    }
    try {
      await axios.put(
        `https://etrack-backend.onrender.com/report/confirm/${alert._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setAlerts((prev) => prev.filter((a) => a._id !== alert._id));
      toast.success("Alert confirmed and moved to Reports");
    } catch (error) {
      console.error("Error confirming alert:", error);
      toast.error(error.response?.data?.error || "Failed to confirm alert");
    }
  };

  const handleRemoveAlert = async (id) => {
    if (!user) {
      toast.error("Please log in to delete alerts");
      return;
    }
    try {
      console.log("Deleting alert:", id);
      await axios.delete(
        `https://etrack-backend.onrender.com/report/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
      setConfirmDeleteId(null);
      toast.success("Alert deleted successfully");
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error(error.response?.data?.message || "Failed to delete alert");
    }
  };

  const handleEditAdmin = async () => {
    if (!user?.adminId) {
      toast.error("User ID not found");
      return;
    }
    if (!editForm.adminName || !editForm.adminEmail || !editForm.userRole) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.put(
        `https://etrack-backend.onrender.com/admin/update/${user.adminId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const updatedUser = {
        ...user,
        name: response.data.updatedAdmin.adminName,
        email: response.data.updatedAdmin.adminEmail,
        role: response.data.updatedAdmin.userRole,
      };
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!user?.adminId) {
      toast.error("User ID not found");
      return;
    }
    try {
      await axios.delete(
        `https://etrack-backend.onrender.com/admin/delete/${user.adminId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Account deleted successfully");
      handleLogout();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const unreadCount = alerts.length;

  const toggleAlerts = () => {
    setShowAlerts((prev) => {
      console.log(`Toggling alerts modal, new state: ${!prev}`);
      return !prev;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        alertsModalRef.current &&
        !alertsModalRef.current.contains(event.target)
      ) {
        setShowAlerts(false);
        console.log("Closing alerts modal due to click outside");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultProfileDetails = [
    {
      id: "email",
      label: "Email",
      value: user?.email || "No email",
      icon: <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      id: "username",
      label: "Username",
      value: user?.name || "No username",
      icon: <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      id: "role",
      label: "Role",
      value: user?.role || "No role",
      icon: <Briefcase className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    },
  ];

  return (
    <nav
      className={cn(
        "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      )}
    >
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => {
              console.log("Toggling sidebar, isSidebarOpen:", isSidebarOpen);
              onToggleSidebar();
            }}
            className={cn(
              "p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-2 hover:border-teal-500 dark:hover:border-teal-400 mr-2 sm:mr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:hidden"
            )}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>

          <div className="flex items-center">
            <Laptop2 className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 dark:text-teal-400" />
            <span
              className={cn(
                "ml-1 sm:ml-2 text-lg sm:text-xl font-semibold text-gray-800 dark:text-white",
                "hidden sm:inline-block"
              )}
            >
              Etrack
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />

          <button
            onClick={toggleAlerts}
            className="relative p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="View alerts"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center space-x-1 sm:space-x-2 focus:outline-none"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-teal-600 dark:bg-teal-400 flex items-center justify-center text-white text-sm sm:text-base">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span className="hidden md:inline-block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name || "Unknown User"}
                </span>
              </button>

              {showUserMenu && (
                <div
                  className={cn(
                    "absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] animate-fade-in"
                  )}
                >
                  <div className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                    <p className="font-medium">{user.name || "Unknown User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email || "No email"}
                    </p>
                  </div>

                  <button
                    className={cn(
                      "flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                    )}
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfile(true);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>

                  <button
                    className={cn(
                      "flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<User className="h-3 w-3 sm:h-4 sm:w-4" />}
              className="text-xs sm:text-sm px-2 sm:px-4 bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {showProfile && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={() => {
            setShowProfile(false);
            setIsEditing(false);
          }}
        >
          <div
            className={cn(
              "relative w-full max-w-md rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowProfile(false);
                setIsEditing(false);
              }}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name || "Unknown User"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user.role || "Unknown Role"}
              </p>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.adminName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, adminName: e.target.value })
                    }
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.adminEmail}
                    onChange={(e) =>
                      setEditForm({ ...editForm, adminEmail: e.target.value })
                    }
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.userRole}
                    onChange={(e) =>
                      setEditForm({ ...editForm, userRole: e.target.value })
                    }
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="floorincharge">Floor Incharge</option>
                    <option value="electrician">Electrician</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEditAdmin}
                    className="text-white bg-teal-600 hover:bg-teal-700"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {defaultProfileDetails.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600",
                      "hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    )}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 text-white bg-teal-600 hover:bg-teal-700"
                    leftIcon={<Edit className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteAdmin}
                    className="flex-1 text-white bg-red-600 hover:bg-red-700"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAlerts && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]"
          onClick={() => setShowAlerts(false)}
        >
          <div
            ref={alertsModalRef}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-600 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
              <h2 className="text-xl flex items-center text-gray-900 dark:text-white">
                <Bell className="mr-2 h-5 w-5 text-teal-600 dark:text-teal-400" /> Alerts
              </h2>
              <button
                onClick={() => {
                  setShowAlerts(false);
                  console.log("Closing alerts modal via close button");
                }}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="max-h-80 overflow-y-auto space-y-4 pr-2"
              style={{ scrollbarWidth: "none" }}
            >
              <style>{`.max-h-80::-webkit-scrollbar { display: none; }`}</style>
              {alertsLoading ? (
                <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-semibold">
                  Loading alerts...
                </p>
              ) : alertsError ? (
                <p className="text-center text-red-600 dark:text-red-400 text-sm font-semibold">
                  {alertsError}
                </p>
              ) : alerts.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300 text-sm font-semibold">
                  No alerts available.
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert._id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded flex justify-between"
                  >
                    <div className="w-[90%]">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {new Date(alert.time).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        <span>Status: </span>
                        <span
                          className={
                            alert.status === "resolved"
                              ? "text-teal-600 dark:text-teal-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {alert.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Device: {alert.device || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleConfirmAlert(alert)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        aria-label="Confirm alert"
                      >
                        <Check className="text-teal-600 dark:text-teal-400 h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(alert._id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="text-red-600 dark:text-red-400 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end border-t border-gray-200 dark:border-gray-600 pt-4">
              <Button
                size="sm"
                onClick={() => {
                  setShowAlerts(false);
                  console.log("Closing alerts modal via footer button");
                }}
                className="text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-[210] bg-black/80 flex items-center justify-center"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full border border-gray-200 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this alert?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirmDeleteId(null)}
                className="text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveAlert(confirmDeleteId)}
                className="text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};