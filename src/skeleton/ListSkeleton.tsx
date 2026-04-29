import React from 'react';
import { View, StyleSheet } from 'react-native';

const ListSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map(item => (
        <View key={item} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.textBlock}>
            <View style={styles.category} />
            <View style={styles.title} />
            <View style={[styles.title, { width: '70%' }]} />
            <View style={styles.date} />
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
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  textBlock: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    width: '40%',
    height: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 6,
  },
  title: {
    width: '90%',
    height: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 6,
  },
  date: {
    width: '30%',
    height: 10,
    backgroundColor: '#f2f2f2',
    marginTop: 4,
  },
});

export default ListSkeleton;