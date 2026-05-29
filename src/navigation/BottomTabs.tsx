import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import HomeStack from './stacks/HomeStack';
import { MagazineStack } from './stacks/MagazineStack';
import CategoryList from '../components/common/CategoryList';
import AuthStack from './stacks/AuthStack';

import DashboardScreen from '../screens/dashboard/DashboardScreen';

import { RootState } from '../redux/store';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // ✅ PERFORMANCE
        lazy: true,
        detachInactiveScreens: true,
        freezeOnBlur: false,

        // ✅ TAB SETTINGS
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: '#c9060a',
        tabBarInactiveTintColor: '#999',

        // ✅ SMOOTH TAB ANIMATION
        animation: 'shift',

        // ✅ TAB BAR DESIGN
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 82 : 62,

          paddingBottom:
            Platform.OS === 'ios' ? 18 : 6,

          paddingTop: 6,

          borderTopWidth: 0,

          elevation: 8,

          backgroundColor: '#ffffff',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },

        // ✅ ICONS
        tabBarIcon: ({ color, focused }) => {
          let icon = 'home-outline';

          if (route.name === 'HomeTab') {
            icon = focused
              ? 'home'
              : 'home-outline';
          } else if (
            route.name === 'CategoriesTab'
          ) {
            icon = focused
              ? 'grid'
              : 'grid-outline';
          } else if (
            route.name === 'MagazinesTab'
          ) {
            icon = focused
              ? 'book'
              : 'book-outline';
          } else if (
            route.name === 'AccountTab'
          ) {
            icon = focused
              ? 'person'
              : 'person-outline';
          }

          return (
            <Animatable.View
              animation={
                focused ? 'pulse' : undefined
              }
              duration={250}
              useNativeDriver
            >
              <Ionicons
                name={icon}
                size={22}
                color={color}
              />
            </Animatable.View>
          );
        },
      })}
    >
      {/* HOME */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeTab',
                },
              ],
            });
          },
        })}
      />

      {/* CATEGORIES */}
      <Tab.Screen
        name="CategoriesTab"
        component={CategoryList}
        options={{ title: 'Categories' }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.jumpTo(
              'CategoriesTab',
            );
          },
        })}
      />

      {/* MAGAZINES */}
      <Tab.Screen
        name="MagazinesTab"
        component={MagazineStack}
        options={{ title: 'Magazines' }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            navigation.jumpTo(
              'MagazinesTab',
            );
          },
        })}
      />

      {/* ACCOUNT */}
      <Tab.Screen
        name="AccountTab"
        component={
          isLoggedIn
            ? DashboardScreen
            : AuthStack
        }
        options={{
          title: isLoggedIn
            ? 'Dashboard'
            : 'Sign In',
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            if (isLoggedIn) {
              navigation.jumpTo(
                'AccountTab',
              );
            } else {
              navigation.navigate(
                'AccountTab',
                {
                  screen: 'SignIn',
                },
              );
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}