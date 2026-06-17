import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import HomeStack from './stacks/HomeStack';
import { MagazineStack } from './stacks/MagazineStack';
import CategoryList from '../components/common/CategoryList';
import AuthStack from './stacks/AuthStack';

import DashboardScreen from '../screens/dashboard/DashboardScreen';

import { RootState } from '../redux/store';

import * as Animatable from 'react-native-animatable';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#c9060a',
        tabBarInactiveTintColor: '#999',

        //  ADD HERE
        tabBarStyle: {
          height: 62,
          paddingBottom: 6,
          paddingTop: 6,
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: '#ffffff',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },

        tabBarHideOnKeyboard: true,

        tabBarIcon: ({ color, focused }) => {
          let icon = 'home-outline';

          if (route.name === 'HomeTab') {
            icon = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CategoriesTab') {
            icon = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'MagazinesTab') {
            icon = focused ? 'book' : 'book-outline';
          } else if (route.name === 'AccountTab') {
            icon = focused ? 'person' : 'person-outline';
          }

          return (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={450}
              useNativeDriver
            >
              <Ionicons name={icon} size={22} color={color} />
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

            navigation.navigate('HomeTab', {
              screen: 'Home',
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

            navigation.navigate('CategoriesTab');
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

            navigation.navigate('MagazinesTab', {
              screen: 'Magazines',
            });
          },
        })}
      />

      {/* PROFILE / ACCOUNT */}
      <Tab.Screen
        name="AccountTab"
        component={isLoggedIn ? DashboardScreen : AuthStack}
        options={{
          title: isLoggedIn ? 'Dashboard' : 'SignIn',
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();

            if (isLoggedIn) {
              navigation.navigate('AccountTab');
            } else {
              navigation.navigate('AccountTab', {
                screen: 'SignIn',
              });
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}
