import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Banner from '../common/DynamicBanner';
import RegisterPopup from '../../modal/RegisterPopup';
import TopMenu from '../common/Menubar';

// Add renderFilter to the props interface
interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode; // 
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

  const hiddenScreens = ['Magazines', 'Subscription', 'Register']; 

  return (
    <SafeAreaView style={styles.container}>
      
     {!hiddenScreens.includes(routeName || '') && (
  <TopMenu activeSlug={activeSlug} />
)}

      <Banner
        title={title}
        renderFilter={renderFilter}
        showFilter={showFilter}
      />

      <View style={styles.content}>
        {children}
        <RegisterPopup />
      </View>

    </SafeAreaView>
  );
};
export default MainLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});