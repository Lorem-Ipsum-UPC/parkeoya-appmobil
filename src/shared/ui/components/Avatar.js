import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Avatar({ uri, size = 64 }) {
  return <Image source={uri ? { uri } : require('../../../../assets/avatar-placeholder.png')} style={[styles.avatar, { width: size, height: size, borderRadius: size/2 }]} />;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#eee'
  }
});
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Avatar({ uri, size = 64 }) {
  return <Image source={uri ? { uri } : require('../../../../assets/avatar-placeholder.png')} style={[styles.avatar, { width: size, height: size, borderRadius: size/2 }]} />;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#eee'
  }
});
