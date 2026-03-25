import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListCard = ({ category, title, date, isLast }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      
      {/* Dashed separator rendered inside the card, hidden for the last item */}
      {!isLast && <View style={styles.separator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // borderWidth:1,
    // borderColor:'#f1eeee'
  },
  content: {
    paddingVertical: 14,
  },
  categoryText: {
    color: '#C62828', // The specific deep red from your image
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleText: {
    color: '#333',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 4,
  },
  dateText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#e6dddd',
    borderStyle: 'dashed', // Matches the dashed line in the screenshot
  },
});

export default ListCard;