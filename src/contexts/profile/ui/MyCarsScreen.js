import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../../shared/ui/components/Card';
import AppButton from '../../../shared/ui/components/AppButton';

export default function MyCarsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>My cars (2)</Text>
      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Toyota - Red</Text>
        <Text style={{ color: '#666' }}>License: ABC-123</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Suzuki - Black</Text>
        <Text style={{ color: '#666' }}>License: XYZ-987</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
    </ScrollView>
  );
}
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../../shared/ui/components/Card';
import AppButton from '../../../shared/ui/components/AppButton';

export default function MyCarsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>My cars (2)</Text>
      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Toyota - Red</Text>
        <Text style={{ color: '#666' }}>License: ABC-123</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Suzuki - Black</Text>
        <Text style={{ color: '#666' }}>License: XYZ-987</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
    </ScrollView>
  );
}
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Card from '../../../shared/ui/components/Card';
import AppButton from '../../../shared/ui/components/AppButton';

export default function MyCarsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>My cars (2)</Text>
      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Toyota - Red</Text>
        <Text style={{ color: '#666' }}>License: ABC-123</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '700' }}>Suzuki - Black</Text>
        <Text style={{ color: '#666' }}>License: XYZ-987</Text>
        <View style={{ marginTop: 8 }}>
          <AppButton title="Edit car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>

      <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
    </ScrollView>
  );
}
