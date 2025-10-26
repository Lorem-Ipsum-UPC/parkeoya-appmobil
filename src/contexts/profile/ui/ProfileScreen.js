import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../shared/ui/components/Card';
import Avatar from '../../../shared/ui/components/Avatar';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <Card style={{ margin: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size={72} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontWeight: '700' }}>Tadelero Tadele</Text>
            <Text style={{ color: colors.muted }}>tadele@correo.com</Text>
            <Text style={{ color: colors.muted }}>Av. Primavera 123</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <AppButton title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </Card>

      <Card style={{ margin: 16 }}>
        <View>
          <Text style={{ fontWeight: '700' }}>My Cars (2)</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyCars')} style={{ marginTop: 8 }}>
            <Text style={{ color: '#2b8a8a' }}>Ver mis autos</Text>
          </TouchableOpacity>
          <View style={{ height: 8 }} />
          <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../shared/ui/components/Card';
import Avatar from '../../../shared/ui/components/Avatar';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <Card style={{ margin: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size={72} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontWeight: '700' }}>Tadelero Tadele</Text>
            <Text style={{ color: colors.muted }}>tadele@correo.com</Text>
            <Text style={{ color: colors.muted }}>Av. Primavera 123</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <AppButton title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </Card>

      <Card style={{ margin: 16 }}>
        <View>
          <Text style={{ fontWeight: '700' }}>My Cars (2)</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyCars')} style={{ marginTop: 8 }}>
            <Text style={{ color: '#2b8a8a' }}>Ver mis autos</Text>
          </TouchableOpacity>
          <View style={{ height: 8 }} />
          <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../shared/ui/components/Card';
import Avatar from '../../../shared/ui/components/Avatar';
import AppButton from '../../../shared/ui/components/AppButton';
import colors from '../../../shared/theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <Card style={{ margin: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size={72} />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontWeight: '700' }}>Tadelero Tadele</Text>
            <Text style={{ color: colors.muted }}>tadele@correo.com</Text>
            <Text style={{ color: colors.muted }}>Av. Primavera 123</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <AppButton title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </Card>

      <Card style={{ margin: 16 }}>
        <View>
          <Text style={{ fontWeight: '700' }}>My Cars (2)</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyCars')} style={{ marginTop: 8 }}>
            <Text style={{ color: '#2b8a8a' }}>Ver mis autos</Text>
          </TouchableOpacity>
          <View style={{ height: 8 }} />
          <AppButton title="Add new car" onPress={() => navigation.navigate('AddCar')} />
        </View>
      </Card>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
