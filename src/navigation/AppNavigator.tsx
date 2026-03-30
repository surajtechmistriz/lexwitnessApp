import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../features/home/HomeScreen';
import Register from '../features/auth/screens/Register';
import SignInScreen from '../features/auth/screens/SignIn';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import CategoryScreen from '../features/category/CategoryScreen';
import ArticleDetail from '../features/article/ArticleScreen';
import AuthorScreen from '../features/author/AuthorScreen';
import ArchiveScreen from '../features/archive/ArchiveScreen';
import SubscriptionPage from '../features/auth/screens/Subscription';
import FirstTimePopup from '../modal/RegisterPopup';
import NoInternetPopup from '../modal/NoInternetPopup';
import RegisterPopup from '../modal/RegisterPopup';
import TopMenu from '../components/common/Menubar';
import Header from '../components/common/Header';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Subscription: undefined;
  SignIn: undefined;
  CategoryScreen: { slug: string }; //  FIXED
  MagazinesScreen: undefined;
  MagazineDetail: { slug: string | number };
  ArticleDetail: { slug: string; category?: string };
   AuthorScreen: {  slug: string};
   Archive: {
    search?: string;
    mode?: string;
    year?: string | number;
    category_id?: string | number;
    author_id?: string | number;
    page?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {

const navigationRef = useNavigationContainerRef();

const [currentRoute, setCurrentRoute] = React.useState('');
const [currentParams, setCurrentParams] = React.useState<any>({});
  return (
 <NavigationContainer
  ref={navigationRef}
  onStateChange={() => {
    const route = navigationRef.getCurrentRoute();
    setCurrentRoute(route?.name || '');
    setCurrentParams(route?.params || {});
  }}
>
      <Header />
       <TopMenu
    activeRoute={currentRoute}
    activeSlug={currentParams?.slug}   // PASS SLUG
  />

      <RegisterPopup/>
      <NoInternetPopup/>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Subscription" component={SubscriptionPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="MagazinesScreen" component={MagazinesScreen} />
        <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />
        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          options={({ route }: any) => ({
            title: route.params?.slug || 'Category',
          })}
        />
        <Stack.Screen
  name="AuthorScreen"
  component={AuthorScreen}
  options={({ route }: any) => ({
    title: route.params?.author || 'Author',
  })}
/>
<Stack.Screen name='Archive' component={ArchiveScreen}/>
        <Stack.Screen name="ArticleDetail" component={ArticleDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
