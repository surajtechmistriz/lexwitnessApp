import React, { useRef } from 'react';
// import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Banner from '../common/DynamicBanner';
import TopMenu from '../common/Menubar';
import AuthPopup from '../../modal/AuthPopup';
import { useAuth } from '../../context/AuthContext';
import { useTabBar } from '../../BotttomTabs/TabBarContext';
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
  const { hideTabBar, showTabBar } = useTabBar();

  const scrollOffset = useRef(0);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;

    if (currentOffset <= 0) {
      showTabBar();
    } else if (diff > 10) {
      hideTabBar();
    } else if (diff < -10) {
      showTabBar();
    }

    scrollOffset.current = currentOffset;
  };

  const hiddenTopMenu = ['Magazines', 'Subscription', 'Register', 'SignIn', 'Archive'];
  const disablePopupScreens = ['Register', 'SignIn'];

  const shouldShowPopup =
    !isLoggedIn && !disablePopupScreens.includes(routeName || '');

  return (
  <SafeAreaView style={styles.container}>
  <ScrollView
    stickyHeaderIndices={hiddenTopMenu.includes(routeName || '') ? [0] : [1]}
    onScroll={handleScroll}
    scrollEventThrottle={16}
    showsVerticalScrollIndicator={false}
  >
    {/* Always render TopMenu wrapper (IMPORTANT) */}
    <View>
      {!hiddenTopMenu.includes(routeName || '') && (
        <TopMenu activeSlug={activeSlug} />
      )}
    </View>

    {/* Banner (sticky) */}
    <View>
      <Banner
        title={title}
        renderFilter={renderFilter}
        showFilter={showFilter}
      />
    </View>

    {/* Content */}
    <View style={styles.content}>
      {children}
    </View>
  </ScrollView>
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