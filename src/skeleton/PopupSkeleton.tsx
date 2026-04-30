import React from 'react';
import { View, StyleSheet } from 'react-native';

const PopupSkeleton = () => {
  return (
    <View borderRadius={8}>
      <View style={styles.container}>
        {/* Magazine Cover */}
        <View style={styles.image} />

        {/* Content Section */}
        <View style={{ paddingHorizontal: 5 }}>
          <View style={styles.label} />
          <View style={styles.title} />
          <View style={styles.promo} />

          {/* Feature Row */}
          <View style={styles.featureRow}>
            <View style={styles.circle} />
            <View>
              <View style={styles.featureText} />
              <View style={styles.subText} />
            </View>
          </View>

          {/* Button */}
          <View style={styles.button} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    width: 100,
    height: 14,
    marginBottom: 10,
  },
  title: {
    width: '90%',
    height: 20,
    marginBottom: 8,
  },
  promo: {
    width: '70%',
    height: 24,
    marginBottom: 25,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 12,
  },
  featureText: {
    width: 180,
    height: 14,
    marginBottom: 6,
  },
  subText: {
    width: 120,
    height: 12,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 6,
  },
});

export default PopupSkeleton;