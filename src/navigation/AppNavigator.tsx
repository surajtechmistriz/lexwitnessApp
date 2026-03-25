import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../features/home/HomeScreen';
import Register from '../features/auth/screens/Register';
import SignInScreen from '../features/auth/screens/SignIn';
import MagazinesScreen from '../features/magazines/MagazinesScreen';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  SignIn:undefined;
  MagazinesScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SignIn" component = {SignInScreen}/>
        <Stack.Screen name="MagazinesScreen" component={MagazinesScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
