import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {TabParamList} from '../types/navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  HomeScreen,
  PredictionScreen,
  MapScreen,
  AirGuardProHomeScreen,
} from '../screens';
import {colors} from '../styles/commonStyles';
import SignLangScreen from '../screens/SignLangScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Type-safe wrapper for MaterialIcons
const Icon = MaterialIcons as any;

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#00eedaff',
        tabBarInactiveTintColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={AirGuardProHomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="map" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="SignLang"
        component={SignLangScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="sign-language" size={size || 24} color={color} />
          ),
          tabBarLabel: 'Sign Language',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

export default TabNavigator;
