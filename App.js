import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ComponentsShowcase from './src/screens/ComponentsShowcase';

export default function App() {
  return (
    <SafeAreaProvider>
      <ComponentsShowcase />
    </SafeAreaProvider>
  );
}
