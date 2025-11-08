import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#6DD5A8', '#4DB8E8']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.title}>ParkeoYa</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.heading}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Te enviaremos un codigo de verificación por{'\n'}correo electronico
          </Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Ingresar Correo"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/verify-code')}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80,
  },
  logoSmall: {
    width: 80,
    height: 90,
    backgroundColor: '#1B9B7A',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 8,
    marginRight: 20,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  mainContent: {
    alignItems: 'center',
    gap: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
