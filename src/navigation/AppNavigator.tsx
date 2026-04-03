import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
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

import Header from '../components/common/Header';
import BottomTabs from '../BotttomTabs/BottomTabs';
import SearchOverlay from '../components/common/SearchOverlay';
import EditorialDetail from '../features/editorial/EditorialDetail';
import RegisterPopup from '../modal/RegisterPopup';

const Stack = createNativeStackNavigator();

//  1. EXPORT THIS REF (Essential for the Popup)
export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  return (
    //  2. ATTACH THE REF HERE
    <NavigationContainer ref={navigationRef}>
      {/*  GLOBAL HEADER */}
      <Header onSearchPress={() => setIsSearchVisible(true)} />

      {/*  GLOBAL SEARCH */}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {/*  NAVIGATOR */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab">
          {props => (
            <BottomTabs
              {...props}
              onSearchPress={() => setIsSearchVisible(true)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Subscription" component={SubscriptionPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        {/* <Stack.Screen name="MagazinesScreen" component={MagazinesScreen} /> */}
        <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="AuthorScreen" component={AuthorScreen} />
        <Stack.Screen name="Archive" component={ArchiveScreen} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetail} />

        <Stack.Screen
          name="EditorialDetail"
          component={EditorialDetail}
          options={{ title: 'Editorial Profile' }}
        />
      </Stack.Navigator>

      {/*  REGISTER POPUP (Now safe from crashing) */}
      <RegisterPopup />
      
    </NavigationContainer>
  );
};

export default AppNavigator;