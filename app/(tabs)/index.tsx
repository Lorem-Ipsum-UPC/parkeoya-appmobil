import { parkingService } from '@/features/parking/services/parkingService';
import { ParkingResource } from '@/features/parking/types/parking.types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentParkings, setRecentParkings] = useState<ParkingResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('Getting location...');

  useEffect(() => {
    loadParkings();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Get address from coordinates
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address && address.length > 0) {
          const addr = address[0];
          const formattedAddress = [
            addr.street,
            addr.district || addr.city,
          ]
            .filter(Boolean)
            .join(', ');
          
          setUserAddress(formattedAddress || 'Location found');
        }
      } else {
        setUserAddress('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setUserAddress('Unable to get location');
    }
  };

  const loadParkings = async () => {
    try {
      setIsLoading(true);
      const parkings = await parkingService.getAllParkings();
      // Show top 5 parkings
      setRecentParkings(parkings.slice(0, 5));
    } catch (error) {
      console.error('Error loading parkings:', error);
      Alert.alert('Error', 'Could not load parkings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat: number, lng: number): string => {
    if (!userLocation) return 'N/A';
    const distance = parkingService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      lat,
      lng
    );
    return `${distance.toFixed(1)} km`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={20} color="white" />
            <Text style={styles.locationText}>
              {userAddress}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Search Parking{'\n'}Space</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Insert location"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.locationIconButton}>
          <Ionicons name="locate" size={28} color="#1B5E6F" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1B5E6F" />
            <Text style={styles.loadingText}>Loading parkings...</Text>
          </View>
        ) : (
          <>
            {/* Recent Place */}
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Available Parkings</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.parkingCardsContainer}
              >
                {recentParkings.map((parking) => (
                  <TouchableOpacity
                    key={parking.id}
                    style={styles.parkingCard}
                    onPress={() => router.push(`/parking/${parking.id}`)}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {parking.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#2C3E50" />
                    </View>
                    <Text style={styles.cardAddress} numberOfLines={1}>
                      {parking.address}, {parking.city}
                    </Text>
                    <Text style={styles.cardDistance}>
                      {calculateDistance(parking.lat, parking.lng)} - S/. {parking.ratePerHour.toFixed(2)}/hour
                    </Text>
                    
                    {/* Availability Info */}
                    <View style={styles.availabilityRow}>
                      <View style={styles.availabilityBadge}>
                        <Ionicons name="car-sport" size={14} color="#27AE60" />
                        <Text style={styles.availabilityText}>
                          {parking.availableSpots}/{parking.totalSpots} spots
                        </Text>
                      </View>
                      {parking.rating > 0 && (
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={14} color="#FFC107" />
                          <Text style={styles.ratingText}>{parking.rating.toFixed(1)}</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Mini Map Placeholder */}
                    <View style={styles.mapPlaceholder}>
                      <View style={styles.mapGrid}>
                    {[...Array(12)].map((_, i) => (
                      <View key={i} style={styles.gridLine} />
                    ))}
                  </View>
                  <View style={styles.mapMarker}>
                    <Ionicons name="location" size={32} color="#1B5E6F" />
                  </View>
                  <Text style={styles.parkingLabel}>P</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/map')}
          >
            <Text style={styles.actionButtonText}>View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/reservation')}
          >
            <Text style={styles.actionButtonText}>My Reservations</Text>
          </TouchableOpacity>
        </View>
        </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1B5E6F',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    flex: 1,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  notificationButton: {
    padding: 4,
  },
  titleContainer: {
    backgroundColor: '#1B5E6F',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 42,
  },
  searchContainer: {
    backgroundColor: '#1B5E6F',
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  locationIconButton: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  recentSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  parkingCardsContainer: {
    paddingLeft: 20,
  },
  parkingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  cardAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 8,
  },
  availabilityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  availabilityText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#F57C00',
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1B5E6F',
    fontWeight: '600',
  },
  mapPlaceholder: {
    height: 140,
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#D0E8F0',
    width: '100%',
    height: 1,
  },
  mapMarker: {
    position: 'absolute',
    top: '30%',
    zIndex: 2,
  },
  parkingLabel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#1B5E6F',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    width: 44,
    height: 44,
    borderRadius: 22,
    textAlign: 'center',
    lineHeight: 44,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
