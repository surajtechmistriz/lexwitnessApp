import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../store/hooks/useTheme';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 36) / 2;

const HomeSkeleton = () => {
  const { colors, isDark } = useTheme();

  const skeletonColor = isDark ? colors.border : '#f2f2f2';
  const sectionColor = isDark ? colors.border : '#f8f8f8';
  const adColor = isDark ? colors.card : '#e0e0e0';

  const themedStyles = {
    container: {
      backgroundColor: colors.background,
    },
    skeleton: {
      backgroundColor: skeletonColor,
    },
    cardTitleShort: {
      backgroundColor: skeletonColor,
      width: '60%' as const,
    },
    graySectionPlaceholder: {
      backgroundColor: sectionColor,
    },
    adBox: {
      backgroundColor: adColor,
    },
  };

  return (
    <ScrollView
      style={[styles.container, themedStyles.container]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Hero Carousel Placeholder */}
      <View style={styles.heroWrapper}>
        <View style={[styles.heroSkeleton, themedStyles.skeleton]} />
      </View>

      {/* 2. 2x2 Grid Placeholder */}
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.gridCard}>
            <View style={[styles.cardImage, themedStyles.skeleton]} />
            <View style={[styles.cardCategory, themedStyles.skeleton]} />
            <View style={[styles.cardTitle, themedStyles.skeleton]} />
            <View style={[styles.cardTitle, themedStyles.cardTitleShort]} />
            <View style={[styles.cardDate, themedStyles.skeleton]} />
          </View>
        ))}
      </View>

      {/* 3. Gray Ad Section Placeholder */}
      <View
        style={[
          styles.graySectionPlaceholder,
          themedStyles.graySectionPlaceholder,
        ]}
      >
        <View style={[styles.adBox, themedStyles.adBox]} />
      </View>

      {/* 4. Editor Picks Placeholder (Horizontal) */}
      <View style={[styles.sectionHeader, themedStyles.skeleton]} />

      <View style={styles.horizontalRow}>
        {[1, 2].map(item => (
          <View
            key={item}
            style={[styles.horizontalCard, themedStyles.skeleton]}
          />
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
