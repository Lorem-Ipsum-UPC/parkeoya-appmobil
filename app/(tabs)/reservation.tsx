import { parkingService } from '@/features/parking/services/parkingService';
import { ParkingResource } from '@/features/parking/types/parking.types';
import { profileService } from '@/features/profile/services/profileService';
import { reservationService } from '@/features/reservation/services/reservationService';
import { ReservationResource } from '@/features/reservation/types/reservation.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
  const [reservations, setReservations] = useState<ReservationResource[]>([]);
  const [parkings, setParkings] = useState<{ [key: number]: ParkingResource }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      
      // Get driver profile to get driverId
      const profile = await profileService.getDriverProfile();
      console.log('Driver profile:', profile);
      
      const driverId = profile.driverId || profile.userId;
      console.log('Using driverId:', driverId);

      if (!driverId) {
        Alert.alert('Error', 'No se encontró el ID del conductor');
        return;
      }

      // Get all reservations from the API
      console.log('Fetching reservations...');
      const allReservationsData = await reservationService.getAllDriverReservations(driverId);
      console.log('Reservations fetched:', allReservationsData);
      
      setReservations(allReservationsData || []);

      // Load parking information for each reservation
      const parkingData: { [key: number]: ParkingResource } = {};
      const reservationList = allReservationsData || [];
      
      for (const reservation of reservationList) {
        if (!parkingData[reservation.parkingId]) {
          try {
            const parking = await parkingService.getParkingById(reservation.parkingId);
            parkingData[reservation.parkingId] = parking;
          } catch (error) {
            console.error(`Error loading parking ${reservation.parkingId}:`, error);
          }
        }
      }
      setParkings(parkingData);
    } catch (error) {
      console.error('Error loading reservations:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las reservas';
      Alert.alert('Error', errorMessage);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = (reservation: ReservationResource) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      await reservationService.cancelReservation(selectedReservation.id);
      setShowCancelModal(false);
      setShowSuccessModal(true);
      loadReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      Alert.alert('Error', 'Failed to cancel reservation');
    }
  };

  const handleViewDetails = (reservationId: number) => {
    router.push(`/reservation/${reservationId}`);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'ACTIVE':
        return 'Activa';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return '#F39C12';
      case 'CONFIRMED':
        return '#3498DB';
      case 'ACTIVE':
        return '#27AE60';
      case 'COMPLETED':
        return '#95A5A6';
      case 'CANCELLED':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  // Filter reservations by active tab
  const filteredReservations = activeTab === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === activeTab);

  const renderReservationCard = (reservation: ReservationResource) => {
    const parking = parkings[reservation.parkingId];
    if (!parking) return null;

    const statusColor = getStatusColor(reservation.status);
    const statusLabel = getStatusLabel(reservation.status);

    return (
      <View key={reservation.id} style={styles.reservationCard}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => handleViewDetails(reservation.id)}
        >
          <View style={styles.cardTitleContainer}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.parkingAddress}>{parking.address}</Text>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>{reservation.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>
              {reservation.startTime} - {reservation.endTime}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="car-outline" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>{reservation.vehiclePlate}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(reservation.id)}
          >
            <Text style={styles.viewDetailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>

          {reservation.status === 'PENDING' || reservation.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(reservation)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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
        <Text style={styles.headerTitle}>Mis Reservas</Text>
        <View style={styles.backButton} />
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'PENDING' && styles.activeTab]}
            onPress={() => setActiveTab('PENDING')}
          >
            <Text style={[styles.tabText, activeTab === 'PENDING' && styles.activeTabText]}>
              Pendientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'CONFIRMED' && styles.activeTab]}
            onPress={() => setActiveTab('CONFIRMED')}
          >
            <Text style={[styles.tabText, activeTab === 'CONFIRMED' && styles.activeTabText]}>
              Confirmadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ACTIVE' && styles.activeTab]}
            onPress={() => setActiveTab('ACTIVE')}
          >
            <Text style={[styles.tabText, activeTab === 'ACTIVE' && styles.activeTabText]}>
              Activas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'COMPLETED' && styles.activeTab]}
            onPress={() => setActiveTab('COMPLETED')}
          >
            <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.activeTabText]}>
              Completadas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B5E6F" />
          <Text style={styles.loadingText}>Cargando reservas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => renderReservationCard(reservation))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#BDC3C7" />
                <Text style={styles.emptyStateText}>
                  No hay reservas {activeTab !== 'all' ? getStatusLabel(activeTab).toLowerCase() : ''}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

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
  tabContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#1B5E6F',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  parkingAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  reservationDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
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
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 12,
    textAlign: 'center',
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
