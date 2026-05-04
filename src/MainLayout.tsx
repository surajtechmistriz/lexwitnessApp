import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import Banner from './components/common/DynamicBanner';
import TopMenu from './components/common/Menubar';
import Popup from './modal/Popup';

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
  const insets = useSafeAreaInsets();

  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPopup, setShowPopup] = useState(false);

  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];

  const disablePopupScreens = ['Register', 'SignIn', 'Subscription'];

  const shouldShowPopup =
    !isLoggedIn && !disablePopupScreens.includes(routeName || '');

  useEffect(() => {
    if (!isHydrated) return;

    if (disablePopupScreens.includes(routeName || '')) {
      setShowPopup(false);
      return;
    }

    if (shouldShowPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isHydrated, isLoggedIn, routeName]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top, // 🔥 KEY FIX (notch safe)
        }}
        stickyHeaderIndices={
          hiddenTopMenu.includes(routeName || '') ? [0] : [1]
        }
      >
        {/* Top Menu */}
        {!hiddenTopMenu.includes(routeName || '') && (
          <View>
            <TopMenu activeSlug={activeSlug} />
          </View>
        )}

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

      {/* Popup */}
      <Popup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </SafeAreaView>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});