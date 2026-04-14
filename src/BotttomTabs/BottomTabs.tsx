import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MainStack } from '../navigation/MainStack';
import CategoryList from '../components/common/CategoryList';
import { MagazineStack } from '../navigation/MagazineStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#c9060a',
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          position: 'absolute',
          backgroundColor: '#fff',
          elevation: 12,
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CategoriesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Magazines') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >

      <Tab.Screen name="HomeTab" component={MainStack} />
      <Tab.Screen name="CategoriesTab" component={CategoryList} />
      <Tab.Screen name="Magazines" component={MagazineStack} />

      {/* TEMP PROFILE */}
      <Tab.Screen
        name="ProfileTab"
        component={() => null}
        options={{ title: 'Profile' }}
      />

    </Tab.Navigator>
  );
};

export default BottomTabs;