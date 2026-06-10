import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

import BottomTabs from './BottomTabs';

import CustomDrawer from '../components/common/CustomDrawer';
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';

import { RootState } from '../redux/store';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          header: ({ navigation }) => (
            <Header
              navigation={navigation}
              onSearchPress={() => setIsSearchVisible(true)}
            />
          ),

          drawerType: 'front',
          swipeEnabled: true,

          overlayColor: 'rgba(0,0,0,0.2)',

          drawerStyle: {
            width: '82%',
            backgroundColor: '#fff',
          },

          sceneContainerStyle: {
            backgroundColor: '#fff',
          },

          keyboardDismissMode: 'on-drag',
        }}
        drawerContent={props => (
          <CustomDrawer
            {...props}
            key={
              auth.user?.id ||
              auth.user?.email ||
              (auth.isLoggedIn ? 'logged-in' : 'guest')
            }
          />
        )}
      >
        <Drawer.Screen name="MainTabs" component={BottomTabs} />
      </Drawer.Navigator>

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
}
