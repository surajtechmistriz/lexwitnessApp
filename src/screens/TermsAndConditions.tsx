import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const TermsAndConditions = ({ navigation }: any) => {
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

          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.subtitle}>
            Please read these terms carefully before using our app.
          </Text>
        </View>

        {/* SECTION 1 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By using this application, you agree to comply with and be bound by these terms and conditions.
          </Text>
        </View>

        {/* SECTION 2 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Use of Service</Text>
          <Text style={styles.text}>
            You agree to use this app only for lawful purposes and in a way that does not infringe on others’ rights.
          </Text>
        </View>

        {/* SECTION 3 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Content Disclaimer</Text>
          <Text style={styles.text}>
            All content provided is for informational purposes only and may change without prior notice.
          </Text>
        </View>

        {/* SECTION 4 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.text}>
            Users are responsible for maintaining the confidentiality of their account and activities.
          </Text>
        </View>

        {/* SECTION 5 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>5. Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time without prior notice.
          </Text>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
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

  /* CARD */
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  sectionTitle: {
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