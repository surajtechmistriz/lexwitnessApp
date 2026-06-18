import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import Banner from './components/common/DynamicBanner';
import TopMenu from './components/common/Menubar';
import Header from './components/common/Header';
import SearchOverlay from './components/common/SearchOverlay';

type Props = {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode;
  showFilter?: boolean;
  activeSlug?: string;
  routeName?: string;
  showHeader?: boolean;
  showTopMenu?: boolean;
  showBanner?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const MainLayout = ({
  children,
  title,
  renderFilter,
  showFilter = true,
  activeSlug,
  routeName,
  showHeader = true,
  showTopMenu = true,
  showBanner = true,
  showBackButton = false,
  onBackPress,
}: Props) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  // Screens where TopMenu should be hidden
  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
    'ArticleDetail',
    'MagazineDetail',
    // 'Category',  // REMOVED - Show TopMenu on Category
    // 'Author',    // REMOVED - Show TopMenu on Author
    'Tag',
    'EditorialDetail',
    'InvoiceScreen',
  ];

  // Screens where Banner should be hidden
  const hiddenBanner = [
    'Register',
    'SignIn',
    'ArticleDetail',
    'MagazineDetail',
    // 'Category',  // REMOVED - Show Banner on Category
    // 'Author',    // REMOVED - Show Banner on Author
    'Tag',
    'EditorialDetail',
    'InvoiceScreen',
  ];

  // Screens where Header should be hidden
  const hiddenHeader = [
    'Register',
    'SignIn',
    'Author',      // Hide Header on Author
    'Category',    // Hide Header on Category
    'Magazines',   // Hide Header on Magazines
    'Archive',   // Hide Header on Archive
    'Tag',
    'ArticleDetail',
    'MagazineDetail',
    'EditorialDetail',
  ];

  // Screens where back button should be shown
  const backButtonScreens = [
    'Magazines',
    'Category',
    'Author',
    'Tag',
    'MagazineDetail',
    'ArticleDetail',
    'EditorialDetail',
  ];

  // Determine if back button should be shown based on route or prop
  const shouldShowBackButton = showBackButton || backButtonScreens.includes(routeName || '');

  // Handle back press - use provided handler or default navigation.goBack()
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />

      {/* HEADER - Hide on Author, Category, Magazines, etc. */}
      {!hiddenHeader.includes(routeName || '') && showHeader && (
        <Header 
          navigation={navigation} 
          onSearchPress={() => setIsSearchVisible(true)}
        />
      )}

      {/* BANNER - Show on Author and Category (not hidden) */}
      {!hiddenBanner.includes(routeName || '') && showBanner && (
        <Banner
          title={title}
          renderFilter={renderFilter}
          showFilter={showFilter}
          showBackButton={shouldShowBackButton}
          onBackPress={handleBackPress}
        />
      )}

      {/* TOP MENU - Show on Author and Category (not hidden) */}
      {!hiddenTopMenu.includes(routeName || '') && showTopMenu && (
        <TopMenu activeSlug={activeSlug} />
      )}


      {/* CONTENT */}
      <View style={styles.content}>
        {children}
      </View>

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </SafeAreaView>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
});