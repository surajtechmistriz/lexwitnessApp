import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from '../../BotttomTabs/BottomTabs';
import Subscription from '../../features/auth/screens/Subscription';
// import ProfileScreen from '../../features/profile/ProfileScreen';
import CustomDrawer from './CustomDrawer';
import Register from '../../features/auth/screens/Register';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ 
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          borderRadius: 0, 
        }
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
      <Drawer.Screen name="Subscription" component={Subscription} />
      <Drawer.Screen name="Register" component={Register} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;