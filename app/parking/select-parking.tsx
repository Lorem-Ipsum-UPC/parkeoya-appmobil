import CarImage from '@/components/ui/CarImage';
import { api, Parking, ParkingSpot } from '@/lib/data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
const { width } = Dimensions.get('window');

export default function SelectParkingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [spotRanges, setSpotRanges] = useState<string[]>([]);

  useEffect(() => {
    loadParkingData();
  }, [id]);

  const loadParkingData = async () => {
    try {
      if (id) {
        const data = await api.getParkingById(id);
        setParking(data);
        
        // Generar rangos de spots
        if (data.floors.length > 0) {
          const ranges: string[] = [];
          let start = 17;
          for (let i = 0; i < 4; i++) {
            const end = start + 3;
            ranges.push(`${start} - ${end}`);
            start = end + 1;
          }
          setSpotRanges(ranges);
        }
      }
    } catch (error) {
      console.error('Error loading parking:', error);
    }
  };

  const getFloorSpots = (): ParkingSpot[] => {
    if (!parking || !parking.floors) return [];
    const floor = parking.floors.find((f) => f.floor === selectedFloor);
    return floor ? floor.spots : [];
  };

  const getSpotStatus = (spot: ParkingSpot): 'available' | 'occupied' | 'reserved' => {
    return spot.status;
  };

  const handleSpotSelect = (spot: ParkingSpot) => {
    if (spot.status === 'available') {
      setSelectedSpot(spot);
    }
  };

  const handleContinue = () => {
    if (selectedSpot && parking) {
      router.push({
        pathname: '/parking/reserve',
        params: {
          parkingId: parking.id,
          spotId: selectedSpot.id,
        },
      });
    }
  };

  const getFloorAvailability = (floorNumber: number): string => {
    if (!parking || !parking.floors) return '0/0';
    const floor = parking.floors.find((f) => f.floor === floorNumber);
    if (!floor) return '0/0';
    
    const available = floor.spots.filter((s) => s.status === 'available').length;
    const total = floor.spots.length;
    return `${available}/${total}`;
  };

  const getFloorStatus = (floorNumber: number): 'full' | 'available' => {
    if (!parking || !parking.floors) return 'available';
    const floor = parking.floors.find((f) => f.floor === floorNumber);
    if (!floor) return 'available';
    
    const available = floor.spots.filter((s) => s.status === 'available').length;
    return available === 0 ? 'full' : 'available';
  };

  if (!parking) {
    return null;
  }

  const spots = getFloorSpots();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Parking</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>1</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Select Parking</Text>
        </View>
        
        <View style={styles.stepLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Floor Selector */}
        <View style={styles.floorSelector}>
          {[1, 2, 3].map((floor) => {
            const status = getFloorStatus(floor);
            const availability = getFloorAvailability(floor);
            const isSelected = selectedFloor === floor;
            
            return (
              <TouchableOpacity
                key={floor}
                style={[
                  styles.floorCard,
                  isSelected && styles.floorCardSelected,
                ]}
                onPress={() => setSelectedFloor(floor)}
              >
                <Text style={[styles.floorTitle, isSelected && styles.floorTitleSelected]}>
                  Floor {floor}
                </Text>
                <Text style={[styles.floorAvailability, isSelected && styles.floorAvailabilitySelected]}>
                  {availability}
                </Text>
                <Text
                  style={[
                    styles.floorStatus,
                    status === 'full' && styles.floorStatusFull,
                    status === 'available' && styles.floorStatusAvailable,
                    isSelected && styles.floorStatusSelected,
                  ]}
                >
                  {status === 'full' ? 'Full' : 'Available'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spot Range Selector */}
        <View style={styles.rangeSelector}>
          {spotRanges.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={styles.rangeButton}
            >
              <Text style={styles.rangeText}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Parking Grid */}
        <View style={styles.parkingGrid}>
          <View style={styles.gridColumn}>
            {spots.slice(0, Math.ceil(spots.length / 2)).map((spot, index) => {
              const status = getSpotStatus(spot);
              const isSelected = selectedSpot?.id === spot.id;
              
              return (
                <TouchableOpacity
                  key={spot.id}
                  style={[
                    styles.parkingSpot,
                    status === 'occupied' && styles.spotOccupied,
                    status === 'reserved' && styles.spotReserved,
                    status === 'available' && styles.spotAvailable,
                    isSelected && styles.spotSelected,
                  ]}
                  onPress={() => handleSpotSelect(spot)}
                  disabled={status !== 'available'}
                >
                  {status === 'occupied' || status === 'reserved' ? (
                    <View style={styles.carIcon}>
                      <CarImage
                        colorHex="#FFFFFF"
                        width={80}
                        height={50}
                      />
                    </View>
                  ) : (
                    <Text style={styles.spotId}>F{selectedFloor} - {spot.id}</Text>
                  )}
                  <Text style={[
                    styles.spotStatus,
                    status === 'occupied' && styles.spotStatusOccupied,
                    status === 'reserved' && styles.spotStatusReserved,
                    status === 'available' && styles.spotStatusAvailable,
                  ]}>
                    {status === 'occupied' ? 'Occupied' : status === 'reserved' ? 'Reserved' : 'Available'}
                  </Text>
                  
                  {isSelected && (
                    <View style={styles.checkMark}>
                      <Ionicons name="checkmark-circle" size={32} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Center Line */}
          <View style={styles.centerLine} />

          <View style={styles.gridColumn}>
            {spots.slice(Math.ceil(spots.length / 2)).map((spot, index) => {
              const status = getSpotStatus(spot);
              const isSelected = selectedSpot?.id === spot.id;
              
              return (
                <TouchableOpacity
                  key={spot.id}
                  style={[
                    styles.parkingSpot,
                    status === 'occupied' && styles.spotOccupied,
                    status === 'reserved' && styles.spotReserved,
                    status === 'available' && styles.spotAvailable,
                    isSelected && styles.spotSelected,
                  ]}
                  onPress={() => handleSpotSelect(spot)}
                  disabled={status !== 'available'}
                >
                  {status === 'occupied' || status === 'reserved' ? (
                    <View style={styles.carIcon}>
                      <CarImage
                        colorHex="#FFFFFF"
                        width={80}
                        height={50}
                      />
                    </View>
                  ) : (
                    <Text style={styles.spotId}>F{selectedFloor} - {spot.id}</Text>
                  )}
                  <Text style={[
                    styles.spotStatus,
                    status === 'occupied' && styles.spotStatusOccupied,
                    status === 'reserved' && styles.spotStatusReserved,
                    status === 'available' && styles.spotStatusAvailable,
                  ]}>
                    {status === 'occupied' ? 'Occupied' : status === 'reserved' ? 'Reserved' : 'Available'}
                  </Text>
                  
                  {isSelected && (
                    <View style={styles.checkMark}>
                      <Ionicons name="checkmark-circle" size={32} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      {selectedSpot && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.selectButton} onPress={handleContinue}>
            <Text style={styles.selectButtonText}>Select Parking</Text>
          </TouchableOpacity>
        </View>
      )}
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
  stepActive: {
    backgroundColor: '#1B5E6F',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
  content: {
    flex: 1,
  },
  floorSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  floorCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  floorCardSelected: {
    backgroundColor: '#1B5E6F',
    borderColor: '#1B5E6F',
  },
  floorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E6F',
    marginBottom: 8,
  },
  floorTitleSelected: {
    color: 'white',
  },
  floorAvailability: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  floorAvailabilitySelected: {
    color: 'white',
  },
  floorStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  floorStatusFull: {
    color: '#E74C3C',
  },
  floorStatusAvailable: {
    color: '#27AE60',
  },
  floorStatusSelected: {
    color: 'white',
  },
  rangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  rangeButton: {
    flex: 1,
    backgroundColor: '#1B5E6F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rangeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  parkingGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  gridColumn: {
    flex: 1,
    gap: 16,
  },
  centerLine: {
    width: 8,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
  parkingSpot: {
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spotAvailable: {
    backgroundColor: '#1B5E6F',
    borderColor: '#1B5E6F',
  },
  spotOccupied: {
    backgroundColor: '#5D8A96',
    borderColor: '#5D8A96',
  },
  spotReserved: {
    backgroundColor: '#5D8A96',
    borderColor: '#5D8A96',
  },
  spotSelected: {
    backgroundColor: '#5D8A96',
    borderColor: '#1B5E6F',
  },
  carIcon: {
    marginBottom: 8,
  },
  spotId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  spotStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  spotStatusAvailable: {
    color: 'white',
  },
  spotStatusOccupied: {
    color: 'white',
  },
  spotStatusReserved: {
    color: 'white',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    left: 8,
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
  },
  selectButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  selectButtonText: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: '600',
  },
});
