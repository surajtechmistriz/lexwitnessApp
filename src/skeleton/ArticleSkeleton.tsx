import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../redux/hooks/useTheme';

const { width } = Dimensions.get('window');

const ArticleSkeleton = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonRow}>
        {/* Left: Square Thumbnail */}
        <View style={[styles.skeletonImageThumb, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />

        {/* Right: Text Content */}
        <View style={styles.skeletonTextContent}>
          <View style={[styles.skeletonTitleLine, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
          <View style={[styles.skeletonTitleLine, { backgroundColor: isDark ? colors.border : '#f2f2f2', width: '70%' }]} />
          
          <View style={styles.skeletonMetaRow}>
            <View style={[styles.skeletonAuthor, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.skeletonDivider, { backgroundColor: isDark ? colors.border : '#ddd' }]} />
            <View style={[styles.skeletonDateSmall, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
          </View>

          <View style={[styles.skeletonReadMore, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
        </View>
      </View>
      {/* Dashed Separator */}
      <View style={[styles.skeletonSeparator, { borderColor: isDark ? colors.border : '#eee' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 15,
  },
  skeletonRow: {
    flexDirection: 'row',
  },
  skeletonImageThumb: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  skeletonTextContent: {
    flex: 1,
    marginLeft: 15,
  },
  skeletonTitleLine: {
    height: 14,
    marginBottom: 8,
    borderRadius: 2,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  skeletonAuthor: {
    height: 10,
    width: 60,
  },
  skeletonDivider: {
    width: 1,
    height: 10,
    marginHorizontal: 8,
  },
  skeletonDateSmall: {
    height: 10,
    width: 80,
  },
  skeletonReadMore: {
    height: 12,
    width: 70,
    marginTop: 15,
  },
  skeletonSeparator: {
    marginTop: 15,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
});

export default ArticleSkeleton;