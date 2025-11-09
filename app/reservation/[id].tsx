import CarImage from '@/components/ui/CarImage';
import { api, Parking, PaymentMethod, Reservation, Vehicle } from '@/lib/data';
import { StorageService } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReservationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [parking, setParking] = useState<Parking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    loadReservationDetails();
  }, [id]);

  const loadReservationDetails = async () => {
    try {
      if (!id) return;

      const currentUser = await StorageService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Session Expired', 'Please login again');
        router.replace('/(auth)/sign-in');
        return;
      }

      // Buscar la reservación en la lista
      const allReservations = await api.getReservations(currentUser.id);
      const reservationData = allReservations.find((r) => r.id === id);
      
      if (!reservationData) {
        console.error('Reservation not found');
        return;
      }

      setReservation(reservationData);

      // Cargar parking
      const parkingData = await api.getParkingById(reservationData.parkingId);
      setParking(parkingData);

      // Cargar vehículo
      const vehicles = await api.getVehicles(currentUser.id);
      const vehicleData = vehicles.find((v) => v.id === reservationData.vehicleId);
      setVehicle(vehicleData || null);

      // Cargar método de pago
      const paymentMethods = await api.getPaymentMethods(currentUser.id);
      if (paymentMethods.length > 0) {
        setPaymentMethod(paymentMethods[0]);
      }
    } catch (error) {
      console.error('Error loading reservation details:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    // Convertir formato de fecha
    return '26/10/2025'; // Mock - TODO: Parse actual date
  };

  const formatTime = (timeString: string): string => {
    // Extraer hora de timestamp
    return '13:12 PM'; // Mock - TODO: Parse actual time
  };

  const calculateDuration = (): number => {
    return 180; // Mock - 3 horas
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

  if (!reservation || !parking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reservations</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

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
        {/* Parking Info Header */}
        <View style={styles.parkingHeader}>
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <Text style={styles.spotInfo}>F2 -{reservation.spotId}</Text>
            <Text style={styles.reservationId}>ID: 405456412</Text>
          </View>
          <Image
            source={{ uri: parking.image }}
            style={styles.parkingImage}
            resizeMode="cover"
          />
        </View>

        {/* Location */}
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

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Raiting</Text>
          <View style={styles.starsRow}>
            {renderStars(parking.rating)}
          </View>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{formatDate(reservation.startTime)}</Text>
            <Ionicons name="calendar-outline" size={24} color="#1B5E6F" />
          </View>
        </View>

        {/* Duration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Reservation Time</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>13:10 PM</Text>
            <Ionicons name="time-outline" size={24} color="#1B5E6F" />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{formatTime(reservation.startTime)}</Text>
                <Ionicons name="time-outline" size={24} color="#1B5E6F" />
              </View>
            </View>

            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>End Time</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{formatTime(reservation.endTime)}</Text>
                <Ionicons name="time-outline" size={24} color="#1B5E6F" />
              </View>
            </View>
          </View>
        </View>

        {/* My Car Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Car</Text>
          {vehicle && (
            <View style={styles.carContainer}>
              <CarImage
                colorHex={vehicle.colorHex}
                color={vehicle.color}
                width={100}
                height={60}
              />
              <View style={styles.carInfo}>
                <Text style={styles.carBrand}>{vehicle.brand} {vehicle.color.toLowerCase()}</Text>
                <Text style={styles.carPlate}>{vehicle.plate}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          {paymentMethod && (
            <View style={styles.paymentContainer}>
              <View style={styles.visaIcon}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentNumber}>{paymentMethod.cardNumber}</Text>
                <Text style={styles.paymentHolder}>{paymentMethod.cardHolder}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Total Section */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>S/. {reservation.totalCost.toFixed(2)}</Text>
          <Text style={styles.totalDuration}>/ {calculateDuration()} minutes</Text>
        </View>

        {/* Return Back Button */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.back()}
        >
          <Text style={styles.returnButtonText}>Return Back</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  parkingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  parkingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  parkingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  spotInfo: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  reservationId: {
    fontSize: 14,
    color: '#95A5A6',
  },
  parkingImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'white',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  ratingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 16,
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
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  dateBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1B5E6F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E6F',
  },
  durationRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 16,
    color: '#2C3E50',
  },
  timeBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1B5E6F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E6F',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
  },
  carContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  carInfo: {
    flex: 1,
  },
  carBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  paymentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  visaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1F71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  paymentHolder: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  totalContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalDuration: {
    fontSize: 18,
    color: '#1B5E6F',
    marginLeft: 8,
  },
  returnButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1B5E6F',
    paddingVertical: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E6F',
  },
});
