import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const PrivacyPolicy = ({ navigation }: any) => {
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

          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            Your privacy matters to us. We are committed to protecting your data.
          </Text>
        </View>

        {/* SECTION 1 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We may collect personal information such as name, email address,
            and app usage data to improve user experience and provide better services.
          </Text>
        </View>

        {/* SECTION 2 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            • Improve app performance{"\n"}
            • Personalize content{"\n"}
            • Provide customer support{"\n"}
            • Send important updates and notifications
          </Text>
        </View>

        {/* SECTION 3 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Data Protection</Text>
          <Text style={styles.text}>
            We use industry-standard security measures to protect your data
            from unauthorized access, alteration, or disclosure.
          </Text>
        </View>

        {/* SECTION 4 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
          <Text style={styles.text}>
            We may use trusted third-party services for analytics and app functionality.
            These services follow strict privacy standards.
          </Text>
        </View>

        {/* SECTION 5 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You can request access, modification, or deletion of your personal data at any time.
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

export default PrivacyPolicy;

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