import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';

interface CarImageProps {
  color?: string;
  colorHex?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export default function CarImage({ 
  color, 
  colorHex, 
  width = 140, 
  height = 70, 
  style 
}: CarImageProps) {
  // Determinar el color a usar
  const tintColor = colorHex || getColorHex(color);

  return (
    <View style={[{ width, height }, style]}>
      <Image
        source={require('@/assets/images/carro.png')}
        style={{
          width: '100%',
          height: '100%',
          tintColor: tintColor,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

// Función auxiliar para convertir nombres de colores a hexadecimal
function getColorHex(color?: string): string {
  if (!color) return '#E74C3C';
  
  const colorMap: { [key: string]: string } = {
    'red': '#E74C3C',
    'rojo': '#E74C3C',
    'blue': '#3498DB',
    'azul': '#3498DB',
    'black': '#2C3E50',
    'negro': '#2C3E50',
    'white': '#ECF0F1',
    'blanco': '#ECF0F1',
    'gray': '#95A5A6',
    'grey': '#95A5A6',
    'gris': '#95A5A6',
    'green': '#27AE60',
    'verde': '#27AE60',
    'yellow': '#F1C40F',
    'amarillo': '#F1C40F',
    'orange': '#E67E22',
    'naranja': '#E67E22',
    'purple': '#9B59B6',
    'morado': '#9B59B6',
    'silver': '#BDC3C7',
    'plateado': '#BDC3C7',
  };

  const lowerColor = color.toLowerCase();
  return colorMap[lowerColor] || '#E74C3C';
}
