import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function ResetPasswordScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ingresa tu nueva contraseña</Text>
        <AppInput placeholder="Nueva contraseña" secureTextEntry />
        <AppInput placeholder="Repite la nueva contraseña" secureTextEntry />
        <AppButton title="Confirm" onPress={() => navigation.replace('SignIn')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  card: { marginTop: 80, backgroundColor: 'rgba(255,255,255,0.95)', padding: 18, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
