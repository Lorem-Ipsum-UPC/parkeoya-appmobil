import { StorageService } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthData, SignInRequest, SignUpDriverRequest } from '../types/auth.types';

/**
 * Custom hook for managing authentication state
 */
export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const storedAuthData = await StorageService.getAuthData();
      
      if (storedAuthData && authService.isTokenValid(storedAuthData)) {
        setAuthData(storedAuthData);
        setIsAuthenticated(true);
      } else {
        // Clear invalid auth data
        await StorageService.removeAuthData();
        setAuthData(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthData(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: SignInRequest): Promise<void> => {
    const authenticatedUser = await authService.signIn(credentials);
    
    const driverProfile = await authService.getDriverProfile(
      authenticatedUser.id,
      authenticatedUser.token
    );

    const newAuthData: AuthData = {
      user: authenticatedUser,
      driver: driverProfile,
    };

    await StorageService.setAuthData(newAuthData);
    setAuthData(newAuthData);
    setIsAuthenticated(true);
  };

  const signUp = async (driverData: SignUpDriverRequest): Promise<void> => {
    const authenticatedUser = await authService.signUpDriver(driverData);
    
    const driverProfile = await authService.getDriverProfile(
      authenticatedUser.id,
      authenticatedUser.token
    );

    const newAuthData: AuthData = {
      user: authenticatedUser,
      driver: driverProfile,
    };

    await StorageService.setAuthData(newAuthData);
    setAuthData(newAuthData);
    setIsAuthenticated(true);
  };

  const signOut = async (): Promise<void> => {
    await StorageService.clearAll();
    setAuthData(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async (): Promise<void> => {
    if (!authData?.user) {
      throw new Error('No authenticated user');
    }

    const driverProfile = await authService.getDriverProfile(
      authData.user.id,
      authData.user.token
    );

    const updatedAuthData: AuthData = {
      ...authData,
      driver: driverProfile,
    };

    await StorageService.setAuthData(updatedAuthData);
    setAuthData(updatedAuthData);
  };

  return {
    authData,
    isLoading,
    isAuthenticated,
    user: authData?.user || null,
    driver: authData?.driver || null,
    token: authData?.user?.token || null,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    checkAuthStatus,
  };
};

export default useAuth;
