import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../redux/hooks/useTheme';

const HeroSkeleton = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.hero, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
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
    borderRadius: 16,
  },
});

export default HeroSkeleton;