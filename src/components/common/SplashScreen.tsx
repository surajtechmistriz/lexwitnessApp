// components/common/SplashScreen.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Optional logo */}
      <Image
        source={require('../../assets/main-logo (2).png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActivityIndicator size="large" color="#c9060a" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 240,
    height: 150,
    marginBottom: 20,
  },
});