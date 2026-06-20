import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../redux/hooks/useTheme';

const ContactUs = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: colors.background }]}
          >
            <Icon name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Us</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.primary }]}>Get in Touch</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We're here to help you anytime
          </Text>
        </View>

        {/* EMAIL */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? colors.primaryBackground : '#fff1f1' }]}>
              <Icon name="mail" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
              <Text style={[styles.value, { color: colors.text }]}>support@lexwitness.com</Text>
            </View>
          </View>
        </View>

        {/* PHONE */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? colors.primaryBackground : '#fff1f1' }]}>
              <Icon name="phone" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textMuted }]}>Phone</Text>
              <Text style={[styles.value, { color: colors.text }]}>+91 00000 00000</Text>
            </View>
          </View>
        </View>

        {/* ADDRESS */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: isDark ? colors.primaryBackground : '#fff1f1' }]}>
              <Icon name="map-pin" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.textMuted }]}>Address</Text>
              <Text style={[styles.value, { color: colors.text }]}>Delhi, India</Text>
            </View>
          </View>
        </View>

        {/* CTA BUTTON */}
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* HERO */
  hero: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  /* CARD */
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  label: {
    fontSize: 12,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  /* BUTTON */
  button: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});