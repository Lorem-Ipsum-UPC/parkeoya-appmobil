import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoCircle} />
        <Text style={styles.title}>Welcome to ParkeoYa</Text>
      </View>

      <View style={styles.actions}>
        <AppButton title="Sign in" onPress={() => navigation.navigate('SignIn')} />
        <View style={{ height: 12 }} />
        <AppButton
          title="Sign up"
          onPress={() => navigation.navigate('SignUp')}
          style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000' }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 24 },
  brand: { alignItems: 'center', marginTop: 80 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF', marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  actions: { marginBottom: 60 },
});
