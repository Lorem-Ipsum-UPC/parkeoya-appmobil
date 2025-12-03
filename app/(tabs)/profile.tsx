import { useDriverProfile } from '@/features/profile/hooks/useDriverProfile';
import { StorageService } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, isLoading, error, refreshProfile } = useDriverProfile();

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await StorageService.removeAuthData();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B5E6F" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#E74C3C" />
          <Text style={styles.errorText}>{error || 'Error al cargar el perfil'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshProfile}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Perfil del Conductor</Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#1B5E6F" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{profile.fullName}</Text>
              <Text style={styles.userEmail}>{profile.email || 'Sin email'}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color="#7F8C8D" />
                <Text style={styles.userPhone}>{profile.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#7F8C8D" />
                <Text style={styles.userAddress}>{profile.city}, {profile.country}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="card" size={16} color="#7F8C8D" />
                <Text style={styles.userDni}>DNI: {profile.dni}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Ionicons name="create-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* My Cars Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Vehículos</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/profile/add-car')}
            >
              <Ionicons name="add-circle" size={20} color="#1B5E6F" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.carItemPlaceholder}
            onPress={() => router.push('/profile/my-cars')}
          >
            <Ionicons name="car-sport" size={40} color="#BDC3C7" />
            <Text style={styles.placeholderText}>No hay vehículos registrados</Text>
            <Text style={styles.placeholderSubtext}>Toca aquí para ver tus vehículos</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lugares Recientes</Text>
          </View>

          <TouchableOpacity
            style={styles.placeholderCard}
            onPress={() => router.push('/(tabs)/map')}
          >
            <Ionicons name="time-outline" size={32} color="#BDC3C7" />
            <Text style={styles.placeholderText}>No hay lugares recientes</Text>
            <Text style={styles.placeholderSubtext}>Busca estacionamientos en el mapa</Text>
          </TouchableOpacity>
        </View>
        {/* Payment History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historial de Pagos</Text>
          </View>
          <TouchableOpacity
            style={styles.placeholderCard}
            onPress={() => router.push('/profile/payment-history')}
          >
            <Ionicons name="card-outline" size={32} color="#BDC3C7" />
            <Text style={styles.placeholderText}>No hay pagos registrados</Text>
            <Text style={styles.placeholderSubtext}>Tus reservas aparecerán aquí</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1B5E6F',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarContainer: {
    marginRight: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 40,
    padding: 4,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  userPhone: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  userAddress: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  userDni: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  editButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#E8F4F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#1B5E6F',
    fontSize: 14,
    fontWeight: '600',
  },
  carItemPlaceholder: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 12,
    fontWeight: '600',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 4,
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
    backgroundColor: '#F5F5F5',
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
  logoutButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginHorizontal: 20,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
