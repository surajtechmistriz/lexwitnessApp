import React, { useEffect, useState } from 'react';
import Banner from '../common/DynamicBanner';
import TopMenu from '../common/Menubar';
import AuthPopup from '../../modal/AuthPopup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode;
  showFilter?: boolean;
  activeSlug?: string;
  routeName?: string;
};

const MainLayout = ({
  children,
  title,
  renderFilter,
  showFilter = true,
  activeSlug,
  routeName,
}: Props) => {
  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPopup, setShowPopup] = useState(false);

  // Screens where the TopMenu is hidden
  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];

  // ✅ FIX: Added 'Subscription' here to prevent the popup from appearing
  // while the user is trying to pay/choose a plan.
  const disablePopupScreens = ['Register', 'SignIn', 'Subscription'];

  const shouldShowPopup =
    !isLoggedIn && !disablePopupScreens.includes(routeName || '');

  useEffect(() => {
    // 1. If we aren't hydrated yet, do nothing
    if (!isHydrated) return;

    // 2. If we navigate TO a disabled screen, kill any existing popup immediately
    if (disablePopupScreens.includes(routeName || '')) {
      setShowPopup(false);
      return;
    }

    // 3. Trigger popup logic only if allowed
    if (shouldShowPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 800); // Increased slightly for better UX after screen transition

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isHydrated, isLoggedIn, routeName]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // If route is in hiddenTopMenu, Banner is sticky [0], otherwise TopMenu is sticky [1]
        stickyHeaderIndices={
          hiddenTopMenu.includes(routeName || '') ? [0] : [1]
        }
      >
        {/* Top Menu Section */}
        {!hiddenTopMenu.includes(routeName || '') && (
          <View>
            <TopMenu activeSlug={activeSlug} />
          </View>
        )}

        {/* Banner Section */}
        <View>
          <Banner
            title={title}
            renderFilter={renderFilter}
            showFilter={showFilter}
          />
        </View>

        {/* Page Content */}
        <View style={styles.content}>{children}</View>
      </ScrollView>

      {/* Global Auth Popup */}
      <AuthPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </SafeAreaView>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});