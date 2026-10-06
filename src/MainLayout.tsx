import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Banner from './components/common/DynamicBanner';
import SearchOverlay from './components/common/SearchOverlay';
import { useResponsive } from './hooks/useResponsive';
import Header from './components/layout/Header';
import TopMenu from './components/layout/Menubar';
import { useTheme } from './store/hooks/useTheme';

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
  statusBarColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  scrollable?: boolean; // New prop for scrollable content
  contentPadding?: boolean; // New prop for content padding
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
  statusBarColor,
  statusBarStyle,
  scrollable = false,
  contentPadding = true,
}: Props) => {
  const navigation = useNavigation<any>();
  // const route = useRoute<any>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Use your responsive hook
  const { spacing, isTablet, isSmallDevice } = useResponsive();

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
    'Tag',
    'EditorialDetail',
    'InvoiceScreen',
  ];

  // Screens where Header should be hidden
  const hiddenHeader = [
    'Register',
    'SignIn',
    'Subscription',
    'Author',
    'Category',
    'Magazines',
    'Archive',
    'Tag',
    'ArticleDetail',
    'MagazineDetail',
    'EditorialDetail',
  ];

  // Screens where back button should be shown
  const backButtonScreens = [
    'Category',
    'Author',
    'Tag',
    'MagazineDetail',
    'ArticleDetail',
    'EditorialDetail',
  ];

  const shouldShowBackButton =
    showBackButton || backButtonScreens.includes(routeName || '');

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Dynamic status bar color
  // const isHome = routeName === 'Home';

  const resolvedStatusBg = statusBarColor ?? (isDark ? '#c9060a' : '#ffffff');

  const resolvedBarStyle =
    statusBarStyle ?? (isDark ? 'light-content' : 'dark-content');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(resolvedBarStyle);

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(resolvedStatusBg);
        StatusBar.setTranslucent(false);
      }
    }, [resolvedStatusBg, resolvedBarStyle]),
  );

  // Render content with optional ScrollView
  const renderContent = () => {
    const contentStyles = [
      styles.content,
      {
        // backgroundColor: colors.background,
        // paddingHorizontal: contentPadding ? spacing.md : 0,
        // paddingVertical: contentPadding ? spacing.sm : 0,
      },
      // Adjust padding for different devices
      // isTablet && { paddingHorizontal: spacing.lg },
      // isSmallDevice && { paddingHorizontal: spacing.sm },
    ];

    const ContentWrapper = scrollable ? ScrollView : View;
    const contentProps = scrollable
      ? {
          showsVerticalScrollIndicator: false,
          contentContainerStyle: {
            paddingBottom: spacing.xs,
            paddingHorizontal: contentPadding ? spacing.md : 0,
            ...(isTablet && { paddingHorizontal: spacing.lg }),
            ...(isSmallDevice && { paddingHorizontal: spacing.sm }),
          },
        }
      : {};

    return (
      <ContentWrapper style={contentStyles} {...contentProps}>
        {children}
      </ContentWrapper>
    );
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* iOS Status Bar Solid Color Block */}
      {Platform.OS === 'ios' && (
        <View
          style={[
            styles.iosStatusBarPlaceholder,
            {
              height: insets.top,
              backgroundColor: resolvedStatusBg,
            },
          ]}
        />
      )}

      <StatusBar
        backgroundColor={resolvedStatusBg}
        barStyle={resolvedBarStyle}
        translucent={false}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: resolvedStatusBg,
          },
        ]}
        edges={['top']}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          {/* HEADER with responsive styling */}
          {!hiddenHeader.includes(routeName || '') && showHeader && (
            <View>
              <Header
                navigation={navigation}
                onSearchPress={() => setIsSearchVisible(true)}
              />
            </View>
          )}

          {/* BANNER with responsive sizing */}
          {!hiddenBanner.includes(routeName || '') && showBanner && (
            <View>
              <Banner
                title={title}
                renderFilter={renderFilter}
                showFilter={showFilter}
                showBackButton={shouldShowBackButton}
                onBackPress={handleBackPress}
              />
            </View>
          )}

          {/* TOP MENU with responsive styling */}
          {!hiddenTopMenu.includes(routeName || '') && showTopMenu && (
            <View
              style={{
                paddingHorizontal: isTablet ? spacing.lg : spacing.md,
                marginBottom: spacing.xs,
              }}
            >
              <TopMenu activeSlug={activeSlug} />
            </View>
          )}

          {/* CONTENT */}
          {renderContent()}

          {/* SEARCH OVERLAY */}
          <SearchOverlay
            visible={isSearchVisible}
            onClose={() => setIsSearchVisible(false)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MainLayout;

// Responsive styles
// In MainLayout.tsx, make sure there are no negative margins
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // No negative margins here
  },
  safeArea: {
    flex: 1,
    // No negative margins here
  },
  content: {
    flex: 1,
    // No negative margins here
  },
  iosStatusBarPlaceholder: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
