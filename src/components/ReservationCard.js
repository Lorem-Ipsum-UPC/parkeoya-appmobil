import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ReservationCard = ({reservation, onCancel}) => {
  const isActive = reservation.status === 'confirmed';
  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.parkingName}>{reservation.parkingName}</Text>
        <View
          style={[
            styles.statusBadge,
            !isActive && styles.cancelledStatusBadge,
          ]}>
          <Text style={styles.statusText}>
            {isActive ? 'Active' : 'Cancelled'}
          </Text>
        </View>
      </View>
      <Text style={styles.address}>{reservation.parkingAddress}</Text>
      <View style={styles.timeInfo}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Start</Text>
          <Text style={styles.timeValue}>{formatDate(startDate)}</Text>
          <Text style={styles.timeValue}>{formatTime(startDate)}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>End</Text>
          <Text style={styles.timeValue}>{formatDate(endDate)}</Text>
          <Text style={styles.timeValue}>{formatTime(endDate)}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>Total: €{reservation.totalPrice}</Text>
        {isActive && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancel(reservation.id)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  parkingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cancelledStatusBadge: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#2196F3',
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ReservationCard;
