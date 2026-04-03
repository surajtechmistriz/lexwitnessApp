import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ArticleSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonRow}>
        {/* Left: Square Thumbnail */}
        <View style={styles.skeletonImageThumb} />

        {/* Right: Text Content */}
        <View style={styles.skeletonTextContent}>
          <View style={styles.skeletonTitleLine} />
          <View style={[styles.skeletonTitleLine, { width: '70%' }]} />
          
          <View style={styles.skeletonMetaRow}>
            <View style={styles.skeletonAuthor} />
            <View style={styles.skeletonDivider} />
            <View style={styles.skeletonDateSmall} />
          </View>

          <View style={styles.skeletonReadMore} />
        </View>
      </View>
      {/* Dashed Separator */}
      <View style={styles.skeletonSeparator} />
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
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
  },
  skeletonTextContent: {
    flex: 1,
    marginLeft: 15,
  },
  skeletonTitleLine: {
    height: 14,
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#f2f2f2',
  },
  skeletonDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  skeletonDateSmall: {
    height: 10,
    width: 80,
    backgroundColor: '#f2f2f2',
  },
  skeletonReadMore: {
    height: 12,
    width: 70,
    backgroundColor: '#f2f2f2',
    marginTop: 15,
  },
  skeletonSeparator: {
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
});

export default ArticleSkeleton;