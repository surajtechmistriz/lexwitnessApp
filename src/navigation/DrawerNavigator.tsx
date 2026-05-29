import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import BottomTabs from './BottomTabs';

import CustomDrawer from '../components/common/CustomDrawer';
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Drawer.Navigator
        detachInactiveScreens={false}
        screenOptions={{
          header: ({ navigation }) => (
            <Header
              navigation={navigation}
              onSearchPress={() => {
                requestAnimationFrame(() => {
                  setIsSearchVisible(true);
                });
              }}
            />
          ),

          // ✅ MOST STABLE TYPE
          drawerType: 'front',

          // ✅ smoother overlay
          overlayColor: 'rgba(0,0,0,0.20)',

          // ✅ prevents accidental stuck gestures
          swipeEdgeWidth: 30,

          swipeMinDistance: 60,

          swipeEnabled: true,

          // ✅ IMPORTANT FIX
          freezeOnBlur: false,

          lazy: true,

          // ✅ smoother rendering
          sceneContainerStyle: {
            backgroundColor: '#ffffff',
          },

          // ✅ better width
          drawerStyle: {
            width: '82%',
            backgroundColor: '#ffffff',
          },

          // ✅ smoother gestures
          keyboardDismissMode: 'on-drag',
        }}

        drawerContent={props => (
          <CustomDrawer
            key={
              auth.user?.id ||
              auth.user?.email ||
              (auth.isLoggedIn ? 'logged-in' : 'guest')
            }
            {...props}
          />
        )}
      >
        <Drawer.Screen
          name="MainTabs"
          component={BottomTabs}
        />
      </Drawer.Navigator>

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
}