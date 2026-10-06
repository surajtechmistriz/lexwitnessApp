import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../store/hooks/useTheme';

const ArticleSkeleton = () => {
  const { colors, isDark } = useTheme();

  const skeletonColor = isDark ? colors.border : '#f2f2f2';
  const dividerColor = isDark ? colors.border : '#ddd';
  const separatorColor = isDark ? colors.border : '#eee';

  const themedStyles = StyleSheet.create({
    skeleton: {
      backgroundColor: skeletonColor,
    },
    divider: {
      backgroundColor: dividerColor,
    },
    separator: {
      borderColor: separatorColor,
    },
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonRow}>
        {/* Left: Square Thumbnail */}
        <View style={[styles.skeletonImageThumb, themedStyles.skeleton]} />

        {/* Right: Text Content */}
        <View style={styles.skeletonTextContent}>
          <View style={[styles.skeletonTitleLine, themedStyles.skeleton]} />

          <View
            style={[styles.skeletonTitleLineShort, themedStyles.skeleton]}
          />

          <View style={styles.skeletonMetaRow}>
            <View style={[styles.skeletonAuthor, themedStyles.skeleton]} />

            <View style={[styles.skeletonDivider, themedStyles.divider]} />

            <View style={[styles.skeletonDateSmall, themedStyles.skeleton]} />
          </View>

          <View style={[styles.skeletonReadMore, themedStyles.skeleton]} />
        </View>
      </View>

      {/* Dashed Separator */}
      <View style={[styles.skeletonSeparator, themedStyles.separator]} />
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

  skeletonTitleLineShort: {
    width: '70%',
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
