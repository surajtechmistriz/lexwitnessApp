import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStack from './stacks/HomeStack';
import { MagazineStack } from './stacks/MagazineStack';
import CategoryList from '../components/common/CategoryList';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isTablet = width >= 768;

  // ✅ Responsive sizes
  const TAB_HEIGHT = isTablet ? 70 : 60;
  const ICON_SIZE = isTablet ? 26 : 22;
  const LABEL_SIZE = isTablet ? 13 : 11;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#c9060a',
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          height: TAB_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#eee',

          // subtle shadow
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
            },
            android: {
              elevation: 8,
            },
          }),
        },

        tabBarLabelStyle: {
          fontSize: LABEL_SIZE,
          fontWeight: '600',
          marginBottom: 2,
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
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

          return <Ionicons name={iconName} size={ICON_SIZE} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Categories" component={CategoryList} />
      <Tab.Screen name="Magazines" component={MagazineStack} />
    </Tab.Navigator>
  );
}