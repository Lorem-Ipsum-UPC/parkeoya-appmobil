import { api } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const COLORS = [
  { name: 'Red', hex: '#E74C3C' },
  { name: 'Blue', hex: '#3498DB' },
  { name: 'Black', hex: '#2C3E50' },
  { name: 'White', hex: '#ECF0F1' },
  { name: 'Gray', hex: '#95A5A6' },
  { name: 'Green', hex: '#27AE60' },
  { name: 'Yellow', hex: '#F1C40F' },
  { name: 'Orange', hex: '#E67E22' },
];

export default function AddCarScreen() {
  const router = useRouter();
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleAddVehicle = async () => {
    if (!model.trim() || !plate.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await api.addVehicle({
        userId: 'user1',
        brand: model,
        model: model,
        plate: plate.toUpperCase(),
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        year: new Date().getFullYear(),
      });

      Alert.alert('Success', 'Vehicle added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'Failed to add vehicle');
    }
  };

  const renderCarIcon = () => (
    <View style={[styles.carIconContainer, { backgroundColor: selectedColor.hex }]}>
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
        <Text style={styles.headerTitle}>Add new car</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <TouchableOpacity style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#7F8C8D" />
          </TouchableOpacity>

          {renderCarIcon()}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Toyoya"
              placeholderTextColor="#999"
              value={model}
              onChangeText={setModel}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorSelector}>
              <View style={[styles.colorPreview, { backgroundColor: selectedColor.hex }]} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorPicker}
              >
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.hex}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.hex },
                      selectedColor.hex === color.hex && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.colorEditButton}>
                <Ionicons name="create-outline" size={20} color="#2C3E50" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plate</Text>
            <TextInput
              style={styles.input}
              placeholder="A1A-123"
              placeholderTextColor="#999"
              value={plate}
              onChangeText={setPlate}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddVehicle}
        >
          <Text style={styles.addButtonText}>Add vehicle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.back()}
        >
          <Text style={styles.returnButtonText}>Return Back</Text>
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
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  carIconContainer: {
    width: '100%',
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorPicker: {
    flex: 1,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#1B5E6F',
    borderWidth: 3,
  },
  colorEditButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
