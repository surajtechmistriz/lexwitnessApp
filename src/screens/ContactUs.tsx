import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const ContactUs = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.subtitle}>
            We’re here to help you anytime
          </Text>
        </View>

        {/* EMAIL */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Icon name="mail" size={16} color="#c9060a" />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>support@lexwitness.com</Text>
            </View>
          </View>
        </View>

        {/* PHONE */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Icon name="phone" size={16} color="#c9060a" />
            </View>
            <View>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>+91 00000 00000</Text>
            </View>
          </View>
        </View>

        {/* ADDRESS */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Icon name="map-pin" size={16} color="#c9060a" />
            </View>
            <View>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>Delhi, India</Text>
            </View>
          </View>
        </View>

        {/* CTA BUTTON */}
        <TouchableOpacity style={styles.button}>
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  /* HERO */
  hero: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#c9060a',
  },

  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  /* CARD */
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  label: {
    fontSize: 12,
    color: '#9ca3af',
  },

  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },

  /* BUTTON */
  button: {
    marginTop: 20,
    backgroundColor: '#c9060a',
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