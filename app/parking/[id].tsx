import { parkingService } from '@/features/parking/services/parkingService';
import { ParkingResource } from '@/features/parking/types/parking.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ParkingDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parking, setParking] = useState<ParkingResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParkingDetails();
  }, [id]);

  const loadParkingDetails = async () => {
    try {
      if (id) {
        console.log('Loading parking with ID:', id);
        setIsLoading(true);
        const data = await parkingService.getParkingById(Number(id));
        console.log('Parking data received:', data);
        setParking(data);
      } else {
        console.log('No ID provided');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading parking details:', error);
      setIsLoading(false);
      Alert.alert(
        'Error',
        'No se pudo cargar la información del estacionamiento. Por favor intenta de nuevo.',
        [
          { text: 'Volver', onPress: () => router.back() },
          { text: 'Reintentar', onPress: () => loadParkingDetails() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Ionicons key={i} name="star" size={28} color="#FFC107" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Ionicons key={i} name="star-half" size={28} color="#FFC107" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={28} color="#FFC107" />);
      }
    }
    return stars;
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B5E6F" />
          <Text style={styles.loadingText}>Loading parking details...</Text>
        </View>
      </View>
    );
  }

  if (!parking) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No se encontró el estacionamiento</Text>
          <TouchableOpacity 
            style={styles.reserveButton}
            onPress={() => router.back()}
          >
            <Text style={styles.reserveButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color="#2C3E50" />
        </TouchableOpacity>

        {/* Parking Image */}
        {parking.imageUrl ? (
          <Image
            source={{ uri: parking.imageUrl }}
            style={styles.parkingImage}
            resizeMode="cover"
            onError={() => console.log('Error loading parking image')}
            defaultSource={require('@/assets/images/icon.png')}
          />
        ) : (
          <View style={[styles.parkingImage, styles.mapPlaceholder]}>
            <View style={styles.mapMarker}>
              <Ionicons name="location" size={40} color="#1B5E6F" />
            </View>
            <Text style={styles.parkingLabel}>P</Text>
          </View>
        )}

        {/* Parking Name */}
        <Text style={styles.parkingName}>{parking.name}</Text>

        {/* Address */}
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#1B5E6F" />
          <Text style={styles.infoText}>{parking.address}, {parking.city}</Text>
        </View>

        {/* Price */}
        <View style={styles.infoRow}>
          <Ionicons name="cash" size={20} color="#27AE60" />
          <Text style={styles.infoText}>
            S/. {parking.ratePerHour.toFixed(2)}/hour
          </Text>
        </View>

        {/* Daily and Monthly Rates */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#3498DB" />
          <Text style={styles.infoText}>
            Daily: S/. {parking.dailyRate.toFixed(2)} | Monthly: S/. {parking.monthlyRate.toFixed(2)}
          </Text>
        </View>

        {/* Availability */}
        <View style={styles.infoRow}>
          <Ionicons name="car" size={20} color="#1B5E6F" />
          <Text style={styles.infoText}>
            {parking.availableSpots} available / {parking.totalSpots} total
          </Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {renderStars(parking.rating)}
            <Text style={styles.ratingNumber}>
              {parking.rating > 0 ? parking.rating.toFixed(1) : 'No ratings'}
            </Text>
          </View>
          {parking.ratingCount > 0 && (
            <Text style={styles.distanceText}>
              Based on {parking.ratingCount} review{parking.ratingCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Operating Hours */}
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#E67E22" />
          <Text style={styles.infoText}>
            {parking.open24Hours 
              ? '24/7 Open' 
              : `${parking.openingTime || 'N/A'} - ${parking.closingTime || 'N/A'}`}
          </Text>
        </View>

        {/* Description */}
        {parking.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{parking.description}</Text>
          </View>
        )}

        {/* Spot Types */}
        <View style={styles.spotTypesSection}>
          <Text style={styles.spotTypesLabel}>Available Spot Types</Text>
          <View style={styles.spotTypeRow}>
            <View style={styles.spotTypeItem}>
              <Ionicons name="car-outline" size={24} color="#1B5E6F" />
              <Text style={styles.spotTypeText}>Regular: {parking.regularSpots}</Text>
            </View>
            <View style={styles.spotTypeItem}>
              <Ionicons name="accessibility" size={24} color="#3498DB" />
              <Text style={styles.spotTypeText}>Disabled: {parking.disabledSpots}</Text>
            </View>
            <View style={styles.spotTypeItem}>
              <Ionicons name="flash" size={24} color="#27AE60" />
              <Text style={styles.spotTypeText}>Electric: {parking.electricSpots}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.reviewsButton}
          onPress={() => router.push(`/parking/reviews?id=${parking.id}`)}
        >
          <Text style={styles.reviewsButtonText}>View Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => router.push(`/parking/select-parking?id=${parking.id}`)}
        >
          <Text style={styles.reserveButtonText}>Reserve now</Text>
        </TouchableOpacity>

        {/* Spacer para el navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parkingImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  imagePlaceholder: {
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1B5E6F',
    opacity: 0.5,
    marginTop: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1B5E6F',
    opacity: 0.5,
    marginTop: 12,
  },
  parkingName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  ratingSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  reviewsButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  reserveButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1B5E6F',
    fontWeight: '600',
  },
  descriptionSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  spotTypesSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  spotTypesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  spotTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  spotTypeItem: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  spotTypeText: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
  },
});
