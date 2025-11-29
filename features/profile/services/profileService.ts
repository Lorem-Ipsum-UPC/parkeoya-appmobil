/**
 * Profile Service for ParkeoYa API
 * Handles driver profile operations: get and update
 */

import { Config } from '@/constants/Config';
import { StorageService } from '@/lib/storage';
import {
    DriverProfileResource,
    ProfileErrorResponse,
    UpdateDriverProfileRequest,
} from '../types/profile.types';

class ProfileService {
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
   * Get user ID from storage
   */
  private async getUserId(): Promise<number | null> {
    try {
      const authData = await StorageService.getAuthData();
      return authData?.user?.id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  /**
   * Get driver profile by user ID
   * GET /api/v1/profiles/driver/{userId}
   */
  async getDriverProfile(): Promise<DriverProfileResource> {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();

      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!userId) {
        throw new Error('No user ID found');
      }

      console.log('Fetching driver profile for user ID:', userId);

      const response = await fetch(`${this.baseUrl}/profiles/driver/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: ProfileErrorResponse = await response.json();
        throw new Error(errorData.message || 'Failed to fetch driver profile');
      }

      const data: DriverProfileResource = await response.json();
      console.log('Driver profile fetched successfully - FULL DATA:', JSON.stringify(data, null, 2));
      
      // Add email from auth data since API doesn't return it
      const authData = await StorageService.getAuthData();
      if (authData?.user?.email) {
        data.email = authData.user.email;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getDriverProfile:', error);
      throw error;
    }
  }

  /**
   * Update driver profile
   * PATCH /api/v1/profiles/driver/{driverId}
   * @param driverId - The driver ID (not user ID)
   * @param profileData - Updated profile data
   */
  async updateDriverProfile(
    driverId: number,
    profileData: UpdateDriverProfileRequest
  ): Promise<DriverProfileResource> {
    try {
      const token = await this.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Updating driver profile:', driverId, profileData);

      const response = await fetch(`${this.baseUrl}/profiles/driver/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData: ProfileErrorResponse = await response.json();
        throw new Error(errorData.message || 'Failed to update driver profile');
      }

      const data: DriverProfileResource = await response.json();
      console.log('Driver profile updated successfully:', data);
      
      return data;
    } catch (error) {
      console.error('Error in updateDriverProfile:', error);
      throw error;
    }
  }

  /**
   * Update own driver profile (uses stored driver ID)
   * Convenience method that fetches the profile first to get the driver ID
   */
  async updateOwnProfile(
    profileData: UpdateDriverProfileRequest
  ): Promise<DriverProfileResource> {
    try {
      // First get the current profile to obtain the driver ID
      const currentProfile = await this.getDriverProfile();
      console.log('Current profile for update - ALL FIELDS:', JSON.stringify(currentProfile, null, 2));
      
      // Try different possible fields for driverId
      const driverId = currentProfile.id || (currentProfile as any).driverId || currentProfile.userId;
      
      console.log('Extracted driverId:', driverId);
      console.log('Profile id field:', currentProfile.id);
      console.log('Profile userId field:', currentProfile.userId);
      
      if (!driverId) {
        throw new Error(`Driver ID not found in profile. Available fields: ${Object.keys(currentProfile).join(', ')}`);
      }
      
      // Then update using the driver ID
      return await this.updateDriverProfile(driverId, profileData);
    } catch (error) {
      console.error('Error in updateOwnProfile:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
