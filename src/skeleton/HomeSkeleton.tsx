import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../redux/useTheme';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 36) / 2; // Matches your 2x2 grid logic

const HomeSkeleton = () => {
  const { colors, isDark } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* 1. Hero Carousel Placeholder */}
      <View style={styles.heroWrapper}>
        <View style={[styles.heroSkeleton, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
      </View>

      {/* 2. 2x2 Grid Placeholder */}
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.gridCard}>
            <View style={[styles.cardImage, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.cardCategory, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.cardTitle, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.cardTitle, { backgroundColor: isDark ? colors.border : '#f2f2f2', width: '60%' }]} />
            <View style={[styles.cardDate, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
          </View>
        ))}
      </View>

      {/* 3. Gray Ad Section Placeholder */}
      <View style={[styles.graySectionPlaceholder, { backgroundColor: isDark ? colors.border : '#f8f8f8' }]}>
        <View style={[styles.adBox, { backgroundColor: isDark ? colors.card : '#e0e0e0' }]} />
      </View>

      {/* 4. Editor Picks Placeholder (Horizontal) */}
      <View style={[styles.sectionHeader, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
      <View style={styles.horizontalRow}>
        {[1, 2].map((item) => (
          <View key={item} style={[styles.horizontalCard, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  heroSkeleton: {
    width: '100%',
    height: 280,
    borderRadius: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 4,
    marginBottom: 10,
  },
  cardCategory: {
    width: '40%',
    height: 10,
    marginBottom: 8,
  },
  cardTitle: {
    width: '90%',
    height: 14,
    marginBottom: 6,
  },
  cardDate: {
    width: '30%',
    height: 10,
    marginTop: 5,
  },
  graySectionPlaceholder: {
    height: 200,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  adBox: {
    width: '100%',
    height: 150,
  },
  sectionHeader: {
    width: 150,
    height: 20,
    marginHorizontal: 12,
    marginTop: 20,
    marginBottom: 15,
  },
  horizontalRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  horizontalCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 15,
    borderRadius: 8,
  },
});

export default HomeSkeleton;