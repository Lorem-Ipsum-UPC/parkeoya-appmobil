import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function AppInput(props) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
  },
  input: {
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.textPrimary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1
  }
});
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function AppInput(props) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
  },
  input: {
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.textPrimary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1
  }
});
