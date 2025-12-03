/**
 * Parking Types for ParkeoYa API
 */

// Parking Resource from API
export interface ParkingResource {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
  ratePerHour: number;
  dailyRate: number;
  monthlyRate: number;
  rating: number;
  ratingCount: number;
  totalSpots: number;
  regularSpots: number;
  disabledSpots: number;
  electricSpots: number;
  availableSpots: number;
  totalRows: number;
  totalColumns: number;
  imageUrl: string;
  operatingDays: string;
  open24Hours: boolean;
  openingTime: string | null;
  closingTime: string | null;
}

// Parking Spot Resource
export interface ParkingSpotResource {
  id: string; // UUID
  parkingId: number;
  rowIndex: number;
  columnIndex: number;
  label: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

// Create Parking Request
export interface CreateParkingRequest {
  ownerId: number;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
  ratePerHour: number;
  dailyRate: number;
  monthlyRate: number;
  totalSpots: number;
  regularSpots: number;
  disabledSpots: number;
  electricSpots: number;
  availableSpots: number;
  totalRows: number;
  totalColumns: number;
  imageUrl: string;
  operatingDays: string;
  open24Hours: boolean;
  openingTime?: string;
  closingTime?: string;
}

// Update Parking Request
export interface UpdateParkingRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  ratePerHour?: number;
  dailyRate?: number;
  monthlyRate?: number;
  open24hours?: boolean;
  openingTime?: string;
  closingTime?: string;
  operatingDays?: string;
  imageUrl?: string;
  totalSpots?: number;
  regularSpots?: number;
  disabledSpots?: number;
  electricSpots?: number;
}

// Parking filters
export interface ParkingFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  availableSpots?: number;
  hasElectricSpots?: boolean;
  hasDisabledSpots?: boolean;
  open24Hours?: boolean;
}
