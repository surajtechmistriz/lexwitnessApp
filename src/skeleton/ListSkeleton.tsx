import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../redux/hooks/useTheme';

const ListSkeleton = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map(item => (
        <View key={item} style={styles.card}>
          <View style={[styles.image, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
          <View style={styles.textBlock}>
            <View style={[styles.category, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.title, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
            <View style={[styles.title, { backgroundColor: isDark ? colors.border : '#f2f2f2', width: '70%' }]} />
            <View style={[styles.date, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
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
  date: {
    width: '30%',
    height: 10,
    marginTop: 4,
  },
});

export default ListSkeleton;