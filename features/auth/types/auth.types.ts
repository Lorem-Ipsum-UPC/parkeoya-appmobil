/**
 * Authentication Types for ParkeoYa API
 */

// Sign In Request
export interface SignInRequest {
  email: string;
  password: string;
}

// Sign Up Driver Request
export interface SignUpDriverRequest {
  email: string;
  password: string;
  fullName: string;
  city: string;
  country: string;
  phone: string;
  dni: string;
}

// Authenticated User Response
export interface AuthenticatedUserResource {
  id: number;
  email: string;
  token: string;
  roles: string[];
}

// User Resource
export interface UserResource {
  id: number;
  email: string;
  roles: string[];
}

// Driver Resource
export interface DriverResource {
  userId: number;
  driverId: number;
  fullName: string;
  city: string;
  country: string;
  phone: string;
  dni: string;
}

// Update Driver Request
export interface UpdateDriverRequest {
  fullName?: string;
  city?: string;
  country?: string;
  phone?: string;
  dni?: string;
}

// Auth Error Response
export interface AuthErrorResponse {
  message: string;
  status: number;
  error?: string;
}

// Local Storage Auth Data
export interface AuthData {
  user: AuthenticatedUserResource;
  driver?: DriverResource;
  expiresAt?: number;
}
