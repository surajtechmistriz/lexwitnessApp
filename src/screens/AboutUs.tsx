import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../redux/hooks/useTheme';

const AboutUs = ({ navigation }: any) => {
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

          <Text style={[styles.headerTitle, { color: colors.text }]}>About Us</Text>
        </View>

        {/* HERO SECTION */}
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.primary }]}>Lex Witness</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Modern Legal-Tech Platform for Trusted Insights
          </Text>
        </View>

        {/* CONTENT CARDS */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Who We Are</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Lex Witness is a digital legal-tech platform designed to simplify complex legal information and make it accessible to everyone — from students to professionals.
          </Text>
        </View>

        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Our Mission</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We aim to bridge the gap between law and people by delivering clear, reliable, and easy-to-understand legal news, updates, and insights.
          </Text>
        </View>

        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>What We Offer</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            • Legal news & updates{"\n"}
            • Case analysis & insights{"\n"}
            • Expert opinions{"\n"}
            • Simplified legal explanations{"\n"}
            • Daily legal awareness content
          </Text>
        </View>

        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Our Vision</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            To become India’s most trusted and user-friendly legal information platform, empowering people with knowledge of law.
          </Text>
        </View>

        {/* FOOTER NOTE */}
        <Text style={[styles.footer, { color: colors.textMuted }]}>
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
    lineHeight: 18,
  },

  /* CARDS */
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    lineHeight: 20,
  },

  /* FOOTER */
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
  },
});