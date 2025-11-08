import { Config } from '@/constants/Config';

// API Base URL desde configuración
const API_BASE_URL = Config.API_BASE_URL;

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
  rating: number;
  comment: string;
  date: string;
}

// Funciones de la API
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper para hacer requests
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Parkings
  async getParkings(): Promise<Parking[]> {
    return this.request<Parking[]>('/parkings');
  }

  async getParkingById(id: string): Promise<Parking> {
    return this.request<Parking>(`/parkings/${id}`);
  }

  async searchParkings(query: string): Promise<Parking[]> {
    return this.request<Parking[]>(`/parkings?q=${query}`);
  }

  // Reservations
  async getReservations(userId: string): Promise<Reservation[]> {
    return this.request<Reservation[]>(`/reservations?userId=${userId}`);
  }

  async createReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
    return this.request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    });
  }

  async cancelReservation(id: string): Promise<void> {
    await this.request(`/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  }

  // Users
  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Vehicles
  async getVehicles(userId: string): Promise<Vehicle[]> {
    return this.request<Vehicle[]>(`/vehicles?userId=${userId}`);
  }

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    return this.request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment Methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>(`/paymentMethods?userId=${userId}`);
  }

  // Reviews
  async getReviews(parkingId: string): Promise<Review[]> {
    return this.request<Review[]>(`/reviews?parkingId=${parkingId}`);
  }

  async addReview(review: Omit<Review, 'id'>): Promise<Review> {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }
}

// Exportar instancia singleton
export const api = new ApiService();

// Mock data para desarrollo sin servidor
export const mockParkings: Parking[] = [
  {
    id: '1',
    name: 'Parking Tralalero Primavera',
    address: 'Av. Primavera 1750, Lima 15023',
    distance: '3.2 KM',
    pricePerHour: 5.0,
    currency: 'S/.',
    rating: 4.5,
    totalSpots: 50,
    availableSpots: 12,
    latitude: -12.1108,
    longitude: -77.0045,
    image: 'https://via.placeholder.com/300x200',
    features: ['covered', 'security', '24/7'],
    floors: [
      {
        floor: 1,
        spots: [
          { id: 'A1', status: 'available', type: 'regular' },
          { id: 'A2', status: 'occupied', type: 'regular' },
          { id: 'A3', status: 'available', type: 'regular' },
          { id: 'A4', status: 'reserved', type: 'disabled' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Parking Tralalero San Isidro',
    address: 'Av. Javier Prado 2850, Lima 15036',
    distance: '3.2 KM',
    pricePerHour: 5.0,
    currency: 'S/.',
    rating: 4.7,
    totalSpots: 80,
    availableSpots: 25,
    latitude: -12.0957,
    longitude: -77.0365,
    image: 'https://via.placeholder.com/300x200',
    features: ['covered', 'security', '24/7', 'valet'],
    floors: [
      {
        floor: 1,
        spots: [
          { id: 'B1', status: 'available', type: 'regular' },
          { id: 'B2', status: 'available', type: 'regular' },
          { id: 'B3', status: 'occupied', type: 'regular' },
        ],
      },
    ],
  },
];
