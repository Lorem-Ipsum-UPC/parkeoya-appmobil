import { parkingService } from '@/features/parking/services/parkingService';
import { ParkingResource } from '@/features/parking/types/parking.types';
import { profileService } from '@/features/profile/services/profileService';
import { reservationService } from '@/features/reservation/services/reservationService';
import { StorageService } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Temporary payment method type (until API is integrated)
interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  isDefault: boolean;
}

export default function ReserveScreen() {
  const router = useRouter();
  const { parkingId, spotId, spotLabel } = useLocalSearchParams<{ 
    parkingId: string; 
    spotId: string;
    spotLabel?: string;
  }>();
  
  const [parking, setParking] = useState<ParkingResource | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState<string>('');
  const [driverId, setDriverId] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, [parkingId]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      
      // Get user auth data
      const authData = await StorageService.getAuthData();
      if (!authData) {
        Alert.alert('Error', 'Por favor inicia sesión para continuar');
        router.replace('/(auth)/sign-in');
        return;
      }

      // Load parking details
      if (parkingId) {
        const parkingData = await parkingService.getParkingById(Number(parkingId));
        setParking(parkingData);
      }

      // Load driver profile to get vehicle plate and driverId
      try {
        const profile = await profileService.getDriverProfile();
        console.log('Driver profile loaded:', profile);
        
        // Set vehicle plate from profile (assuming first vehicle or default)
        // You may need to adjust this based on your actual profile structure
        if (profile.vehiclePlate) {
          setVehiclePlate(profile.vehiclePlate);
        }
        
        // Set driverId from profile
        if (profile.driverId) {
          setDriverId(profile.driverId);
        } else if (profile.userId) {
          // Fallback to userId if driverId is not available
          setDriverId(profile.userId);
        }
        
        console.log('Vehicle plate:', profile.vehiclePlate);
        console.log('Driver ID:', profile.driverId || profile.userId);
      } catch (profileError) {
        console.error('Error loading profile:', profileError);
        Alert.alert('Advertencia', 'No se pudo cargar el perfil. Por favor verifica tus datos de vehículo.');
      }

      // Mock payment methods for now (until payment API is integrated)
      const mockPayments: PaymentMethod[] = [
        { id: '1', type: 'Visa', last4: '4242', isDefault: true },
        { id: '2', type: 'Mastercard', last4: '5555', isDefault: false },
      ];
      setPaymentMethods(mockPayments);
      setSelectedPayment(mockPayments[0]);
      
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudo cargar la información');
    } finally {
      setIsLoadingData(false);
    }
  };

  const calculateDuration = (): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return (endMinutes - startMinutes) / 60; // Return hours as decimal
  };

  const calculateTotal = (): number => {
    if (!parking) return 0;
    const duration = calculateDuration();
    return parking.ratePerHour * duration;
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  const formatDateForAPI = (date: Date): string => {
    return reservationService.formatDate(date);
  };

  const handlePay = async () => {
    if (!vehiclePlate || vehiclePlate.trim() === '') {
      Alert.alert('Error', 'No se encontró la placa del vehículo. Por favor actualiza tu perfil.');
      return;
    }

    if (!driverId) {
      Alert.alert('Error', 'No se encontró el ID del conductor');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Por favor selecciona un método de pago');
      return;
    }

    if (!spotId) {
      Alert.alert('Error', 'No se seleccionó un espacio de estacionamiento');
      return;
    }

    setLoading(true);
    try {
      const reservationData = {
        driverId: driverId,
        vehiclePlate: vehiclePlate,
        parkingId: Number(parkingId),
        parkingSpotId: spotId,
        date: formatDateForAPI(date),
        startTime: startTime,
        endTime: endTime,
      };

      console.log('Creating reservation with data:', reservationData);

      const newReservation = await reservationService.createReservation(reservationData);
      
      console.log('Reservation created successfully:', newReservation);
      
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      setLoading(false);
      console.error('Error creating reservation:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear la reserva');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)');
  };

  if (isLoadingData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B5E6F" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      </View>
    );
  }

  if (!parking) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={20} color="white" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Select Parking</Text>
        </View>
        
        <View style={[styles.stepLine, styles.stepLineActive]} />
        
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Payment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Parking Info Card */}
        <View style={styles.parkingCard}>
          <Image source={{ uri: parking.imageUrl }} style={styles.parkingImage} />
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <Text style={styles.parkingAddress}>{parking.address}</Text>
            <View style={styles.spotInfo}>
              <Ionicons name="location" size={18} color="#1B5E6F" />
              <Text style={styles.spotText}>Spot: {spotLabel || spotId || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Ionicons name="calendar-outline" size={24} color="#2C3E50" />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Ionicons name="chevron-down" size={24} color="#95A5A6" />
          </TouchableOpacity>
        </View>

        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <TouchableOpacity style={styles.timeSelector}>
                <Ionicons name="time-outline" size={24} color="#2C3E50" />
                <Text style={styles.timeText}>{startTime}</Text>
                <Ionicons name="chevron-down" size={24} color="#95A5A6" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>End Time</Text>
              <TouchableOpacity style={styles.timeSelector}>
                <Ionicons name="time-outline" size={24} color="#2C3E50" />
                <Text style={styles.timeText}>{endTime}</Text>
                <Ionicons name="chevron-down" size={24} color="#95A5A6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vehicle Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <View style={styles.selector}>
            <View style={styles.selectedItem}>
              <Ionicons name="car" size={24} color="#1B5E6F" />
              <View style={styles.selectedItemInfo}>
                <Text style={styles.selectedItemText}>Vehículo Registrado</Text>
                <Text style={styles.selectedItemSubtext}>{vehiclePlate || 'No registrado'}</Text>
              </View>
            </View>
          </View>
          {!vehiclePlate && (
            <Text style={styles.warningText}>
              ⚠️ Actualiza tu perfil para agregar la placa de tu vehículo
            </Text>
          )}
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowPaymentSelect(true)}
          >
            {selectedPayment ? (
              <View style={styles.selectedItem}>
                <Ionicons 
                  name="card" 
                  size={24} 
                  color="#1B5E6F" 
                />
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemText}>
                    {selectedPayment.type} •••• {selectedPayment.last4}
                  </Text>
                  <Text style={styles.selectedItemSubtext}>
                    {selectedPayment.isDefault ? 'Default payment' : 'Payment method'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectorPlaceholder}>Select payment method</Text>
            )}
            <Ionicons name="chevron-down" size={24} color="#95A5A6" />
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Duration</Text>
            <Text style={styles.totalValue}>{calculateDuration().toFixed(1)} hours</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Hourly Rate</Text>
            <Text style={styles.totalValue}>S/. {parking.ratePerHour.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total</Text>
            <Text style={styles.totalValueBold}>S/. {calculateTotal().toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]} 
          onPress={handlePay}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : 'Pay'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Method Select Modal */}
      <Modal
        visible={showPaymentSelect}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentSelect(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentSelect(false)}>
                <Ionicons name="close" size={28} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {paymentMethods.map((payment) => (
                <TouchableOpacity
                  key={payment.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPayment(payment);
                    setShowPaymentSelect(false);
                  }}
                >
                  <Ionicons 
                    name="card" 
                    size={24} 
                    color="#1B5E6F" 
                  />
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemText}>
                      {payment.type} •••• {payment.last4}
                    </Text>
                    <Text style={styles.modalItemSubtext}>
                      {payment.isDefault ? 'Default' : 'Secondary'}
                    </Text>
                  </View>
                  {selectedPayment?.id === payment.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1B5E6F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#27AE60" />
            </View>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              Your reservation was successful
            </Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.successButtonText}>Return Home</Text>
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
  progressContainer: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BDC3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#27AE60',
  },
  stepActive: {
    backgroundColor: '#1B5E6F',
  },
  stepNumberActive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stepLabel: {
    fontSize: 14,
    color: '#95A5A6',
  },
  stepLabelActive: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  stepLine: {
    width: 80,
    height: 2,
    backgroundColor: '#BDC3C7',
    marginHorizontal: 16,
    marginBottom: 32,
  },
  stepLineActive: {
    backgroundColor: '#27AE60',
  },
  content: {
    flex: 1,
  },
  parkingCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  parkingImage: {
    width: '100%',
    height: 180,
  },
  parkingInfo: {
    padding: 16,
  },
  parkingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  parkingAddress: {
    fontSize: 14,
    color: '#95A5A6',
    marginBottom: 12,
  },
  spotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E6F',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  dateSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#95A5A6',
    marginBottom: 8,
  },
  timeSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  selector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#95A5A6',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedItemSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 2,
  },
  totalSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#95A5A6',
  },
  totalValue: {
    fontSize: 16,
    color: '#2C3E50',
  },
  totalLabelBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E6F',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  cancelButtonText: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: '600',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  modalItemSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 2,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 32,
  },
  successButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  successButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  warningText: {
    marginTop: 8,
    fontSize: 12,
    color: '#E67E22',
    fontStyle: 'italic',
  },
});
