import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Text, View, StyleSheet} from 'react-native';

import MapScreen from './src/screens/MapScreen';
import ParkingDetailsScreen from './src/screens/ParkingDetailsScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import ReservationConfirmScreen from './src/screens/ReservationConfirmScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapView"
        component={MapScreen}
        options={{title: 'Find Parking'}}
      />
      <Stack.Screen
        name="ParkingDetails"
        component={ParkingDetailsScreen}
        options={{title: 'Parking Details'}}
      />
      <Stack.Screen
        name="ReservationConfirm"
        component={ReservationConfirmScreen}
        options={{title: 'Confirm Reservation'}}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#757575',
        }}>
        <Tab.Screen
          name="Map"
          component={MapStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Search',
            tabBarIcon: ({color}) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.icon, {color}]}>🔍</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Reservations"
          component={ReservationsScreen}
          options={{
            title: 'My Reservations',
            tabBarIcon: ({color}) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.icon, {color}]}>📋</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});

export default App;
