import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');

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

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'signin' && styles.activeTab]}
            onPress={() => setActiveTab('signin')}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Insert email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotText}>¿Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Insert password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonText}>Sign in</Text>
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
    marginBottom: 30,
  },
  logoSmall: {
    width: 60,
    height: 70,
    backgroundColor: '#1B9B7A',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 5,
    marginRight: 15,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    color: '#A8E6CF',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
