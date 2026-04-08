import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeAdvertisement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ADVERTISEMENT</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Your Ad Here</Text>
        <Text style={styles.subtitle}>
          Promote your brand with us
        </Text>

        {/* <View style={styles.button}> */}
          {/* <Text style={styles.buttonText}>Learn More</Text> */}
        {/* </View> */}
      </View>
    </View>
  );
};

export default HomeAdvertisement;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: 11,
    color: '#999',
    letterSpacing: 1,
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },

  button: {
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});