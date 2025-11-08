import { api, Parking, User, Vehicle } from '@/lib/data';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recentParkings, setRecentParkings] = useState<Parking[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Cargar usuario
      const userData = await api.getUser('user1');
      setUser(userData);

      // Cargar vehículos
      const vehiclesData = await api.getVehicles('user1');
      setVehicles(vehiclesData);

      // Cargar lugares recientes
      const parkingsData = await api.getParkings();
      setRecentParkings(parkingsData.slice(0, 2));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const renderCarIcon = (color: string) => (
    <View style={[styles.carIcon, { backgroundColor: color }]}>
      <View style={styles.carShape}>
        <View style={styles.carBody} />
        <View style={styles.carTop} />
        <View style={[styles.carWheel, styles.carWheelFront]} />
        <View style={[styles.carWheel, styles.carWheelBack]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>User Profile</Text>
          
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Loading...'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
              <Text style={styles.userAddress}>{user?.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* My Cars Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Cars ({vehicles.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/profile/add-car')}
            >
              <Text style={styles.addButtonText}>Add new car</Text>
            </TouchableOpacity>
          </View>

          {vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.carItem}
              onPress={() => router.push('/profile/my-cars')}
            >
              {renderCarIcon(vehicle.colorHex || '#E74C3C')}
              <View style={styles.carInfo}>
                <Text style={styles.carBrand}>{vehicle.brand} {vehicle.color.toLowerCase()}</Text>
                <Text style={styles.carPlate}>{vehicle.plate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Place */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Place</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.parkingCardsContainer}
          >
            {recentParkings.map((parking) => (
              <TouchableOpacity
                key={parking.id}
                style={styles.parkingCard}
                onPress={() => router.push(`/parking/${parking.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.parkingName} numberOfLines={1}>
                    {parking.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#2C3E50" />
                </View>
                <Text style={styles.parkingAddress} numberOfLines={1}>
                  {parking.address}
                </Text>
                <Text style={styles.parkingDistance}>
                  {parking.distance} - {parking.currency} {parking.pricePerHour.toFixed(2)}/hour
                </Text>
                
                {/* Mini Map Placeholder */}
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapMarker}>
                    <Ionicons name="location" size={32} color="#1B5E6F" />
                  </View>
                  <Text style={styles.parkingLabel}>P</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <View style={styles.paymentHeader}>
            <Ionicons name="time-outline" size={28} color="#2C3E50" />
            <Text style={styles.paymentTitle}>Historial de Pagos</Text>
          </View>
          <View style={styles.noPaymentsContainer}>
            <Text style={styles.noPaymentsText}>No tiene pagos registrados</Text>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  userAddress: {
    fontSize: 14,
    color: '#95A5A6',
  },
  editButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addButton: {
    backgroundColor: '#D5D8DC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  carIcon: {
    width: 80,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  carShape: {
    width: 60,
    height: 30,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  carTop: {
    position: 'absolute',
    top: 5,
    left: 15,
    right: 10,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 4,
  },
  carWheel: {
    position: 'absolute',
    bottom: -2,
    width: 8,
    height: 8,
    backgroundColor: '#34495E',
    borderRadius: 4,
  },
  carWheelFront: {
    right: 8,
  },
  carWheelBack: {
    left: 8,
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
  parkingCardsContainer: {
    paddingRight: 20,
  },
  parkingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.7,
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
  parkingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  parkingAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  parkingDistance: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMarker: {
    position: 'absolute',
    top: '30%',
    zIndex: 2,
  },
  parkingLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#1B5E6F',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  noPaymentsContainer: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noPaymentsText: {
    fontSize: 16,
    color: '#95A5A6',
  },
});
