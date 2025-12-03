import { Config } from '@/constants/Config';
import {
    AuthData,
    AuthenticatedUserResource,
    DriverResource,
    SignInRequest,
    SignUpDriverRequest,
    UpdateDriverRequest,
} from '../types/auth.types';

const API_BASE_URL = `${Config.API_BASE_URL}/api/${Config.API_VERSION}`;

/**
 * Authentication Service for ParkeoYa API
 * Handles driver authentication and profile management
 */
class AuthService {
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
   * Sign in a user (driver)
   * POST /api/v1/authentication/sign-in
   */
  async signIn(credentials: SignInRequest): Promise<AuthenticatedUserResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/authentication/sign-in`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Invalid email or password');
      }

      const data: AuthenticatedUserResource = await response.json();
      
      // Verify that the user has the DRIVER role
      if (!data.roles.includes('ROLE_DRIVER')) {
        throw new Error('Only drivers can sign in to this application');
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up a new driver
   * POST /api/v1/authentication/sign-up/driver
   */
  async signUpDriver(driverData: SignUpDriverRequest): Promise<AuthenticatedUserResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/authentication/sign-up/driver`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(driverData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create driver account');
      }

      const userResource = await response.json();
      
      // After successful registration, sign in to get the token
      const authenticatedUser = await this.signIn({
        email: driverData.email,
        password: driverData.password,
      });

      return authenticatedUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Get driver profile by user ID
   * GET /api/v1/profiles/driver/{userId}
   */
  async getDriverProfile(userId: number, token: string): Promise<DriverResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/driver/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get driver profile error:', error);
      throw error;
    }
  }

  /**
   * Update driver profile
   * PATCH /api/v1/profiles/driver/{driverId}
   */
  async updateDriverProfile(
    driverId: number,
    updateData: UpdateDriverRequest,
    token: string
  ): Promise<DriverResource> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/driver/${driverId}`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update driver profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update driver profile error:', error);
      throw error;
    }
  }

  /**
   * Validate authentication token
   */
  isTokenValid(authData: AuthData): boolean {
    if (!authData || !authData.user || !authData.user.token) {
      return false;
    }

    // If expiresAt is set, check if token is expired
    if (authData.expiresAt) {
      return Date.now() < authData.expiresAt;
    }

    // If no expiration is set, consider it valid
    return true;
  }

  /**
   * Verify if user has driver role
   */
  isDriver(authData: AuthData): boolean {
    return authData?.user?.roles?.includes('ROLE_DRIVER') || false;
  }
}

export const authService = new AuthService();
export default authService;
