import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const AboutUs = ({ navigation }: any) => {
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

          <Text style={styles.headerTitle}>About Us</Text>
        </View>

        {/* HERO SECTION */}
        <View style={styles.hero}>
          <Text style={styles.title}>Lex Witness</Text>
          <Text style={styles.subtitle}>
            Modern Legal-Tech Platform for Trusted Insights
          </Text>
        </View>

        {/* CONTENT CARDS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Who We Are</Text>
          <Text style={styles.text}>
            Lex Witness is a digital legal-tech platform designed to simplify complex legal information and make it accessible to everyone — from students to professionals.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.text}>
            We aim to bridge the gap between law and people by delivering clear, reliable, and easy-to-understand legal news, updates, and insights.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Offer</Text>
          <Text style={styles.text}>
            • Legal news & updates{"\n"}
            • Case analysis & insights{"\n"}
            • Expert opinions{"\n"}
            • Simplified legal explanations{"\n"}
            • Daily legal awareness content
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.text}>
            To become India’s most trusted and user-friendly legal information platform, empowering people with knowledge of law.
          </Text>
        </View>

        {/* FOOTER NOTE */}
        <Text style={styles.footer}>
          Built with ❤️ for legal awareness
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;


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
    lineHeight: 18,
  },

  /* CARDS */
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },

  /* FOOTER */
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
  },
});