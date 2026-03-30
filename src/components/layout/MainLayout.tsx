import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Banner from '../common/DynamicBanner';

const MainLayout = ({ children, title }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Only Banner stays */}
      <Banner title={title} />

      <View style={styles.content}>
        {children}
      </View>

    </SafeAreaView>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});