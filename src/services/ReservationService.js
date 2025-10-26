import AsyncStorage from '@react-native-async-storage/async-storage';

const RESERVATIONS_KEY = '@parkeoya_reservations';

class ReservationService {
  async getAllReservations() {
    try {
      const reservationsJson = await AsyncStorage.getItem(RESERVATIONS_KEY);
      return reservationsJson ? JSON.parse(reservationsJson) : [];
    } catch (error) {
      console.error('Error loading reservations:', error);
      return [];
    }
  }

  async createReservation(reservation) {
    try {
      const reservations = await this.getAllReservations();
      const newReservation = {
        ...reservation,
        id: Date.now().toString(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      reservations.push(newReservation);
      await AsyncStorage.setItem(
        RESERVATIONS_KEY,
        JSON.stringify(reservations),
      );
      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async cancelReservation(reservationId) {
    try {
      const reservations = await this.getAllReservations();
      const updated = reservations.map(r =>
        r.id === reservationId ? {...r, status: 'cancelled'} : r,
      );
      await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  async getReservationById(reservationId) {
    try {
      const reservations = await this.getAllReservations();
      return reservations.find(r => r.id === reservationId);
    } catch (error) {
      console.error('Error getting reservation:', error);
      return null;
    }
  }
}

export default new ReservationService();
