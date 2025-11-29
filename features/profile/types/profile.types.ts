/**
 * Profile Types for ParkeoYa API
 */

// Driver Profile Resource (GET response)
export interface DriverProfileResource {
  id: number;
  userId: number;
  driverId?: number; // Some APIs return driverId separately
  fullName: string;
  city: string;
  country: string;
  phone: string;
  dni: string;
  email?: string;
  vehiclePlate?: string; // Vehicle plate for reservations
}

// Update Driver Profile Request (PATCH)
export interface UpdateDriverProfileRequest {
  fullName?: string;
  city?: string;
  country?: string;
  phone?: string;
  dni?: string;
}

// Profile Error Response
export interface ProfileErrorResponse {
  message: string;
  status: number;
  error?: string;
}
