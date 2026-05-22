import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
    (state: RootState) => state.auth,
  );

  // const [showPopup, setShowPopup] = useState(false);

  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];


  return (

  <SafeAreaView style={styles.container} edges={['bottom']}>
    
    {/* Top Safe Space */}
    <View style={{ paddingTop: insets.top }}>

      {/* Top Menu */}
      {!hiddenTopMenu.includes(routeName || '') && (
        <TopMenu activeSlug={activeSlug} />
      )}

      {/* Banner */}
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
