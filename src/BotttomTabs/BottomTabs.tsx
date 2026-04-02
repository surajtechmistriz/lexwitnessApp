import React, { useRef } from 'react';
import { Animated, View } from 'react-native';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../features/home/HomeScreen';
import MagazinesScreen from '../features/magazines/MagazinesScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ onSearchPress }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  const hideTabBar = () => {
    if (isHidden.current) return;

    isHidden.current = true;

    Animated.timing(translateY, {
      toValue: 80,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const showTabBar = () => {
    if (!isHidden.current) return;

    isHidden.current = false;

    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',

        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          position: 'absolute',
          backgroundColor: '#fff',

          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: 20,

          elevation: 12,

          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MagazinesTab') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
      // ✅ ANIMATED TAB BAR
      tabBar={props => (
        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
        >
          <BottomTabBar {...props} />
        </Animated.View>
      )}
    >
      {/* HOME */}
      <Tab.Screen name="HomeTab" options={{ title: 'Home' }}>
        {props => (
          <Home {...props} onScrollDown={hideTabBar} onScrollUp={showTabBar} />
        )}
      </Tab.Screen>

      {/* SEARCH */}
      <Tab.Screen
        name="SearchTab"
        component={View} // Use a dummy View because the listener prevents navigation anyway
        options={{ title: 'Search' }}
        listeners={{
          tabPress: e => {
            // 1. Prevent the default action (actually switching to a search screen)
            e.preventDefault();

            // 2. Trigger the overlay
            if (onSearchPress) {
              onSearchPress();
            }
          },
        }}
      />

      {/* MAGAZINES */}
      {/* Replace your current Magazines Tab with this */}
      <Tab.Screen name="MagazinesTab" options={{ title: 'Magazines' }}>
        {props => (
          <MagazinesScreen
            {...props}
            onScrollDown={hideTabBar}
            onScrollUp={showTabBar}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabs;
