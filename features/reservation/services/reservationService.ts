/**
 * Reservation Service for ParkeoYa API
 * Handles reservation operations
 */

import { Config } from '@/constants/Config';
import { StorageService } from '@/lib/storage';
import {
    CreateReservationRequest,
    ReservationErrorResponse,
    ReservationResource,
    UpdateReservationRequest
} from '../types/reservation.types';

class ReservationService {
  private baseUrl = `${Config.API_BASE_URL}/api/${Config.API_VERSION}`;

  /**
   * Get authentication token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const authData = await StorageService.getAuthData();
      return authData?.user?.token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create a new reservation
   * POST /api/v1/reservations
   */
  async createReservation(request: CreateReservationRequest): Promise<ReservationResource> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Creating reservation:', request);

      const response = await fetch(`${this.baseUrl}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorMessage = `HTTP ${response.status}: Failed to create reservation`;
        try {
          if (errorText) {
            const errorData: ReservationErrorResponse = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from server');
      }

      const data: ReservationResource = JSON.parse(responseText);
      console.log('Reservation created successfully:', data.id);
      
      return data;
    } catch (error) {
      console.error('Error in createReservation:', error);
      throw error;
    }
  }

  /**
   * Get reservations for a specific driver
   * GET /api/v1/reservations/driver/{driverId}
   */
  async getDriverReservations(driverId: number): Promise<ReservationResource[]> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/reservations/driver/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch driver reservations: ${response.status}`);
      }

      const data: ReservationResource[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getDriverReservations:', error);
      throw error;
    }
  }

  /**
   * Get reservation by ID
   * GET /api/v1/reservations/{id}
   */
  async getReservationById(id: number): Promise<ReservationResource> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/reservations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reservation: ${response.status}`);
      }

      const data: ReservationResource = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getReservationById:', error);
      throw error;
    }
  }

  /**
   * Update reservation
   * PUT /api/v1/reservations/{id}
   */
  async updateReservation(id: number, request: UpdateReservationRequest): Promise<ReservationResource> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to update reservation: ${response.status}`);
      }

      const data: ReservationResource = await response.json();
      return data;
    } catch (error) {
      console.error('Error in updateReservation:', error);
      throw error;
    }
  }

  /**
   * Cancel reservation
   * DELETE /api/v1/reservations/{id}
   */
  async cancelReservation(id: number): Promise<void> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel reservation: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in cancelReservation:', error);
      throw error;
    }
  }

  /**
   * Helper: Format date to YYYY-MM-DD
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Helper: Format time to HH:mm
   */
  formatTime(hours: number, minutes: number): string {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

export const reservationService = new ReservationService();
