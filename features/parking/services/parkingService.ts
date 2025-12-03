import { Config } from '@/constants/Config';
import { StorageService } from '@/lib/storage';
import {
    CreateParkingRequest,
    ParkingResource,
    ParkingSpotResource,
    UpdateParkingRequest,
} from '../types/parking.types';

const API_BASE_URL = `${Config.API_BASE_URL}/api/${Config.API_VERSION}`;

/**
 * Parking Service for ParkeoYa API
 * Handles parking-related operations
 */
class ParkingService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const authData = await StorageService.getAuthData();
      return authData?.user?.token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all parkings
   * GET /api/v1/parkings
   */
  async getAllParkings(): Promise<ParkingResource[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/parkings`, {
        method: 'GET',
        headers: this.getHeaders(token || undefined),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parkings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all parkings error:', error);
      throw error;
    }
  }

  /**
   * Get parking by ID
   * GET /api/v1/parkings/{parkingId}
   */
  async getParkingById(parkingId: number): Promise<ParkingResource> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/parkings/${parkingId}`, {
        method: 'GET',
        headers: this.getHeaders(token || undefined),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parking');
      }

      return await response.json();
    } catch (error) {
      console.error('Get parking by ID error:', error);
      throw error;
    }
  }

  /**
   * Get all parkings by owner ID
   * GET /api/v1/parkings/owner/{ownerId}
   */
  async getParkingsByOwnerId(ownerId: number): Promise<ParkingResource[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/parkings/owner/${ownerId}`, {
        method: 'GET',
        headers: this.getHeaders(token || undefined),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parkings by owner');
      }

      return await response.json();
    } catch (error) {
      console.error('Get parkings by owner error:', error);
      throw error;
    }
  }

  /**
   * Get parking spots by parking ID
   * GET /api/v1/parkings/{parkingId}/spots
   */
  async getParkingSpots(parkingId: number): Promise<ParkingSpotResource[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/parkings/${parkingId}/spots`, {
        method: 'GET',
        headers: this.getHeaders(token || undefined),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parking spots');
      }

      return await response.json();
    } catch (error) {
      console.error('Get parking spots error:', error);
      throw error;
    }
  }

  /**
   * Create a new parking (owner only)
   * POST /api/v1/parkings
   */
  async createParking(parkingData: CreateParkingRequest): Promise<ParkingResource> {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/parkings`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(parkingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create parking');
      }

      return await response.json();
    } catch (error) {
      console.error('Create parking error:', error);
      throw error;
    }
  }

  /**
   * Update parking
   * PATCH /api/v1/parkings/{parkingId}
   */
  async updateParking(
    parkingId: number,
    updateData: UpdateParkingRequest
  ): Promise<ParkingResource> {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/parkings/${parkingId}`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update parking');
      }

      return await response.json();
    } catch (error) {
      console.error('Update parking error:', error);
      throw error;
    }
  }

  /**
   * Filter parkings by criteria (client-side)
   */
  filterParkings(
    parkings: ParkingResource[],
    filters: {
      query?: string;
      city?: string;
      minPrice?: number;
      maxPrice?: number;
      availableSpots?: number;
    }
  ): ParkingResource[] {
    let filtered = [...parkings];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query)
      );
    }

    if (filters.city) {
      filtered = filtered.filter((p) => p.city === filters.city);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.ratePerHour >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.ratePerHour <= filters.maxPrice!);
    }

    if (filters.availableSpots !== undefined) {
      filtered = filtered.filter((p) => p.availableSpots >= filters.availableSpots!);
    }

    return filtered;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Sort parkings by distance from user location
   */
  sortByDistance(
    parkings: ParkingResource[],
    userLat: number,
    userLon: number
  ): ParkingResource[] {
    return parkings.sort((a, b) => {
      const distA = this.calculateDistance(userLat, userLon, a.lat, a.lng);
      const distB = this.calculateDistance(userLat, userLon, b.lat, b.lng);
      return distA - distB;
    });
  }
}

export const parkingService = new ParkingService();
export default parkingService;
