import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import Banner from './components/common/DynamicBanner';
import TopMenu from './components/common/Menubar';

type Props = {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode;
  showFilter?: boolean;
  activeSlug?: string;
  routeName?: string;
  scrollRef?: any;
  onScroll?: (event: any) => void;
};

const MainLayout = ({
  children,
  title,
  renderFilter,
  showFilter = true,
  activeSlug,
  routeName,
  scrollRef,
  onScroll,
}: Props) => {
  const insets = useSafeAreaInsets();

  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]} // 👈 Banner sticky
      >
        {/* Top spacing + TopMenu */}
        <View style={{ paddingTop: insets.top }}>
          {!hiddenTopMenu.includes(routeName || '') && (
            <TopMenu activeSlug={activeSlug} />
          )}
        </View>

        {/* Sticky Banner */}
        <Banner
          title={title}
          renderFilter={renderFilter}
          showFilter={showFilter}
        />

        {/* Page Content */}
        <View style={styles.content}>{children}</View>
      </ScrollView>
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
    paddingBottom: 20,
  },
});