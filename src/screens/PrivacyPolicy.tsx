import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../redux/hooks/useTheme';

const PrivacyPolicy = ({ navigation }: any) => {
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

          <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.primary }]}>Privacy Policy</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your privacy matters to us. We are committed to protecting your data.
          </Text>
        </View>

        {/* SECTION 1 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Information We Collect</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We may collect personal information such as name, email address,
            and app usage data to improve user experience and provide better services.
          </Text>
        </View>

        {/* SECTION 2 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. How We Use Your Information</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            • Improve app performance{"\n"}
            • Personalize content{"\n"}
            • Provide customer support{"\n"}
            • Send important updates and notifications
          </Text>
        </View>

        {/* SECTION 3 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Data Protection</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We use industry-standard security measures to protect your data
            from unauthorized access, alteration, or disclosure.
          </Text>
        </View>

        {/* SECTION 4 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Third-Party Services</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We may use trusted third-party services for analytics and app functionality.
            These services follow strict privacy standards.
          </Text>
        </View>

        {/* SECTION 5 */}
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Your Rights</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            You can request access, modification, or deletion of your personal data at any time.
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

export default PrivacyPolicy;

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