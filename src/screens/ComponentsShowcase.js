import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../shared/ui/components/AppButton';
import AppInput from '../shared/ui/components/AppInput';
import Card from '../shared/ui/components/Card';
import Avatar from '../shared/ui/components/Avatar';
import colors from '../shared/theme/colors';

export default function ComponentsShowcase() {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Component Library — ParkeoYa (Guide)</Text>

        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Buttons</Text>
          <View style={{ marginTop: 8 }}>
            <AppButton title="Primary Button" />
            <View style={{ height: 8 }} />
            <AppButton title="Secondary Button" style={{ backgroundColor: '#FFFFFF', borderWidth: 1 }} />
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Inputs</Text>
          <View style={{ marginTop: 8 }}>
            <AppInput placeholder="Email" />
            <AppInput placeholder="Password" secureTextEntry />
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <View style={{ marginTop: 8 }}>
            <Avatar size={80} />
          </View>
        </Card>

        <Text style={styles.footer}>Estos componentes están pensados como guía de estilos y se deben reutilizar en los distintos bounded contexts (cada uno en su propia rama).</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  footer: { color: '#fff', marginTop: 16 }
});
