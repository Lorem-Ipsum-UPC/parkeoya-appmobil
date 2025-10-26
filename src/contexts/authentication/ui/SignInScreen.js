import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function SignInScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>ParkeoYa</Text>
        <AppInput placeholder="Email" keyboardType="email-address" />
        <AppInput placeholder="Password" secureTextEntry />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <AppButton title="Sign in" onPress={() => navigation.replace('Main')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { marginTop: 80, backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 12 },
  brand: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  forgot: { alignSelf: 'flex-end', color: '#1a1a1a', marginBottom: 12 },
});
