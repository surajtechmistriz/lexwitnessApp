// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import { useResponsive } from '../hooks/useResponsive';

// Screens
import CategoryList from '../components/common/CategoryList';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import HomeScreen from '../features/home/HomeScreen';
import { useTheme } from '../store/hooks/useTheme';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { colors, isDark } = useTheme();
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  //  Calculate tab bar height with safe area
  const tabBarHeight = isTablet ? 60 : 55;
  const bottomPadding = Platform.OS === 'android' ? insets.bottom : 0;
  const totalHeight = tabBarHeight + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.textMuted : '#999',

        //  Fixed tab bar style
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: totalHeight,
          paddingBottom: bottomPadding,
          paddingTop: 4,
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: colors.card,

          // Shadow
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },

        tabBarLabelStyle: {
          fontSize: isTablet ? 12 : 10,
          fontWeight: '600' as const,
          marginBottom: 2,
          color: isDark ? colors.text : undefined,
        },

        tabBarHideOnKeyboard: true,

        tabBarIcon: ({ color, focused }) => {
          const iconMap: Record<string, string> = {
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
              <Ionicons
                name={iconMap[route.name]}
                size={isTablet ? 24 : 22}
                color={color}
              />
            </Animatable.View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />

      <Tab.Screen
        name="CategoriesTab"
        component={CategoryList}
        options={{ title: 'Categories' }}
      />

      <Tab.Screen
        name="MagazinesTab"
        component={MagazinesScreen}
        options={{ title: 'Magazines' }}
      />

      {/* Uncomment when ready
      <Tab.Screen
        name="AccountTab"
        component={isLoggedIn ? DashboardScreen : SignIn}
        options={{
          title: isLoggedIn ? 'Dashboard' : 'Sign In',
        }}
      />
      */}
    </Tab.Navigator>
  );
}
