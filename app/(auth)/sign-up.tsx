import { authService } from '@/features/auth/services/authService';
import { StorageService } from '@/lib/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const logo = require('../../assets/images/parkeoya_logo.png');

export default function SignUpScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signup');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name';
    if (!email.trim()) return 'Please enter your email';
    if (!phone.trim()) return 'Please enter your phone number';
    if (!dni.trim()) return 'Please enter your DNI';
    if (!city.trim()) return 'Please enter your city';
    if (!country.trim()) return 'Please enter your country';
    if (!password) return 'Please enter a password';
    if (!confirmPassword) return 'Please confirm your password';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }

    // Password validation
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    if (!agreed) {
      return 'Please agree to the Terms and Conditions';
    }

    return null;
  };

  const handleSignUp = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Register driver using the real API
      const authenticatedUser = await authService.signUpDriver({
        email: email.trim(),
        password: password,
        fullName: fullName.trim(),
        city: city.trim(),
        country: country.trim(),
        phone: phone.trim(),
        dni: dni.trim(),
      });

      // Get driver profile
      const driverProfile = await authService.getDriverProfile(
        authenticatedUser.id,
        authenticatedUser.token
      );

      // Save authentication data
      await StorageService.setAuthData({
        user: authenticatedUser,
        driver: driverProfile,
      });

      // Show success message
      Alert.alert(
        'Success!',
        'Your driver account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Unable to create your account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#5DD587', '#41AACD']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image 
            source={logo}
            style={styles.logoSmall}
            resizeMode="contain"
          />
          <Text style={styles.title}>ParkeoYa</Text>
        </View>

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'signin' && styles.activeTab]}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DNI *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your DNI"
              placeholderTextColor="#999"
              value={dni}
              onChangeText={setDni}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#999"
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your country"
              placeholderTextColor="#999"
              value={country}
              onChangeText={setCountry}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password (min. 6 characters)"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree with the Terms and{'\n'}Condition and Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Driver Account</Text>
            )}
          </TouchableOpacity>

          {/* Driver registration info */}
          <View style={styles.driverInfo}>
            <Text style={styles.infoTitle}>🚗 Driver Registration</Text>
            <Text style={styles.infoText}>
              Create your driver account to access parking spots across the city. All fields are required.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoSmall: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#34495E',
  },
  tabText: {
    color: '#95A5A6',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'white',
  },
  checkmark: {
    color: '#1B9B7A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  driverInfo: {
    marginTop: 10,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
});
