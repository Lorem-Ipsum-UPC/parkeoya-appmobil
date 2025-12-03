/**
 * Parking Spot Service for ParkeoYa API
 * Handles parking spots operations
 */

import { Config } from '@/constants/Config';
import { StorageService } from '@/lib/storage';
import { ParkingSpotResource, SpotErrorResponse } from '../types/spot.types';

class SpotService {
  private baseUrl = `${Config.API_BASE_URL}/api/${Config.API_VERSION}`;

  /**
   * Get authentication token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const authData = await StorageService.getAuthData();
      console.log('Auth data exists:', !!authData);
      console.log('Auth data user exists:', !!authData?.user);
      console.log('Auth data user token exists:', !!authData?.user?.token);
      
      if (authData?.user?.token) {
        console.log('Token (first 20 chars):', authData.user.token.substring(0, 20) + '...');
      }
      
      return authData?.user?.token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Get all spots for a specific parking
   * GET /api/v1/parking/{parkingId}/spots
   */
  async getParkingSpots(parkingId: number): Promise<ParkingSpotResource[]> {
    try {
      const token = await this.getAuthToken();

      console.log('Token available for request:', !!token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching spots for parking:', parkingId);
      console.log('Request URL:', `${this.baseUrl}/parkings/${parkingId}/spots`);

      const response = await fetch(`${this.baseUrl}/parkings/${parkingId}/spots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!response.ok) {
        // Try to parse error, but handle empty response
        let errorMessage = `HTTP ${response.status}: Failed to fetch parking spots`;
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          if (errorText) {
            const errorData: SpotErrorResponse = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      // Get response text first to check if empty
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);
      console.log('Response text:', responseText.substring(0, 200)); // First 200 chars

      if (!responseText || responseText.trim().length === 0) {
        console.log('Empty response received, returning empty array');
        return [];
      }

      const data: ParkingSpotResource[] = JSON.parse(responseText);
      console.log(`Found ${data.length} spots for parking ${parkingId}`);
      
      return data;
    } catch (error) {
      console.error('Error in getParkingSpots:', error);
      throw error;
    }
  }

  /**
   * Get spot by ID
   */
  getSpotById(spots: ParkingSpotResource[], spotId: string): ParkingSpotResource | undefined {
    return spots.find(spot => spot.id === spotId);
  }

  /**
   * Get available spots
   */
  getAvailableSpots(spots: ParkingSpotResource[]): ParkingSpotResource[] {
    return spots.filter(spot => spot.status === 'AVAILABLE');
  }

  /**
   * Get spots by row
   */
  getSpotsByRow(spots: ParkingSpotResource[], rowIndex: number): ParkingSpotResource[] {
    return spots.filter(spot => spot.rowIndex === rowIndex);
  }

  /**
   * Get maximum row and column indices
   */
  getGridDimensions(spots: ParkingSpotResource[]): { maxRow: number; maxColumn: number } {
    if (spots.length === 0) {
      return { maxRow: 0, maxColumn: 0 };
    }

    const maxRow = Math.max(...spots.map(spot => spot.rowIndex));
    const maxColumn = Math.max(...spots.map(spot => spot.columnIndex));

    return { maxRow, maxColumn };
  }

  /**
   * Organize spots into a grid structure
   */
  organizeIntoGrid(spots: ParkingSpotResource[]): (ParkingSpotResource | null)[][] {
    const { maxRow, maxColumn } = this.getGridDimensions(spots);
    
    // Create empty grid
    const grid: (ParkingSpotResource | null)[][] = [];
    for (let row = 0; row <= maxRow; row++) {
      grid[row] = new Array(maxColumn + 1).fill(null);
    }

    // Fill grid with spots
    spots.forEach(spot => {
      grid[spot.rowIndex][spot.columnIndex] = spot;
    });

    return grid;
  }

  /**
   * Get statistics about spots
   */
  getSpotStatistics(spots: ParkingSpotResource[]): {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
  } {
    return {
      total: spots.length,
      available: spots.filter(s => s.status === 'AVAILABLE').length,
      occupied: spots.filter(s => s.status === 'OCCUPIED').length,
      reserved: spots.filter(s => s.status === 'RESERVED').length,
    };
  }
}

export const spotService = new SpotService();
