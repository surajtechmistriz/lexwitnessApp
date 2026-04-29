
import React from 'react';
import { View, StyleSheet } from 'react-native';

const HeroSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.hero} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
  },
});

export default HeroSkeleton;