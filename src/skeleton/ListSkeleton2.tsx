import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../redux/hooks/useTheme';

const { height } = Dimensions.get('window');

const ListSkeleton = () => {
  const { colors, isDark } = useTheme();

  const skeletonColor = isDark ? colors.border : '#f2f2f2';

  return (
    <View style={styles.container}>
      {Array.from({ length: 8 }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View
            style={[
              styles.image,
              { backgroundColor: skeletonColor },
            ]}
          />

          <View style={styles.content}>
            <View
              style={[
                styles.category,
                { backgroundColor: skeletonColor },
              ]}
            />

            <View
              style={[
                styles.title,
                { backgroundColor: skeletonColor },
              ]}
            />

            <View
              style={[
                styles.titleSmall,
                { backgroundColor: skeletonColor },
              ]}
            />

            <View
              style={[
                styles.date,
                { backgroundColor: skeletonColor },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: height, // Takes the full mobile screen
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 90,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  category: {
    width: 70,
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  title: {
    width: '95%',
    height: 14,
    borderRadius: 6,
    marginBottom: 8,
  },
  titleSmall: {
    width: '75%',
    height: 14,
    borderRadius: 6,
    marginBottom: 12,
  },
  date: {
    width: 90,
    height: 10,
    borderRadius: 5,
  },
});

export default ListSkeleton;