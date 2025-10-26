// Mock parking data service
const MOCK_PARKINGS = [
  {
    id: '1',
    name: 'Central Parking Plaza',
    address: '123 Main Street, Barcelona',
    latitude: 41.3851,
    longitude: 2.1734,
    availableSpots: 15,
    totalSpots: 50,
    pricePerHour: 2.5,
    rating: 4.5,
    features: ['Covered', 'Security 24/7', 'EV Charging'],
  },
  {
    id: '2',
    name: 'Marina Park & Ride',
    address: '456 Beach Avenue, Barcelona',
    latitude: 41.3801,
    longitude: 2.1901,
    availableSpots: 8,
    totalSpots: 30,
    pricePerHour: 3.0,
    rating: 4.2,
    features: ['Outdoor', 'Bike Storage', 'Near Metro'],
  },
  {
    id: '3',
    name: 'Gothic Quarter Garage',
    address: '789 Gothic Street, Barcelona',
    latitude: 41.3825,
    longitude: 2.1769,
    availableSpots: 22,
    totalSpots: 80,
    pricePerHour: 2.0,
    rating: 4.7,
    features: ['Covered', 'Motorcycle Parking', 'Disabled Access'],
  },
  {
    id: '4',
    name: 'Eixample Parking Center',
    address: '321 Diagonal Avenue, Barcelona',
    latitude: 41.3900,
    longitude: 2.1650,
    availableSpots: 5,
    totalSpots: 40,
    pricePerHour: 2.8,
    rating: 4.0,
    features: ['Covered', 'Car Wash', 'Security'],
  },
  {
    id: '5',
    name: 'Sagrada Familia Parking',
    address: '567 Mallorca Street, Barcelona',
    latitude: 41.4036,
    longitude: 2.1744,
    availableSpots: 12,
    totalSpots: 60,
    pricePerHour: 3.5,
    rating: 4.6,
    features: ['Covered', 'Tourist Area', 'EV Charging'],
  },
];

class ParkingService {
  getAllParkings() {
    return Promise.resolve(MOCK_PARKINGS);
  }

  getParkingById(id) {
    const parking = MOCK_PARKINGS.find(p => p.id === id);
    return Promise.resolve(parking);
  }

  searchParkings(query) {
    const lowercaseQuery = query.toLowerCase();
    const filtered = MOCK_PARKINGS.filter(
      parking =>
        parking.name.toLowerCase().includes(lowercaseQuery) ||
        parking.address.toLowerCase().includes(lowercaseQuery),
    );
    return Promise.resolve(filtered);
  }

  getNearbyParkings(latitude, longitude, radiusKm = 5) {
    // Simple distance calculation (not accurate for large distances)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearby = MOCK_PARKINGS.filter(parking => {
      const distance = calculateDistance(
        latitude,
        longitude,
        parking.latitude,
        parking.longitude,
      );
      return distance <= radiusKm;
    }).map(parking => ({
      ...parking,
      distance: calculateDistance(
        latitude,
        longitude,
        parking.latitude,
        parking.longitude,
      ).toFixed(2),
    }));

    return Promise.resolve(nearby);
  }
}

export default new ParkingService();
