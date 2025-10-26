import ParkingService from '../src/services/ParkingService';

describe('ParkingService', () => {
  it('should return all parkings', async () => {
    const parkings = await ParkingService.getAllParkings();
    expect(parkings).toBeDefined();
    expect(Array.isArray(parkings)).toBe(true);
    expect(parkings.length).toBeGreaterThan(0);
  });

  it('should find parking by id', async () => {
    const parking = await ParkingService.getParkingById('1');
    expect(parking).toBeDefined();
    expect(parking.id).toBe('1');
    expect(parking.name).toBeDefined();
  });

  it('should search parkings by query', async () => {
    const results = await ParkingService.searchParkings('Central');
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Central');
  });

  it('should find nearby parkings within radius', async () => {
    const nearby = await ParkingService.getNearbyParkings(41.3851, 2.1734, 5);
    expect(nearby).toBeDefined();
    expect(Array.isArray(nearby)).toBe(true);
    nearby.forEach(parking => {
      expect(parking.distance).toBeDefined();
      expect(parseFloat(parking.distance)).toBeLessThanOrEqual(5);
    });
  });

  it('should not duplicate distance calculations', async () => {
    const nearby = await ParkingService.getNearbyParkings(41.3851, 2.1734, 5);
    nearby.forEach(parking => {
      expect(parking.distanceValue).toBeUndefined();
    });
  });
});
