

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { PropertyList } from '../components/property/PropertyList';
import { StatusChart } from '../components/charts/StatusChart';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart';
import { LocationChart } from '../components/charts/LocationChart';
import { useAuth } from '../context/AuthContext';
import WifiLoader from '../utils/Loader.jsx';

export const Floor = () => {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchFloors = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://etrack-backend.onrender.com/floor/getAllFloors', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        console.log('API Response:', data);
        if (response.ok) {
          const mappedFloors = data.map(floor => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(),
              name: wing.wingName,
              rooms: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(),
                name: room.roomName,
                properties: (room.devices || []).map(device => ({
                  id: device.deviceBarcode,
                  name: device.deviceName,
                  type: device.deviceName.toLowerCase().includes('monitor') ? 'monitor' :
                        device.deviceName.toLowerCase().includes('mouse') ? 'mouse' :
                        device.deviceName.toLowerCase().includes('fan') ? 'fan' :
                        device.deviceName.toLowerCase().includes('ac') ? 'ac' :
                        device.deviceName.toLowerCase().includes('keyboard') ? 'keyboard' :
                        device.deviceName.toLowerCase().includes('light') ? 'light' :
                        device.deviceName.toLowerCase().includes('wifi-router') ? 'wifi-router' : 'unknown',
                  brand: device.deviceName.split(' ')[0] || 'Unknown',
                  model: device.deviceModel || 'Unknown',
                  status: device.deviceStatus.toLowerCase() === 'working' ? 'working' : 'not_working',
                  price: device.devicePrice || 0,
                  floorName: floor.floorName || 'Unknown',
                  wingName: wing.wingName || 'Unknown',
                  roomName: room.roomName || 'Unknown',
                  deviceLocation: `${floor.floorName || 'Unknown'}/${wing.wingName || 'Unknown'}/${room.roomName || 'Unknown'}`,
                  purchaseDate: device.createdAt?.split('T')[0] || ''
                }))
              }))
            }))
          }));
          console.log('Mapped Floors:', mappedFloors);
          setFloors(mappedFloors);
        } else {
          console.error('Failed to fetch floors:', data.message);
        }
      } catch (error) {
        console.error('Error fetching floors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloors();
  }, [user, navigate]);

  console.log('Params:', { floorId });
  const floor = floors.find((f) => f.id === parseInt(floorId));
  console.log('Selected Floor:', floor);
  console.log('Hall IDs:', floor?.halls.map(h => h.id));

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="h-[520px] w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <WifiLoader className="scale-[2]" />
        </div>
      </div>
    );
  }

  if (!floor) {
    return (
      <div className="p-6">
        <PropertyList
          properties={[]}
          title="Floor Not Found"
          enableEdit={false}
          loading={false}
        />
      </div>
    );
  }

  const allProperties = floor.halls.flatMap(hall => 
    hall.rooms.flatMap(room => room.properties)
  );
  
  const totalHalls = floor.halls.length;
  const totalRooms = floor.halls.reduce((acc, hall) => acc + hall.rooms.length, 0);
  const totalProperties = allProperties.length;
  const workingProperties = allProperties.filter(p => p.status === 'working').length;
  const notWorkingProperties = allProperties.filter(p => p.status === 'not_working').length;

  const handleHallClick = (hallId) => {
    navigate(`/floors/${floorId}/halls/${hallId}`);
  };

  return (
    <div className="space-y-6 p-6">
      <nav className="flex items-center text-sm font-medium">
        <Link 
          to="/" 
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 dark:text-white">{floor.name}</span>
      </nav>

      <div>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-xl">
          Overview and management of all halls in this floor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Halls</p>
          <p className="text-xl font-semibold mt-1">{totalHalls}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
          <p className="text-xl font-semibold mt-1">{totalRooms}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
          <p className="text-xl font-semibold mt-1">{totalProperties}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
          <p className="text-xl font-semibold mt-1 text-blue-600 dark:text-blue-400">
            {workingProperties} ({totalProperties > 0 ? Math.round((workingProperties / totalProperties) * 100) : 0}%)
          </p>
        </div>
      </div>

      {totalProperties > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <StatusChart properties={allProperties} />
          </div>
          <div className="lg:col-span-8">
            <PropertyTypeChart properties={allProperties} />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Halls
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floor.halls.map((hall) => {
            const hallProps = hall.rooms.flatMap(room => room.properties);
            const working = hallProps.filter(p => p.status === 'working').length;
            const percentage = hallProps.length > 0 
              ? Math.round((working / hallProps.length) * 100) 
              : 0;
            
            return (
              <Card 
                key={hall.id}
                className="overflow-hidden hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleHallClick(hall.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 mr-3">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium">{hall.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Rooms:</span>
                        <span className="font-medium">{hall.rooms.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Properties:</span>
                        <span className="font-medium">{hallProps.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Working:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {working} ({percentage}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {floor.halls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Hall Comparison
          </h2>
          <LocationChart data={floor.halls} locationType="hall" />
        </div>
      )}

      <PropertyList 
        properties={allProperties} 
        title={`All Properties in ${floor.name}`} 
        enableEdit={false}
        loading={loading}
      />
    </div>
  );
};