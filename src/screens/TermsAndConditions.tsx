import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../redux/hooks/useTheme';

const TermsAndConditions = ({ navigation }: any) => {
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

          <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Conditions</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.primary }]}>Terms & Conditions</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please read these terms carefully before using our app.
          </Text>
        </View>

        {/* SECTION 1 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            By using this application, you agree to comply with and be bound by these terms and conditions.
          </Text>
        </View>

        {/* SECTION 2 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Use of Service</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            You agree to use this app only for lawful purposes and in a way that does not infringe on others' rights.
          </Text>
        </View>

        {/* SECTION 3 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Content Disclaimer</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            All content provided is for informational purposes only and may change without prior notice.
          </Text>
        </View>

        {/* SECTION 4 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. User Responsibilities</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Users are responsible for maintaining the confidentiality of their account and activities.
          </Text>
        </View>

        {/* SECTION 5 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Modifications</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We reserve the right to modify these terms at any time without prior notice.
          </Text>
        </View>

        {/* FOOTER */}
        <Text style={[styles.footer, { color: colors.textMuted }]}>
          Last updated: May 2026
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

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

  /* CARD */
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  sectionTitle: {
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