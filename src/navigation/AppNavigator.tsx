import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Register from '../features/auth/screens/Register';
import SignInScreen from '../features/auth/screens/SignIn';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import CategoryScreen from '../features/category/CategoryScreen';
import ArticleDetail from '../features/article/ArticleScreen';
import AuthorScreen from '../features/author/AuthorScreen';
import ArchiveScreen from '../features/archive/ArchiveScreen';
import SubscriptionPage from '../features/auth/screens/Subscription';
import EditorialDetail from '../features/editorial/EditorialDetail';

// Components
import Header from '../components/common/Header';
import BottomTabs from '../BotttomTabs/BottomTabs';
import SearchOverlay from '../components/common/SearchOverlay';
import RegisterPopup from '../modal/RegisterPopup';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  return (
    <NavigationContainer ref={navigationRef}>
      <Header onSearchPress={() => setIsSearchVisible(true)} />

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      <BottomTabs onSearchPress={() => setIsSearchVisible(true)} />

      <RegisterPopup />
    </NavigationContainer>
  );
};

export default AppNavigator;