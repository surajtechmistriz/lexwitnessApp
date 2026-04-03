import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Banner from '../common/DynamicBanner';
import RegisterPopup from '../../modal/RegisterPopup';

// Add renderFilter to the props interface
interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  renderFilter?: (close: () => void) => React.ReactNode; // ✅
  showFilter?: boolean
}

const MainLayout = ({ children, title, renderFilter, showFilter = true }: MainLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Pass renderFilter down to the Banner */}
      <Banner title={title} renderFilter={renderFilter} showFilter={showFilter}/>

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