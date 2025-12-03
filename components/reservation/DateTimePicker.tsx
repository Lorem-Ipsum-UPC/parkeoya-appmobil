import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DateTimePickerProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date | string;
  onConfirm: (value: Date | string) => void;
  onCancel: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
  minuteInterval?: number;
  selectedDate?: Date; // For filtering past times
}

export default function DateTimePicker({
  visible,
  mode,
  value,
  onConfirm,
  onCancel,
  maximumDate,
  minimumDate,
  minuteInterval = 30,
  selectedDate,
}: DateTimePickerProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleConfirm = () => {
    onConfirm(selectedValue);
  };

  const renderDatePicker = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dates = [today, tomorrow];

    return (
      <ScrollView style={styles.pickerContainer}>
        {dates.map((date, index) => {
          const isSelected =
            selectedValue instanceof Date &&
            date.toDateString() === selectedValue.toDateString();

          const label =
            index === 0
              ? `Hoy - ${formatDate(date)}`
              : `Mañana - ${formatDate(date)}`;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => setSelectedValue(date)}
            >
              <Text
                style={[styles.optionText, isSelected && styles.selectedOptionText]}
              >
                {label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#1B5E6F" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 / minuteInterval }, (_, i) => i * minuteInterval);

    const timeOptions: string[] = [];
    hours.forEach((hour) => {
      minutes.forEach((minute) => {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        timeOptions.push(time);
      });
    });

    // Filter out past times if selected date is today
    const now = new Date();
    const isToday = selectedDate && 
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    const filteredOptions = isToday 
      ? timeOptions.filter((time) => {
          const [hour, minute] = time.split(':').map(Number);
          const timeInMinutes = hour * 60 + minute;
          const nowInMinutes = now.getHours() * 60 + now.getMinutes();
          return timeInMinutes >= nowInMinutes;
        })
      : timeOptions;

    return (
      <ScrollView style={styles.pickerContainer}>
        {filteredOptions.map((time) => {
          const isSelected = selectedValue === time;

          return (
            <TouchableOpacity
              key={time}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => setSelectedValue(time)}
            >
              <Text
                style={[styles.optionText, isSelected && styles.selectedOptionText]}
              >
                {time}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color="#1B5E6F" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'date' ? 'Seleccionar Fecha' : 'Seleccionar Hora'}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={28} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          {mode === 'date' ? renderDatePicker() : renderTimePicker()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  pickerContainer: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedOption: {
    backgroundColor: '#E8F4F8',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  selectedOptionText: {
    color: '#1B5E6F',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95A5A6',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1B5E6F',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
