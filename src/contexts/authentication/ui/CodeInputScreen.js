import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../../shared/ui/components/AppButton';
import AppInput from '../../../shared/ui/components/AppInput';
import colors from '../../../shared/theme/colors';

export default function CodeInputScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ingresar código de seguridad</Text>
        <Text style={styles.subtitle}>Te hemos enviado un código al correo</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
          <AppInput style={{ flex: 1, marginRight: 6 }} placeholder="" />
          <AppInput style={{ flex: 1, marginHorizontal: 6 }} placeholder="" />
          <AppInput style={{ flex: 1, marginLeft: 6 }} placeholder="" />
        </View>
        <AppButton title="Confirm" onPress={() => navigation.navigate('ResetPassword')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  card: { marginTop: 80, backgroundColor: 'rgba(255,255,255,0.95)', padding: 18, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#333', marginTop: 6 },
});
