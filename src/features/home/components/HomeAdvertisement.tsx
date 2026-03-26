import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeAdvertisement = () => {
  return (
    <View >
      <Text style={styles.adText}>Advertisement</Text>
    </View>
  );
};

export default HomeAdvertisement;

const styles = StyleSheet.create({
//   container: {
//     height: 100, // fixed height (important for ads)
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 18,
//     backgroundColor: '#ffffff',
//   },

 adText: {
    fontSize: 20,             // Increased size (previous was 18 or 22)
    // fontWeight: '600',        // Semi-bold for better visibility
    color: '#333333',         // Dark grey text
  },
});