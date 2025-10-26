import ReservationService from '../src/services/ReservationService';

describe('ReservationService', () => {
  beforeEach(async () => {
    // Clear all reservations before each test
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.clear();
  });

  it('should create a new reservation', async () => {
    const reservation = {
      parkingId: '1',
      parkingName: 'Test Parking',
      parkingAddress: '123 Test St',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      duration: 1,
      totalPrice: 2.5,
    };

    const created = await ReservationService.createReservation(reservation);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.status).toBe('confirmed');
    expect(created.parkingName).toBe('Test Parking');
  });

  it('should generate unique IDs for reservations', async () => {
    const reservation = {
      parkingId: '1',
      parkingName: 'Test Parking',
      parkingAddress: '123 Test St',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      duration: 1,
      totalPrice: 2.5,
    };

    const created1 = await ReservationService.createReservation(reservation);
    const created2 = await ReservationService.createReservation(reservation);
    
    expect(created1.id).toBeDefined();
    expect(created2.id).toBeDefined();
    expect(created1.id).not.toBe(created2.id);
  });

  it('should retrieve all reservations', async () => {
    const reservation = {
      parkingId: '1',
      parkingName: 'Test Parking',
      parkingAddress: '123 Test St',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      duration: 1,
      totalPrice: 2.5,
    };

    await ReservationService.createReservation(reservation);
    const reservations = await ReservationService.getAllReservations();
    
    expect(reservations).toBeDefined();
    expect(Array.isArray(reservations)).toBe(true);
    expect(reservations.length).toBe(1);
  });

  it('should cancel a reservation', async () => {
    const reservation = {
      parkingId: '1',
      parkingName: 'Test Parking',
      parkingAddress: '123 Test St',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      duration: 1,
      totalPrice: 2.5,
    };

    const created = await ReservationService.createReservation(reservation);
    await ReservationService.cancelReservation(created.id);
    
    const cancelled = await ReservationService.getReservationById(created.id);
    expect(cancelled.status).toBe('cancelled');
  });
});
