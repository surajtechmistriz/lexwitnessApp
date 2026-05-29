import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { defaultStackOptions } from '../navigationConfig';

import SignIn from '../../screens/auth/screens/SignIn';
import Register from '../../screens/auth/screens/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={defaultStackOptions}
    >
      {/* SIGN IN */}
      <Stack.Screen
        name="SignIn"
        component={SignIn}
      />

      {/* REGISTER */}
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          animation: 'simple_push',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}