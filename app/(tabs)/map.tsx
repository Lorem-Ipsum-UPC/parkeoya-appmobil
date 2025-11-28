import { parkingService } from '@/features/parking/services/parkingService';
import { ParkingResource } from '@/features/parking/types/parking.types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Ciudades principales de Perú con coordenadas
const PERU_LOCATIONS = [
  { name: 'Lima', region: 'Lima', lat: -12.0464, lng: -77.0428 },
  { name: 'Arequipa', region: 'Arequipa', lat: -16.4090, lng: -71.5375 },
  { name: 'Cusco', region: 'Cusco', lat: -13.5319, lng: -71.9675 },
  { name: 'Trujillo', region: 'La Libertad', lat: -8.1116, lng: -79.0288 },
  { name: 'Chiclayo', region: 'Lambayeque', lat: -6.7714, lng: -79.8410 },
  { name: 'Piura', region: 'Piura', lat: -5.1945, lng: -80.6328 },
  { name: 'Iquitos', region: 'Loreto', lat: -3.7437, lng: -73.2516 },
  { name: 'Huancayo', region: 'Junín', lat: -12.0697, lng: -75.2036 },
  { name: 'Tacna', region: 'Tacna', lat: -18.0131, lng: -70.2506 },
  { name: 'Ica', region: 'Ica', lat: -14.0678, lng: -75.7286 },
  { name: 'Puno', region: 'Puno', lat: -15.8402, lng: -70.0219 },
  { name: 'Ayacucho', region: 'Ayacucho', lat: -13.1631, lng: -74.2236 },
  { name: 'Cajamarca', region: 'Cajamarca', lat: -7.1611, lng: -78.5126 },
  { name: 'Sullana', region: 'Piura', lat: -4.9036, lng: -80.6853 },
  { name: 'Chimbote', region: 'Áncash', lat: -9.0853, lng: -78.5783 },
  { name: 'Huaraz', region: 'Áncash', lat: -9.5267, lng: -77.5278 },
  { name: 'Tarapoto', region: 'San Martín', lat: -6.4919, lng: -76.3686 },
  { name: 'Pucallpa', region: 'Ucayali', lat: -8.3791, lng: -74.5539 },
  { name: 'Juliaca', region: 'Puno', lat: -15.5000, lng: -70.1333 },
  { name: 'Tumbes', region: 'Tumbes', lat: -3.5669, lng: -80.4515 },
];

export default function MapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [parkings, setParkings] = useState<ParkingResource[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<ParkingResource[]>([]);
  const [suggestions, setSuggestions] = useState<typeof PERU_LOCATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });
  const mapRef = useRef<MapView>(null);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadParkings();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Se necesita permiso para acceder a tu ubicación.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(newRegion);

      mapRef.current?.animateToRegion(newRegion, 1000);

    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadParkings = async () => {
    try {
      setIsLoading(true);
      const data = await parkingService.getAllParkings();
      setParkings(data);
      setFilteredParkings(data);
    } catch (error) {
      console.error('Error loading parkings:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los estacionamientos. Intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim().length > 1) {
      const filtered = PERU_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(text.toLowerCase()) ||
          loc.region.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: typeof PERU_LOCATIONS[0]) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
    Keyboard.dismiss();

    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);

    const filtered = parkings.filter(
      (p) =>
        p.city.toLowerCase() === location.name.toLowerCase() ||
        p.city.toLowerCase().includes(location.name.toLowerCase())
    );
    
    if (filtered.length > 0) {
      setFilteredParkings(filtered);
    } else {
      setFilteredParkings(parkings);
      Alert.alert(
        'No hay parkings',
        `No se encontraron estacionamientos en ${location.name}. Mostrando todos los parkings disponibles.`,
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredParkings(parkings);
      return;
    }

    if (!showSuggestions) {
      const filtered = parkingService.filterParkings(parkings, {
        query: searchQuery,
      });
      setFilteredParkings(filtered);
      
      if (filtered.length > 0) {
        const firstParking = filtered[0];
        const newRegion = {
          latitude: firstParking.lat,
          longitude: firstParking.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    }
  }, [searchQuery, parkings, showSuggestions]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        moveOnMarkerPress={false}
      >
        {filteredParkings.map((parking) => (
          <Marker
            key={parking.id}
            coordinate={{
              latitude: parking.lat,
              longitude: parking.lng,
            }}
            onPress={() => router.push(`/parking/${parking.id}`)}
          >
            <View style={styles.parkingMarker}>
              <Ionicons name="car" size={16} color="white" />
              {parking.availableSpots > 0 && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>{parking.availableSpots}</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Buscar ciudad o estacionamiento"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => {
              if (searchQuery.trim().length > 1) {
                setShowSuggestions(true);
              }
            }}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                setFilteredParkings(parkings);
                Keyboard.dismiss();
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              style={styles.suggestionsList}
              nestedScrollEnabled={true}
            >
              {suggestions.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleLocationSelect(location)}
                >
                  <Ionicons name="location" size={20} color="#1B5E6F" />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionName}>{location.name}</Text>
                    <Text style={styles.suggestionRegion}>{location.region}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.recenterButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={28} color="#1B5E6F" />
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1B5E6F" />
          <Text style={styles.loadingText}>Cargando estacionamientos...</Text>
        </View>
      )}

      {!isLoading && searchQuery.trim() && !showSuggestions && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredParkings.length} estacionamiento{filteredParkings.length !== 1 ? 's' : ''} encontrado{filteredParkings.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  suggestionRegion: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  parkingMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B5E6F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  availableBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  availableText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1B5E6F',
    fontWeight: '600',
  },
  resultsInfo: {
    position: 'absolute',
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsText: {
    fontSize: 14,
    color: '#1B5E6F',
    fontWeight: '600',
    textAlign: 'center',
  },
});
