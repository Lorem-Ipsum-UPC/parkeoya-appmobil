import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#6DD5A8', '#4DB8E8']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <View style={styles.ripples}>
            <View style={styles.ripple1} />
            <View style={styles.ripple2} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to{'\n'}ParkeoYa</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.buttonText}>Sign up</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  logoCircle: {
    width: 160,
    height: 180,
    backgroundColor: '#1B9B7A',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 10,
    zIndex: 2,
  },
  logoText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -10,
  },
  ripples: {
    position: 'absolute',
    bottom: -30,
    alignItems: 'center',
  },
  ripple1: {
    width: 140,
    height: 50,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#3AA8D8',
    position: 'absolute',
    opacity: 0.6,
  },
  ripple2: {
    width: 170,
    height: 60,
    borderRadius: 85,
    borderWidth: 6,
    borderColor: '#5CC1E8',
    position: 'absolute',
    top: 5,
    opacity: 0.4,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
