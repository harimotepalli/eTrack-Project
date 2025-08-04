export async function fetchProductData() {
  const response = await fetch(
    "https://etrack-backend.onrender.com/floor/getAllFloors"
  );
  const floors = await response.json();

  // Flatten the nested structure to match your previous productData shape
  console.log(floors);
  const productData = [];
  floors.forEach((floor) => {
    floor.wings.forEach((wing) => {
      wing.rooms.forEach((room) => {
        room.devices.forEach((device) => {
          productData.push({
            barcode: device.deviceBarcode,
            price: device.devicePrice,
            name: device.deviceName,
            model: device.deviceModel,
            status: device.deviceStatus,
            location: {
              floor: { id: floor._id, name: floor.floorName },
              hall: { id: wing._id, name: wing.wingName },
              room: { id: room._id, name: room.roomName },
            },
          });
        });
      });
    });
  });

  return productData;
}
