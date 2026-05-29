import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MagazinesScreen from '../../screens/magazines/MagazinesScreen';
import MagazineDetailScreen from '../../screens/magazines/MagazineDetailScreen';

import { defaultStackOptions } from '../navigationConfig';

const Stack = createNativeStackNavigator();

export const MagazineStack = () => {
  return (
    <Stack.Navigator
      screenOptions={defaultStackOptions}
    >
      <Stack.Screen
        name="Magazines"
        component={MagazinesScreen}
      />

      <Stack.Screen
        name="MagazineDetail"
        component={MagazineDetailScreen}
        options={{
          animation: 'simple_push',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};