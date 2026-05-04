import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeStack from './stacks/HomeStack';
import { MagazineStack } from './stacks/MagazineStack';
import CategoryList from '../components/common/CategoryList';



const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#c9060a',
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          height: 50,
          paddingBottom: 5,
          backgroundColor: '#fff',
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Magazines') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
    <Tab.Screen name="Home" component={HomeStack} />
<Tab.Screen name="Categories" component={CategoryList} />
<Tab.Screen name="Magazines" component={MagazineStack} />

    </Tab.Navigator>
  );
}