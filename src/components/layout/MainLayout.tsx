import React from 'react';
import Banner from '../common/DynamicBanner';
import TopMenu from '../common/Menubar';
import AuthPopup from '../../modal/AuthPopup';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode;
  showFilter?: boolean;
  activeSlug?: string;
  routeName?: string;
}

const MainLayout = ({
  children,
  title,
  renderFilter,
  showFilter = true,
  activeSlug,
  routeName,
}: MainLayoutProps) => {
  const { isLoggedIn } = useAuth();

  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];

  const disablePopupScreens = ['Register', 'SignIn'];

  const shouldShowPopup =
    !isLoggedIn && !disablePopupScreens.includes(routeName || '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={hiddenTopMenu.includes(routeName || '') ? [0] : [1]}
      >
        {/* Top Menu */}
        <View>
          {!hiddenTopMenu.includes(routeName || '') && (
            <TopMenu activeSlug={activeSlug} />
          )}
        </View>

        {/* Banner */}
        <View>
          <Banner
            title={title}
            renderFilter={renderFilter}
            showFilter={showFilter}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </ScrollView>

      {/* Auth Popup */}
      {shouldShowPopup && (
        <AuthPopup visible={true} mode="register" />
      )}
    </SafeAreaView>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});