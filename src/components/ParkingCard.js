import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ParkingCard = ({parking, onPress}) => {
  const availabilityPercentage =
    (parking.availableSpots / parking.totalSpots) * 100;
  const isLowAvailability = availabilityPercentage < 30;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{parking.name}</Text>
        <View
          style={[
            styles.availabilityBadge,
            isLowAvailability && styles.lowAvailability,
          ]}>
          <Text style={styles.availabilityText}>
            {parking.availableSpots} spots
          </Text>
        </View>
      </View>
      <Text style={styles.address}>{parking.address}</Text>
      <View style={styles.details}>
        <Text style={styles.price}>€{parking.pricePerHour}/hour</Text>
        <Text style={styles.rating}>⭐ {parking.rating}</Text>
        {parking.distance && (
          <Text style={styles.distance}>{parking.distance} km</Text>
        )}
      </View>
      <View style={styles.features}>
        {parking.features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureBadge}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  availabilityBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowAvailability: {
    backgroundColor: '#FF9800',
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginRight: 16,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  distance: {
    fontSize: 14,
    color: '#999',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#2196F3',
  },
});

export default ParkingCard;
