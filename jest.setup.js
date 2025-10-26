import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});
