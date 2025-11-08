import { api, Parking } from '@/lib/data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ParkingDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    loadParkingDetails();
  }, [id]);

  const loadParkingDetails = async () => {
    try {
      if (id) {
        const data = await api.getParkingById(id);
        setParking(data);
      }
    } catch (error) {
      console.error('Error loading parking details:', error);
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
    setShowModal(false);
    router.back();
  };

  if (!parking) {
    return null;
  }

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={32} color="#2C3E50" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Parking Name */}
            <Text style={styles.parkingName}>{parking.name}</Text>

            {/* Parking Image */}
            <Image
              source={{ uri: parking.image }}
              style={styles.parkingImage}
              resizeMode="cover"
            />

            {/* Address */}
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#1B5E6F" />
              <Text style={styles.infoText}>{parking.address}</Text>
            </View>

            {/* Price */}
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color="#27AE60" />
              <Text style={styles.infoText}>
                {parking.currency} {parking.pricePerHour.toFixed(2)}/hour
              </Text>
            </View>

            {/* Availability */}
            <View style={styles.infoRow}>
              <Ionicons name="car" size={20} color="#1B5E6F" />
              <Text style={styles.infoText}>
                {parking.availableSpots} available/ {parking.totalSpots} total
              </Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Raiting</Text>
              <View style={styles.starsRow}>
                {renderStars(parking.rating)}
                <Text style={styles.ratingNumber}>{parking.rating}</Text>
              </View>
              <Text style={styles.distanceText}>{parking.distance}</Text>
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
              onPress={() => router.push(`/parking/reserve?id=${parking.id}`)}
            >
              <Text style={styles.reserveButtonText}>Reserve now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    paddingRight: 40,
  },
  parkingImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
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
});
