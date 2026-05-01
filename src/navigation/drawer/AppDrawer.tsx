import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from '../BotttomTabs/BottomTabs';
// import Subscription from '../../features/auth/screens/Subscription';
// import Register from '../../features/auth/screens/Register';
import CustomDrawer from '../../components/common/CustomDrawer';
import Subscription from '../../screens/auth/screens/Subscription';
import Register from '../../screens/auth/screens/Register';
import SignIn from '../../screens/auth/screens/SignIn';
import MagazinesScreen from '../../screens/magazines/MagazinesScreen';

// GLOBAL SCREENS
// import ArticleDetailPage from '../../features/article/ArticleScreen';
// import AuthorScreen from '../../features/author/AuthorScreen';
// import EditorialDetail from '../../features/editorial/EditorialDetail';
// import MagazineDetailScreen from '../../features/magazines/MagazineDetailScreen';
// import SignIn from '../../features/auth/screens/SignIn';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

//  STACK INSIDE DRAWER
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};
const AppDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={MainStack} />
      <Drawer.Screen name="Subscription" component={Subscription} />
      <Drawer.Screen name="Register" component={Register} />
       <Drawer.Screen name="SignIn" component={SignIn} />
       <Drawer.Screen name="Magazines" component={MagazinesScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;