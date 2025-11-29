/**
 * Profile Types for ParkeoYa API
 */

// Driver Profile Resource (GET response)
export interface DriverProfileResource {
  id: number;
  userId: number;
  fullName: string;
  city: string;
  country: string;
  phone: string;
  dni: string;
  email?: string;
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
