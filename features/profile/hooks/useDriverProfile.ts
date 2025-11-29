/**
 * Custom hook for driver profile operations
 */

import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { DriverProfileResource, UpdateDriverProfileRequest } from '../types/profile.types';

export const useDriverProfile = () => {
  const [profile, setProfile] = useState<DriverProfileResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getDriverProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading profile';
      setError(errorMessage);
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateDriverProfileRequest) => {
    try {
      setError(null);
      const updatedProfile = await profileService.updateOwnProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const refreshProfile = () => {
    loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
  };
};
