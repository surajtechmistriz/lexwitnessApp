import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../store/hooks/useTheme';

const HeroSkeleton = () => {
  const { colors, isDark } = useTheme();

  const bg = isDark ? colors.border : '#ECECEC';
  const line = isDark ? '#555' : '#DADADA';

  return (
    <View style={styles.container}>
      {/* Hero Card */}
      <View style={[styles.hero, { backgroundColor: bg }]}>
        <View style={[styles.category, { backgroundColor: line }]} />

        <View style={styles.bottom}>
          <View style={[styles.title, { backgroundColor: line }]} />
          <View style={[styles.titleSmall, { backgroundColor: line }]} />
          <View style={[styles.date, { backgroundColor: line }]} />
        </View>
      </View>

      {/* Heading */}
      <View style={[styles.heading, { backgroundColor: line }]} />

      {/* Article Skeletons */}
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={styles.article}>
          <View style={styles.left}>
            <View style={[styles.categorySmall, { backgroundColor: line }]} />

            <View style={[styles.text1, { backgroundColor: line }]} />
            <View style={[styles.text2, { backgroundColor: line }]} />

            <View style={[styles.dateSmall, { backgroundColor: line }]} />
          </View>

          <View style={[styles.image, { backgroundColor: line }]} />
        </View>
      ))}
    </View>
  );
};

export default HeroSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 10,
  },

  hero: {
    aspectRatio: 16 / 9,
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  category: {
    width: 130,
    height: 34,
    borderRadius: 20,
  },

  bottom: {},

  title: {
    height: 24,
    width: '95%',
    borderRadius: 6,
    marginBottom: 10,
  },

  titleSmall: {
    height: 24,
    width: '70%',
    borderRadius: 6,
    marginBottom: 14,
  },

  date: {
    width: 120,
    height: 16,
    borderRadius: 6,
  },

  heading: {
    width: 180,
    height: 28,
    borderRadius: 6,
    marginTop: 24,
    marginBottom: 18,
  },

  article: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  left: {
    flex: 1,
    justifyContent: 'center',
  },

  categorySmall: {
    width: 110,
    height: 16,
    borderRadius: 6,
    marginBottom: 14,
  },

  text1: {
    width: '95%',
    height: 18,
    borderRadius: 6,
    marginBottom: 8,
  },

  text2: {
    width: '75%',
    height: 18,
    borderRadius: 6,
    marginBottom: 16,
  },

  dateSmall: {
    width: 110,
    height: 14,
    borderRadius: 6,
  },

  image: {
    width: 110,
    height: 90,
    borderRadius: 14,
    marginLeft: 14,
  },
});
