/**
 * Parking Spot Types for ParkeoYa API
 */

export type SpotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

export interface ParkingSpotResource {
  id: string;
  parkingId: number;
  rowIndex: number;
  columnIndex: number;
  label: string;
  status: SpotStatus;
}

export interface SpotErrorResponse {
  message: string;
  status: number;
  error?: string;
}
