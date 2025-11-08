import { mockParkings, Parking } from '@/lib/data';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentParkings, setRecentParkings] = useState<Parking[]>([]);

  useEffect(() => {
    // Simular carga de datos
    setRecentParkings(mockParkings);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={20} color="white" />
            <Text style={styles.locationText}>Av. Primavera 1203</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Search Parking{'\n'}Space</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Insert location"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.locationIconButton}>
          <Ionicons name="locate" size={28} color="#1B5E6F" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Place */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Place</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.parkingCardsContainer}
          >
            {recentParkings.map((parking) => (
              <TouchableOpacity
                key={parking.id}
                style={styles.parkingCard}
                onPress={() => router.push(`/parking/${parking.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {parking.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#2C3E50" />
                </View>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  {parking.address}
                </Text>
                <Text style={styles.cardDistance}>
                  {parking.distance} - {parking.currency} {parking.pricePerHour.toFixed(2)}/hour
                </Text>
                
                {/* Mini Map Placeholder */}
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapGrid}>
                    {[...Array(12)].map((_, i) => (
                      <View key={i} style={styles.gridLine} />
                    ))}
                  </View>
                  <View style={styles.mapMarker}>
                    <Ionicons name="location" size={32} color="#1B5E6F" />
                  </View>
                  <Text style={styles.parkingLabel}>P</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/parking/select-parking')}
          >
            <Text style={styles.actionButtonText}>Search Parking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/reservation')}
          >
            <Text style={styles.actionButtonText}>Reservations</Text>
          </TouchableOpacity>
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
    backgroundColor: '#1B5E6F',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    padding: 4,
  },
  titleContainer: {
    backgroundColor: '#1B5E6F',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 42,
  },
  searchContainer: {
    backgroundColor: '#1B5E6F',
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  locationIconButton: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  recentSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  parkingCardsContainer: {
    paddingLeft: 20,
  },
  parkingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.75,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  cardAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 140,
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#D0E8F0',
    width: '100%',
    height: 1,
  },
  mapMarker: {
    position: 'absolute',
    top: '30%',
    zIndex: 2,
  },
  parkingLabel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#1B5E6F',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    width: 44,
    height: 44,
    borderRadius: 22,
    textAlign: 'center',
    lineHeight: 44,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
