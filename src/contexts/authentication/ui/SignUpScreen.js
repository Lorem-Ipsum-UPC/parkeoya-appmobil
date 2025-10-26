import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function SignUpScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={styles.card}>
          <Text style={styles.title}>ParkeoYa</Text>
          <AppInput placeholder="Username" />
          <AppInput placeholder="Email" keyboardType="email-address" />
          <AppInput placeholder="Phone Number" keyboardType="phone-pad" />
          <AppInput placeholder="Password" secureTextEntry />
          <View style={{ height: 12 }} />
          <AppButton title="Sign up" onPress={() => navigation.replace('Main')} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
