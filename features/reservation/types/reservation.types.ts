/**
 * Reservation Types for ParkeoYa API
 */

// Create Reservation Request
export interface CreateReservationRequest {
  driverId: number;
  vehiclePlate: string;
  parkingId: number;
  parkingSpotId: string; // UUID
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

// Reservation Resource Response
export interface ReservationResource {
  id: number;
  driverId: number;
  vehiclePlate: string;
  parkingId: number;
  parkingSpotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Reservation Status
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// Update Reservation Request
export interface UpdateReservationRequest {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: ReservationStatus;
}

// Reservation Error Response
export interface ReservationErrorResponse {
  message: string;
  status: number;
  error?: string;
}

// Reservation List Response
export interface ReservationListResponse {
  content: ReservationResource[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}
