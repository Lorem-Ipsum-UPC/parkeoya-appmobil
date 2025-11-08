import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '']);

  return (
    <LinearGradient
      colors={['#6DD5A8', '#4DB8E8']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.heading}>Ingresar codigo de seguridad</Text>
          <Text style={styles.subtitle}>
            Enviamos un codigo a su correo electronico.{'\n'}Ingrese el codigo para continuar
          </Text>

          {/* Code Inputs */}
          <View style={styles.codeContainer}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="number-pad"
                value={code[index]}
                onChangeText={(text) => {
                  const newCode = [...code];
                  newCode[index] = text;
                  setCode(newCode);
                }}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(auth)/reset-password')}
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
    justifyContent: 'center',
  },
  mainContent: {
    alignItems: 'center',
    gap: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  codeInput: {
    backgroundColor: '#ECF0F1',
    width: 60,
    height: 70,
    borderRadius: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#2C3E50',
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
