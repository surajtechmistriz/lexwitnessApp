import React from 'react';
import { StyleSheet, View } from 'react-native';

import Banner from './components/common/DynamicBanner';
import TopMenu from './components/common/Menubar';

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
  const hiddenTopMenu = [
    'Magazines',
    'Subscription',
    'Register',
    'SignIn',
    'Archive',
  ];

  const hiddenBanner = [
  'Register',
  'SignIn',
];

  return (
    <View style={styles.container}>
      {!hiddenTopMenu.includes(routeName || '') && (
        <TopMenu activeSlug={activeSlug} />
      )}

   {!hiddenBanner.includes(routeName || '') && (
  <Banner
    title={title}
    renderFilter={renderFilter}
    showFilter={showFilter}
  />
)}

      <View style={styles.content}>
        {children}
      </View>
    </View>
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