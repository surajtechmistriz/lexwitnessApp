import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 36) / 2; // Matches your 2x2 grid logic

const HomeSkeleton = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Hero Carousel Placeholder */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroSkeleton} />
      </View>

      {/* 2. 2x2 Grid Placeholder */}
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.gridCard}>
            <View style={styles.cardImage} />
            <View style={styles.cardCategory} />
            <View style={styles.cardTitle} />
            <View style={[styles.cardTitle, { width: '60%' }]} />
            <View style={styles.cardDate} />
          </View>
        ))}
      </View>

      {/* 3. Gray Ad Section Placeholder */}
      <View style={styles.graySectionPlaceholder}>
        <View style={styles.adBox} />
      </View>

      {/* 4. Editor Picks Placeholder (Horizontal) */}
      <View style={styles.sectionHeader} />
      <View style={styles.horizontalRow}>
        {[1, 2].map((item) => (
          <View key={item} style={styles.horizontalCard} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    marginBottom: 10,
  },
  cardCategory: {
    width: '40%',
    height: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  cardTitle: {
    width: '90%',
    height: 14,
    backgroundColor: '#f2f2f2',
    marginBottom: 6,
  },
  cardDate: {
    width: '30%',
    height: 10,
    backgroundColor: '#f2f2f2',
    marginTop: 5,
  },
  graySectionPlaceholder: {
    backgroundColor: '#f8f8f8',
    height: 200,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  adBox: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  sectionHeader: {
    width: 150,
    height: 20,
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#f2f2f2',
    marginRight: 15,
    borderRadius: 8,
  },
});

export default HomeSkeleton;