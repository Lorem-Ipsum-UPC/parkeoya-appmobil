import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ParkingCard from '../components/ParkingCard';
import ParkingService from '../services/ParkingService';

const MapScreen = ({navigation}) => {
  const [parkings, setParkings] = useState([]);
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 41.3851,
    longitude: 2.1734,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      setLoading(true);
      const data = await ParkingService.getAllParkings();
      setParkings(data);
      setFilteredParkings(data);
    } catch (error) {
      console.error('Error loading parkings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredParkings(parkings);
    } else {
      const filtered = parkings.filter(
        parking =>
          parking.name.toLowerCase().includes(text.toLowerCase()) ||
          parking.address.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredParkings(filtered);
    }
  };

  const handleMarkerPress = parking => {
    navigation.navigate('ParkingDetails', {parking});
  };

  const handleCardPress = parking => {
    navigation.navigate('ParkingDetails', {parking});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}>
        {filteredParkings.map(parking => (
          <Marker
            key={parking.id}
            coordinate={{
              latitude: parking.latitude,
              longitude: parking.longitude,
            }}
            title={parking.name}
            description={`${parking.availableSpots} spots available`}
            onPress={() => handleMarkerPress(parking)}
          />
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search parkings..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={filteredParkings}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ParkingCard parking={item} onPress={() => handleCardPress(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No parkings found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '40%',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default MapScreen;
