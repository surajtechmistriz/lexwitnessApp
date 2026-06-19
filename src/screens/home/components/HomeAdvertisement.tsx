import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../../redux/useTheme';

const HomeAdvertisement = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        ADVERTISEMENT
      </Text>

      <View style={[styles.card, { 
        backgroundColor: isDark ? colors.border : '#f5f5f5',
      }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Your Ad Here
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Promote your brand with us
        </Text>

        {/* <View style={[styles.button, { backgroundColor: colors.primary }]}> */}
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
    letterSpacing: 1,
    marginBottom: 8,
  },

  card: {
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    marginBottom: 14,
  },

  button: {
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