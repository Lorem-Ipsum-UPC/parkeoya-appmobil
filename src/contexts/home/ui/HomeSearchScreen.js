import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import Card from '../../../shared/ui/components/Card';
import colors from '../../../shared/theme/colors';

export default function HomeSearchScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Search Parking Space</Text>
        <AppInput placeholder="Insert location" />
        <Card style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: '700' }}>Recent Place</Text>
          <Text style={{ color: colors.muted, marginTop: 8 }}>Parking Tilalero Primavera - Av. Primavera 123</Text>
        </Card>
        <View style={{ height: 12 }} />
        <AppButton title="Search Parking" onPress={() => {}} />
        <View style={{ height: 8 }} />
        <AppButton title="Reservations" onPress={() => {}} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 24 }
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import Card from '../../../shared/ui/components/Card';
import colors from '../../../shared/theme/colors';

export default function HomeSearchScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Search Parking Space</Text>
        <AppInput placeholder="Insert location" />
        <Card style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: '700' }}>Recent Place</Text>
          <Text style={{ color: colors.muted, marginTop: 8 }}>Parking Tilalero Primavera - Av. Primavera 123</Text>
        </Card>
        <View style={{ height: 12 }} />
        <AppButton title="Search Parking" onPress={() => {}} />
        <View style={{ height: 8 }} />
        <AppButton title="Reservations" onPress={() => {}} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 24 }
});
