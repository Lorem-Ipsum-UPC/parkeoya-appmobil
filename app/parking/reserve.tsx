import { api, Parking, PaymentMethod, Vehicle } from '@/lib/data';
import { StorageService } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

export default function ReserveScreen() {
  const router = useRouter();
  const { parkingId, spotId } = useLocalSearchParams<{ parkingId: string; spotId: string }>();
  
  const [parking, setParking] = useState<Parking | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [parkingId]);

  const loadData = async () => {
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'Please log in to continue');
        router.replace('/(auth)/sign-in');
        return;
      }

      if (parkingId) {
        const parkingData = await api.getParkingById(parkingId);
        setParking(parkingData);
      }

      const userVehicles = await api.getVehicles(currentUser.id);
      setVehicles(userVehicles);
      if (userVehicles.length > 0) {
        setSelectedVehicle(userVehicles[0]);
      }

      const userPayments = await api.getPaymentMethods(currentUser.id);
      setPaymentMethods(userPayments);
      if (userPayments.length > 0) {
        setSelectedPayment(userPayments[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateDuration = (): number => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    return end - start;
  };

  const calculateTotal = (): number => {
    if (!parking) return 0;
    const duration = calculateDuration();
    return parking.pricePerHour * duration;
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handlePay = async () => {
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser || !parking) return;

      const newReservation = {
        userId: currentUser.id,
        parkingId: parking.id,
        spotId: spotId || '20',
        vehicleId: selectedVehicle.id,
        startTime: `${formatDate(date)}T${startTime}:00Z`,
        endTime: `${formatDate(date)}T${endTime}:00Z`,
        status: 'active' as const,
        totalCost: calculateTotal(),
      };

      await api.createReservation(newReservation);
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      setLoading(false);
      console.error('Error creating reservation:', error);
      Alert.alert('Error', 'Failed to create reservation');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)');
  };

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
          <Image source={{ uri: parking.image }} style={styles.parkingImage} />
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <Text style={styles.parkingAddress}>{parking.address}</Text>
            <View style={styles.spotInfo}>
              <Ionicons name="location" size={18} color="#1B5E6F" />
              <Text style={styles.spotText}>Spot: F2-{spotId || '20'}</Text>
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
                <Text style={styles.timeText}>{startTime} AM</Text>
                <Ionicons name="chevron-down" size={24} color="#95A5A6" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>End Time</Text>
              <TouchableOpacity style={styles.timeSelector}>
                <Ionicons name="time-outline" size={24} color="#2C3E50" />
                <Text style={styles.timeText}>{endTime} PM</Text>
                <Ionicons name="chevron-down" size={24} color="#95A5A6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vehicle Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowVehicleSelect(true)}
          >
            {selectedVehicle ? (
              <View style={styles.selectedItem}>
                <Ionicons name="car" size={24} color="#1B5E6F" />
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemText}>
                    {selectedVehicle.brand} {selectedVehicle.color}
                  </Text>
                  <Text style={styles.selectedItemSubtext}>{selectedVehicle.plate}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectorPlaceholder}>Select a vehicle</Text>
            )}
            <Ionicons name="chevron-down" size={24} color="#95A5A6" />
          </TouchableOpacity>
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
                  name={selectedPayment.type === 'credit' ? 'card' : 'cash'} 
                  size={24} 
                  color="#1B5E6F" 
                />
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemText}>
                    {selectedPayment.cardNumber}
                  </Text>
                  <Text style={styles.selectedItemSubtext}>{selectedPayment.cardHolder}</Text>
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
            <Text style={styles.totalValue}>{calculateDuration()} hours</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Hourly Rate</Text>
            <Text style={styles.totalValue}>S/. {parking.pricePerHour.toFixed(2)}</Text>
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

      {/* Vehicle Select Modal */}
      <Modal
        visible={showVehicleSelect}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVehicleSelect(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vehicle</Text>
              <TouchableOpacity onPress={() => setShowVehicleSelect(false)}>
                <Ionicons name="close" size={28} color="#2C3E50" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedVehicle(vehicle);
                    setShowVehicleSelect(false);
                  }}
                >
                  <Ionicons name="car" size={24} color="#1B5E6F" />
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemText}>
                      {vehicle.brand} {vehicle.color}
                    </Text>
                    <Text style={styles.modalItemSubtext}>{vehicle.plate}</Text>
                  </View>
                  {selectedVehicle?.id === vehicle.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1B5E6F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                    name={payment.type === 'credit' ? 'card' : 'cash'} 
                    size={24} 
                    color="#1B5E6F" 
                  />
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemText}>
                      {payment.cardNumber}
                    </Text>
                    <Text style={styles.modalItemSubtext}>{payment.cardHolder}</Text>
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
});
