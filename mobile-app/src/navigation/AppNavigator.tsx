import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
// import { LoginScreen, RegisterScreen, ResetPasswordScreen } from '../screens';
import TabNavigator from './TabNavigator';
import {useAuth} from '../contexts/authContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const {isLoggedIn} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp" component={TabNavigator} />
        ) : (
          <>
            {/* <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
