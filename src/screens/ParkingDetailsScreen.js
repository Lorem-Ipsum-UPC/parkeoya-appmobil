import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ParkingDetailsScreen = ({route, navigation}) => {
  const {parking} = route.params;

  const handleReserve = () => {
    navigation.navigate('ReservationConfirm', {parking});
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{parking.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {parking.rating}</Text>
        </View>
      </View>

      <Text style={styles.address}>{parking.address}</Text>

      <View style={styles.availabilitySection}>
        <View style={styles.availabilityCard}>
          <Text style={styles.availabilityLabel}>Available Spots</Text>
          <Text style={styles.availabilityValue}>
            {parking.availableSpots} / {parking.totalSpots}
          </Text>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price per Hour</Text>
          <Text style={styles.priceValue}>€{parking.pricePerHour}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          {parking.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureBullet}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.coordinates}>
          Lat: {parking.latitude.toFixed(4)}, Lng:{' '}
          {parking.longitude.toFixed(4)}
        </Text>
      </View>

      <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
        <Text style={styles.reserveButtonText}>Reserve Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
    fontSize: 16,
    color: '#666',
  },
  availabilitySection: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  availabilityCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  availabilityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBullet: {
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
    color: '#666',
  },
  coordinates: {
    fontSize: 14,
    color: '#999',
  },
  reserveButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ParkingDetailsScreen;
