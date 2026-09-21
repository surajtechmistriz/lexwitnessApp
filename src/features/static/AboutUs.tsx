import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../redux/hooks/useTheme';

const AboutUs = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        translucent={false}
        backgroundColor={colors.primary}
        barStyle="light-content"
      />
      
      {/* Header with Gradient - Matching EditProfileScreen style */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || '#c9060a']}
        style={[
          styles.headerGradient,
          {
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
          >
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <SafeAreaView 
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
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
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerGradient: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* HERO */
  hero: {
    marginBottom: 24,
    marginTop: 8,
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
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    lineHeight: 22,
  },

  /* FOOTER */
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
  },
});