import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Register from '../screens/Register';
import SignInScreen from '../screens/SignIn';
import MagazinesScreen from '../screens/MagazinesScreen';

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
