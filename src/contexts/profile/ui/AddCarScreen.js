import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';

export default function AddCarScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Add new car</Text>
      <AppInput placeholder="Model" />
      <AppInput placeholder="Color" />
      <AppInput placeholder="Plate" />
      <View style={{ height: 12 }} />
      <AppButton title="Add vehicle" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <AppButton title="Return Back" onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({});
