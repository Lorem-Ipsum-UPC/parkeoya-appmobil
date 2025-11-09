import { api, Parking, Reservation } from '@/lib/data';
import { StorageService } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ReservationScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [parkings, setParkings] = useState<{ [key: string]: Parking }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Session Expired', 'Please login again');
        router.replace('/(auth)/sign-in');
        return;
      }

      const userReservations = await api.getReservations(currentUser.id);
      setReservations(userReservations);

      // Cargar información de parkings
      const parkingData: { [key: string]: Parking } = {};
      for (const reservation of userReservations) {
        if (!parkingData[reservation.parkingId]) {
          const parking = await api.getParkingById(reservation.parkingId);
          parkingData[reservation.parkingId] = parking;
        }
      }
      setParkings(parkingData);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      await api.cancelReservation(selectedReservation.id);
      setShowCancelModal(false);
      setShowSuccessModal(true);
      loadReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      Alert.alert('Error', 'Failed to cancel reservation');
    }
  };

  const handleViewDetails = (reservationId: string) => {
    router.push(`/reservation/${reservationId}`);
  };

  const currentReservations = reservations.filter((r) => r.status === 'active');
  const pastReservations = reservations.filter((r) => r.status !== 'active');

  const renderReservationCard = (reservation: Reservation, isCurrent: boolean) => {
    const parking = parkings[reservation.parkingId];
    if (!parking) return null;

    return (
      <View key={reservation.id} style={styles.reservationCard}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => handleViewDetails(reservation.id)}
        >
          <View style={styles.cardTitleContainer}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </View>
        </TouchableOpacity>

        <Text style={styles.parkingAddress}>{parking.address}</Text>
        <Text style={styles.parkingInfo}>
          {parking.distance} - {parking.currency} {parking.pricePerHour.toFixed(2)}/hour
        </Text>

        {/* Mini Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapMarker}>
            <Ionicons name="location" size={32} color="#1B5E6F" />
          </View>
          <Text style={styles.parkingLabel}>P</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(reservation.id)}
          >
            <Text style={styles.viewDetailsButtonText}>View details</Text>
          </TouchableOpacity>

          {isCurrent && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(reservation)}
            >
              <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservations</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Reservations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Reservations</Text>
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) =>
              renderReservationCard(reservation, true)
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No current reservations</Text>
            </View>
          )}
        </View>

        {/* Past Reservations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Reservations</Text>
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) =>
              renderReservationCard(reservation, false)
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No past reservations</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={() => setShowCancelModal(false)}
            >
              <Ionicons name="close" size={32} color="#1B5E6F" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              ¿Are you sure you want to Cancel your reservation?
            </Text>
            <Text style={styles.modalMessage}>
              If you cancel now We'll give you the refund in the next 24 hours
            </Text>

            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={confirmCancelReservation}
            >
              <Text style={styles.confirmCancelButtonText}>Cancel Reservation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle-outline" size={80} color="#1B5E6F" />
            </View>

            <Text style={styles.successTitle}>Your reservation was cancelled</Text>

            <TouchableOpacity
              style={styles.returnHomeButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.returnHomeButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parkingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  parkingAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  parkingInfo: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 12,
  },
  mapPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapMarker: {
    position: 'absolute',
    top: '35%',
    left: '45%',
  },
  parkingLabel: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1B5E6F',
    opacity: 0.3,
  },
  buttonContainer: {
    gap: 12,
  },
  viewDetailsButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95A5A6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1B5E6F',
  },
  closeIconButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E6F',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#1B5E6F',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmCancelButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
  },
  confirmCancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    marginHorizontal: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1B5E6F',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E6F',
    textAlign: 'center',
    marginBottom: 32,
  },
  returnHomeButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  returnHomeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
