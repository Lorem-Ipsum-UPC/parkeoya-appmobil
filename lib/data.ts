// Importar datos directamente desde db.json
import dbData from '../db.json';

// Tipos de datos
export interface Parking {
  id: string;
  name: string;
  address: string;
  distance: string;
  pricePerHour: number;
  currency: string;
  rating: number;
  totalSpots: number;
  availableSpots: number;
  latitude: number;
  longitude: number;
  image: string;
  features: string[];
  floors: Floor[];
}

export interface Floor {
  floor: number;
  spots: ParkingSpot[];
}

export interface ParkingSpot {
  id: string;
  status: 'available' | 'occupied' | 'reserved';
  type: 'regular' | 'disabled' | 'ev';
}

export interface Reservation {
  id: string;
  userId: string;
  parkingId: string;
  spotId: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalCost: number;
  vehicleId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  avatar: string;
  address?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  plate: string;
  color: string;
  colorHex?: string;
  year: number;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  parkingId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

// Base de datos local (copia de db.json que se mantiene en memoria)
let database = {
  parkings: [...dbData.parkings] as Parking[],
  reservations: [...dbData.reservations] as Reservation[],
  users: [...dbData.users] as User[],
  vehicles: [...dbData.vehicles] as Vehicle[],
  paymentMethods: [...dbData.paymentMethods] as PaymentMethod[],
  reviews: [...dbData.reviews] as Review[],
};

// Servicio de datos local
class LocalDataService {
  // Authentication
  async login(email: string, password: string): Promise<User> {
    const user = database.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    return Promise.resolve(userWithoutPassword as User);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = database.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return Promise.resolve(null);
    }
    const { password: _, ...userWithoutPassword } = user;
    return Promise.resolve(userWithoutPassword as User);
  }

  // Parkings
  async getParkings(): Promise<Parking[]> {
    return Promise.resolve([...database.parkings]);
  }

  async getParkingById(id: string): Promise<Parking> {
    const parking = database.parkings.find((p) => p.id === id);
    if (!parking) {
      throw new Error(`Parking with id ${id} not found`);
    }
    return Promise.resolve({ ...parking });
  }

  async searchParkings(query: string): Promise<Parking[]> {
    const lowerQuery = query.toLowerCase();
    const results = database.parkings.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.address.toLowerCase().includes(lowerQuery)
    );
    return Promise.resolve([...results]);
  }

  // Reservations
  async getReservations(userId: string): Promise<Reservation[]> {
    const results = database.reservations.filter((r) => r.userId === userId);
    return Promise.resolve([...results]);
  }

  async createReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
    const newReservation = {
      ...reservation,
      id: `res_${Date.now()}`,
    };
    database.reservations.push(newReservation);
    return Promise.resolve({ ...newReservation });
  }

  async cancelReservation(id: string): Promise<void> {
    const reservation = database.reservations.find((r) => r.id === id);
    if (reservation) {
      reservation.status = 'cancelled';
    }
    return Promise.resolve();
  }

  // Users
  async getUser(id: string): Promise<User> {
    const user = database.users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return Promise.resolve({ ...user });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const userIndex = database.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    database.users[userIndex] = { ...database.users[userIndex], ...data };
    return Promise.resolve({ ...database.users[userIndex] });
  }

  // Vehicles
  async getVehicles(userId: string): Promise<Vehicle[]> {
    const results = database.vehicles.filter((v) => v.userId === userId);
    return Promise.resolve([...results]);
  }

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const newVehicle = {
      ...vehicle,
      id: `car_${Date.now()}`,
    };
    database.vehicles.push(newVehicle);
    return Promise.resolve({ ...newVehicle });
  }

  async deleteVehicle(id: string): Promise<void> {
    database.vehicles = database.vehicles.filter((v) => v.id !== id);
    return Promise.resolve();
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicleIndex = database.vehicles.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) {
      throw new Error(`Vehicle with id ${id} not found`);
    }
    database.vehicles[vehicleIndex] = { ...database.vehicles[vehicleIndex], ...data };
    return Promise.resolve({ ...database.vehicles[vehicleIndex] });
  }

  // Payment Methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const results = database.paymentMethods.filter((pm) => pm.userId === userId);
    return Promise.resolve([...results]);
  }

  // Reviews
  async getReviews(parkingId: string): Promise<Review[]> {
    const results = database.reviews.filter((r) => r.parkingId === parkingId);
    return Promise.resolve([...results]);
  }

  async addReview(review: Omit<Review, 'id'>): Promise<Review> {
    const newReview = {
      ...review,
      id: `rev_${Date.now()}`,
    };
    database.reviews.push(newReview);
    return Promise.resolve({ ...newReview });
  }

  // Resetear base de datos a valores iniciales
  resetDatabase(): void {
    database = {
      parkings: [...dbData.parkings] as Parking[],
      reservations: [...dbData.reservations] as Reservation[],
      users: [...dbData.users] as User[],
      vehicles: [...dbData.vehicles] as Vehicle[],
      paymentMethods: [...dbData.paymentMethods] as PaymentMethod[],
      reviews: [...dbData.reviews] as Review[],
    };
  }
}

// Exportar instancia singleton
export const api = new LocalDataService();

// Exportar datos mock para compatibilidad
export const mockParkings: Parking[] = dbData.parkings as Parking[];
