import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Layers,
  DoorOpen,
  Activity,
  LampDesk,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { StatusChart } from "../components/charts/StatusChart";
import { PropertyTypeChart } from "../components/charts/PropertyTypeChart.jsx";
import { PropertyType } from "../types";
import { useAuth } from "../context/AuthContext";
import DashboardSkeleton from "../utils/DashboardSkeleton.jsx";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const fetchFloors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://etrack-backend.onrender.com/floor/getAllFloors",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const mappedFloors = data.map((floor) => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(),
              name: wing.wingName,
              rooms: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(),
                name: room.roomName,
                properties: (room.devices || []).flatMap((device) =>
                  Array(device.count || 1)
                    .fill()
                    .map(() => ({
                      id: `${device.deviceName}-${Math.random()
                        .toString(36)
                        .substring(2, 11)}`,
                      type: device.deviceName.toLowerCase().includes("monitor")
                        ? "monitor"
                        : device.deviceName.toLowerCase().includes("mouse")
                        ? "mouse"
                        : device.deviceName.toLowerCase().includes("fan")
                        ? "fan"
                        : device.deviceName.toLowerCase().includes("ac")
                        ? "ac"
                        : device.deviceName.toLowerCase().includes("keyboard")
                        ? "keyboard"
                        : device.deviceName.toLowerCase().includes("light")
                        ? "light"
                        : device.deviceName
                            .toLowerCase()
                            .includes("wifi-router")
                        ? "wifi-router"
                        : "unknown",
                      brand: device.deviceName.split(" ")[0] || "Unknown",
                      model: device.deviceModel || "Unknown",
                      status:
                        device.deviceStatus === "working"
                          ? "working"
                          : "not_working",
                    }))
                ),
              })),
            })),
          }));
          setFloors(mappedFloors);
        } else {
          console.error("Failed to fetch floors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloors();
  }, [user, navigate]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalFloors = floors.length;
  const totalHalls = floors.reduce((acc, floor) => acc + floor.halls.length, 0);
  const totalRooms = floors.reduce(
    (acc, floor) =>
      acc +
      floor.halls.reduce((hallAcc, hall) => hallAcc + hall.rooms.length, 0),
    0
  );

  const allProperties = floors.flatMap((floor) =>
    floor.halls.flatMap((hall) => hall.rooms.flatMap((room) => room.properties))
  );

  const totalProperties = allProperties.length;
  const workingProperties = allProperties.filter(
    (p) => p.status === "working"
  ).length;
  const notWorkingProperties = allProperties.filter(
    (p) => p.status === "not_working"
  ).length;

  const propertyTypeCounts = Object.values(PropertyType).reduce((acc, type) => {
    acc[type] = allProperties.filter((p) => p.type === type).length;
    return acc;
  }, {});

  const formatType = (text) =>
    text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of building properties and equipment
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="w-full">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
              <LampDesk className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Properties
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalProperties}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalFloors}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-white dark:bg-gray-800 text-success-600 dark:text-success-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Working
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workingProperties}
                <span className="text-sm ml-1 font-normal text-gray-500">
                  (
                  {totalProperties > 0
                    ? Math.round((workingProperties / totalProperties) * 100)
                    : 0}
                  %)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full bg-gradient-to-r from-error-50 to-error-100 dark:from-error-900 dark:to-error-800">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-white dark:bg-gray-800 text-error-600 dark:text-error-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Not Working
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {notWorkingProperties}
                <span className="text-sm ml-1 font-normal text-gray-500">
                  (
                  {totalProperties > 0
                    ? Math.round((notWorkingProperties / totalProperties) * 100)
                    : 0}
                  %)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <StatusChart properties={allProperties} />
        </div>
        <div className="lg:col-span-7">
          {/* <PropertyTypeChart properties={allProperties} /> */}
          <PropertyTypeChart properties={allProperties} minCount={10} />

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["monitor", "mouse", "keyboard", "light", "fan", "wifi-router", "ac"]
          .filter((type) => propertyTypeCounts[type] < 10)
          .map((type) => {
            const count = propertyTypeCounts[type];
            const working = allProperties.filter(
              (p) => p.type === type && p.status === "working"
            ).length;
            const percentage =
              count > 0 ? Math.round((working / count) * 100) : 0;

            return (
              <Card key={type} className="w-full">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatType(type)}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {working}
                  </p>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {working} working ({percentage}%)
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};