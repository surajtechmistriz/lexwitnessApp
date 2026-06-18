// navigation/BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { tabScreenOptions } from './navigationConfig';

// ============ DIRECT COMPONENTS (NO STACKS) ============
import HomeScreen from '../screens/home/HomeScreen';
import CategoryList from '../components/common/CategoryList';
import MagazinesScreen from '../screens/magazines/MagazinesScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import SignIn from '../screens/auth/screens/SignIn';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      ...tabScreenOptions,
      tabBarIcon: ({ color, focused }) => {
        const iconMap = {
          HomeTab: focused ? 'home' : 'home-outline',
          CategoriesTab: focused ? 'grid' : 'grid-outline',
          MagazinesTab: focused ? 'book' : 'book-outline',
          AccountTab: focused ? 'person' : 'person-outline',
        };
        return (
          <Animatable.View
            animation={focused ? 'pulse' : undefined}
            duration={450}
            useNativeDriver
          >
            <Ionicons name={iconMap[route.name]} size={22} color={color} />
          </Animatable.View>
        );
      },
    })}>
      
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          title: 'Home'  // This changes the display name
        }} 
      />
      
      <Tab.Screen 
        name="CategoriesTab" 
        component={CategoryList} 
        options={{ 
          title: 'Categories'  // This changes the display name
        }} 
      />
      
      <Tab.Screen 
        name="MagazinesTab" 
        component={MagazinesScreen} 
        options={{ 
          title: 'Magazines'  // This changes the display name
        }} 
      />
      
      {/* <Tab.Screen 
        name="AccountTab" 
        component={isLoggedIn ? DashboardScreen : SignIn}
        options={{ 
          title: isLoggedIn ? 'Dashboard' : 'Sign In'  // Dynamic display name
        }} 
      /> */}
      
    </Tab.Navigator>
  );
}