import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';

export default function EditProfileScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Edit Profile</Text>
      <AppInput placeholder="Name" />
      <AppInput placeholder="Email" keyboardType="email-address" />
      <AppInput placeholder="Phone" keyboardType="phone-pad" />
      <AppInput placeholder="Current Password" secureTextEntry />
      <AppInput placeholder="New Password" secureTextEntry />
      <View style={{ height: 12 }} />
      <AppButton title="Save Changes" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <AppButton title="Return Back" onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
    </ScrollView>
  );
}
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';

export default function EditProfileScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Edit Profile</Text>
      <AppInput placeholder="Name" />
      <AppInput placeholder="Email" keyboardType="email-address" />
      <AppInput placeholder="Phone" keyboardType="phone-pad" />
      <AppInput placeholder="Current Password" secureTextEntry />
      <AppInput placeholder="New Password" secureTextEntry />
      <View style={{ height: 12 }} />
      <AppButton title="Save Changes" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <AppButton title="Return Back" onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
    </ScrollView>
  );
}
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppInput from '../../../shared/ui/components/AppInput';
import AppButton from '../../../shared/ui/components/AppButton';

export default function EditProfileScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Edit Profile</Text>
      <AppInput placeholder="Name" />
      <AppInput placeholder="Email" keyboardType="email-address" />
      <AppInput placeholder="Phone" keyboardType="phone-pad" />
      <AppInput placeholder="Current Password" secureTextEntry />
      <AppInput placeholder="New Password" secureTextEntry />
      <View style={{ height: 12 }} />
      <AppButton title="Save Changes" onPress={() => navigation.goBack()} />
      <View style={{ height: 8 }} />
      <AppButton title="Return Back" onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', borderWidth: 1 }} />
    </ScrollView>
  );
}
