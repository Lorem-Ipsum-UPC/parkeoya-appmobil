import { useEffect, useState } from 'react';
import { parkingService } from '../services/parkingService';
import { ParkingResource } from '../types/parking.types';

/**
 * Custom hook for managing parking data
 */
export function useParkings() {
  const [parkings, setParkings] = useState<ParkingResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadParkings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await parkingService.getAllParkings();
      setParkings(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load parkings');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshParkings = () => loadParkings();

  useEffect(() => {
    loadParkings();
  }, []);

  return {
    parkings,
    isLoading,
    error,
    refreshParkings,
  };
}

/**
 * Custom hook for managing a single parking
 */
export function useParking(parkingId: number | null) {
  const [parking, setParking] = useState<ParkingResource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadParking = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await parkingService.getParkingById(id);
      setParking(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load parking');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (parkingId) {
      loadParking(parkingId);
    }
  }, [parkingId]);

  return {
    parking,
    isLoading,
    error,
    refreshParking: () => parkingId ? loadParking(parkingId) : Promise.resolve(null),
  };
}
