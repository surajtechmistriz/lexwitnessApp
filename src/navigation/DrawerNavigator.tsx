import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import BottomTabs from './BottomTabs';
import CustomDrawer from '../components/layout/CustomDrawer';
import DashboardScreen from '../features/dashboard/DashboardScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
        overlayColor: 'rgba(0,0,0,0.2)',
        drawerStyle: styles.drawer,
        sceneStyle: styles.sceneContainer,
        keyboardDismissMode: 'on-drag',
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: '82%',
    backgroundColor: '#fff',
  },
  sceneContainer: {
    backgroundColor: '#fff',
  },
});