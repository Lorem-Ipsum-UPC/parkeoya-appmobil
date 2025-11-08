import { api, Vehicle } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyCarsScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await api.getVehicles('user1');
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleDeleteCar = (vehicleId: string, brand: string) => {
    Alert.alert(
      'Delete Car',
      `Are you sure you want to delete ${brand}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteVehicle(vehicleId);
              loadVehicles();
            } catch (error) {
              console.error('Error deleting vehicle:', error);
            }
          },
        },
      ]
    );
  };

  const renderCarIcon = (color: string) => (
    <View style={[styles.carIconContainer, { backgroundColor: color }]}>
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
        <Text style={styles.headerTitle}>My cars</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My cars ({vehicles.length})</Text>

        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.carCard}>
            {renderCarIcon(vehicle.colorHex || '#E74C3C')}

            <View style={styles.carDetails}>
              <Text style={styles.detailLabel}>Model: <Text style={styles.detailValue}>{vehicle.model}</Text></Text>
              <Text style={styles.detailLabel}>Color: <Text style={styles.detailValue}>{vehicle.color}</Text></Text>
              <Text style={styles.detailLabel}>Plate: <Text style={styles.detailValue}>{vehicle.plate}</Text></Text>
            </View>

            <TouchableOpacity style={styles.editCarButton}>
              <Ionicons name="create-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.editCarButtonText}>Edit car</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteCarButton}
              onPress={() => handleDeleteCar(vehicle.id, vehicle.brand)}
            >
              <Text style={styles.deleteCarButtonText}>Delete car</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addNewCarButton}
          onPress={() => router.push('/profile/add-car')}
        >
          <Text style={styles.addNewCarButtonText}>Add new car</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
  },
  carCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  carIconContainer: {
    width: 200,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  carShape: {
    width: 140,
    height: 70,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  carTop: {
    position: 'absolute',
    top: 10,
    left: 30,
    right: 20,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 8,
  },
  carWheel: {
    position: 'absolute',
    bottom: -4,
    width: 18,
    height: 18,
    backgroundColor: '#34495E',
    borderRadius: 9,
  },
  carWheelFront: {
    right: 18,
  },
  carWheelBack: {
    left: 18,
  },
  carDetails: {
    width: '100%',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  detailValue: {
    fontWeight: 'normal',
    color: '#2C3E50',
  },
  editCarButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  editCarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteCarButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  deleteCarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addNewCarButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  addNewCarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
