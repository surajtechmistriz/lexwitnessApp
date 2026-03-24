import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeAdvertisement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Advertisement</Text>
    </View>
  );
};

export default HomeAdvertisement;

const styles = StyleSheet.create({
  container: {
    height: 100, // fixed height (important for ads)
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    backgroundColor: '#f5eded',
  },

  text: {
    fontSize: 22,
    color: '#333',
  },
});