import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../store/hooks/useTheme';

const ListSkeleton = () => {
  const { colors, isDark } = useTheme();

  const skeletonColor = isDark ? colors.border : '#f2f2f2';

  const themedStyles = StyleSheet.create({
    skeleton: {
      backgroundColor: skeletonColor,
    },
  });

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map(item => (
        <View key={item} style={styles.card}>
          <View style={[styles.image, themedStyles.skeleton]} />

          <View style={styles.textBlock}>
            <View style={[styles.category, themedStyles.skeleton]} />

            <View style={[styles.title, themedStyles.skeleton]} />

            <View style={[styles.titleShort, themedStyles.skeleton]} />

            <View style={[styles.date, themedStyles.skeleton]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },

  card: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  image: {
    width: 110,
    height: 80,
    borderRadius: 8,
  },

  textBlock: {
    flex: 1,
    marginLeft: 10,
  },

  category: {
    width: '40%',
    height: 10,
    marginBottom: 6,
  },

  title: {
    width: '90%',
    height: 12,
    marginBottom: 6,
  },

  titleShort: {
    width: '70%',
    height: 12,
    marginBottom: 6,
  },

  date: {
    width: '30%',
    height: 10,
    marginTop: 4,
  },
});

export default ListSkeleton;
