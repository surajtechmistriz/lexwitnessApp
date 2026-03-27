import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../features/home/HomeScreen';
import Register from '../features/auth/screens/Register';
import SignInScreen from '../features/auth/screens/SignIn';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import CategoryScreen from '../features/category/CategoryScreen';
import ArticleDetail from '../features/article/ArticleScreen';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  SignIn:undefined;
  CategoryScreen:undefined;
  MagazinesScreen:undefined;
    MagazineDetail: { slug: string | number };
    ArticleDetail: { slug: string; category?:string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SignIn" component = {SignInScreen}/>
        <Stack.Screen name="MagazinesScreen" component={MagazinesScreen}/>
         <Stack.Screen
        name="MagazineDetail"
        component={MagazineDetailScreen}
      />
      <Stack.Screen 
  name="CategoryScreen" 
  component={CategoryScreen} 
  options={({ route }: any) => ({ title: route.params?.slug || 'Category' })} 
/>
<Stack.Screen name='ArticleDetail' component={ArticleDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
