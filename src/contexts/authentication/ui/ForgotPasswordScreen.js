import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>Ingresa tu correo para recibir un código</Text>
        <AppInput placeholder="Email" keyboardType="email-address" />
        <AppButton title="Ingresar Correo" onPress={() => navigation.navigate('CodeInput')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  card: { marginTop: 80, backgroundColor: 'rgba(255,255,255,0.9)', padding: 18, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#333', marginVertical: 8 },
});
