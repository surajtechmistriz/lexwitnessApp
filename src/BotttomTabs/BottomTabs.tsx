import React, { useRef } from 'react';
import { Animated, View } from 'react-native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your stack
import { MainStack } from './MainStack';

import MagazinesScreen from '../features/magazines/MagazinesScreen';
import CategoryList from '../components/common/CategoryList';
import TabBarContext from './TabBarContext';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { MagazineStack } from './MagazineStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
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
      <TabBarContext.Provider value={{ hideTabBar, showTabBar }}>
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
          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: 20,
          elevation: 12,
        },
      tabBarIcon: ({ color, focused }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';

  let iconName = 'home-outline';

  if (route.name === 'HomeTab') {
    const isInnerScreen = routeName && routeName !== 'Home';

    iconName =
      focused && !isInnerScreen ? 'home' : 'home-outline';
  } else if (route.name === 'CategoriesTab') {
    iconName = focused ? 'grid' : 'grid-outline';
  } else if (route.name === 'MagazineScreen') {
    iconName = focused ? 'book' : 'book-outline';
  } else if (route.name === 'ProfileTab') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName} size={22} color={color} />;
}
      })}
      tabBar={(props) => (
        <Animated.View style={{ transform: [{ translateY }] }}>
          <BottomTabBar {...props} />
        </Animated.View>
      )}
    >
      {/*  Stack inside tab */}
      <Tab.Screen name="HomeTab" options={{ title: 'Home' }}>
        {(props) => (
          <MainStack
            {...props}
            onScrollDown={hideTabBar}
            onScrollUp={showTabBar}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="CategoriesTab"
        component={CategoryList}
        options={{ title: 'Categories' }}
      />

      <Tab.Screen name="MagazineScreen" options={{ title: 'Magazines' }}>
  {(props) => (
    <MagazineStack
      {...props}
      onScrollDown={hideTabBar}
      onScrollUp={showTabBar}
    />
  )}
</Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        component={View}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
    </TabBarContext.Provider>
  );
};

export default BottomTabs;