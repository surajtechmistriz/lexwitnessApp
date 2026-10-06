import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../store/hooks/useTheme';

const { width, height } = Dimensions.get('window');

// Responsive utility functions
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const verticalScale = (size: number) => {
  const baseHeight = 667;
  const scaleFactor = height / baseHeight;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const isTablet = width >= 768;

const PrivacyPolicy = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        translucent={false}
        backgroundColor={colors.primary}
        barStyle="light-content"
      />

      {/* Header with Gradient - Matching ContactUs/AboutUs style */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || '#c9060a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.headerGradient,
          {
            paddingTop: insets.top + (Platform.OS === 'ios' ? 12 : 8),
            paddingHorizontal: scale(20),
            paddingBottom: verticalScale(20),
            borderBottomLeftRadius: scale(30),
            borderBottomRightRadius: scale(30),
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.backBtn,
              {
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: scale(40),
                height: scale(40),
                borderRadius: scale(30),
              },
            ]}
          >
            <Icon name="arrow-left" size={moderateScale(22)} color="#fff" />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: moderateScale(isTablet ? 22 : 18),
              },
            ]}
          >
            Privacy Policy
          </Text>
          <View style={{ width: scale(40) }} />
        </View>
      </LinearGradient>

      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: verticalScale(40) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View
            style={[
              styles.hero,
              {
                marginBottom: verticalScale(24),
                marginTop: verticalScale(8),
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary,
                  fontSize: moderateScale(isTablet ? 32 : 28),
                },
              ]}
            >
              Privacy Policy
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginTop: verticalScale(4),
                },
              ]}
            >
              Your privacy matters to us. We are committed to protecting your
              data.
            </Text>
          </View>

          {/* SECTION 1 */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(14),
                padding: scale(16),
                marginBottom: verticalScale(12),
                // shadowColor: isDark ? '#000' : '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.05,
                // shadowRadius: 4,
                // elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              1. Information We Collect
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 15 : 13),
                  lineHeight: verticalScale(22),
                },
              ]}
            >
              We may collect personal information such as name, email address,
              and app usage data to improve user experience and provide better
              services.
            </Text>
          </View>

          {/* SECTION 2 */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(14),
                padding: scale(16),
                marginBottom: verticalScale(12),
                // shadowColor: isDark ? '#000' : '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.05,
                // shadowRadius: 4,
                // elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              2. How We Use Your Information
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 15 : 13),
                  lineHeight: verticalScale(22),
                },
              ]}
            >
              • Improve app performance{'\n'}• Personalize content{'\n'}•
              Provide customer support{'\n'}• Send important updates and
              notifications
            </Text>
          </View>

          {/* SECTION 3 */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(14),
                padding: scale(16),
                marginBottom: verticalScale(12),
                // shadowColor: isDark ? '#000' : '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.05,
                // shadowRadius: 4,
                // elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              3. Data Protection
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 15 : 13),
                  lineHeight: verticalScale(22),
                },
              ]}
            >
              We use industry-standard security measures to protect your data
              from unauthorized access, alteration, or disclosure.
            </Text>
          </View>

          {/* SECTION 4 */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(14),
                padding: scale(16),
                marginBottom: verticalScale(12),
                // shadowColor: isDark ? '#000' : '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.05,
                // shadowRadius: 4,
                // elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              4. Third-Party Services
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 15 : 13),
                  lineHeight: verticalScale(22),
                },
              ]}
            >
              We may use trusted third-party services for analytics and app
              functionality. These services follow strict privacy standards.
            </Text>
          </View>

          {/* SECTION 5 */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(14),
                padding: scale(16),
                marginBottom: verticalScale(12),
                // shadowColor: isDark ? '#000' : '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.05,
                // shadowRadius: 4,
                // elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: moderateScale(isTablet ? 16 : 14),
                  marginBottom: verticalScale(6),
                },
              ]}
            >
              5. Your Rights
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 15 : 13),
                  lineHeight: verticalScale(22),
                },
              ]}
            >
              You can request access, modification, or deletion of your personal
              data at any time.
            </Text>
          </View>

          {/* FOOTER */}
          <Text
            style={[
              styles.footer,
              {
                color: colors.textMuted,
                marginTop: verticalScale(24),
                fontSize: moderateScale(12),
                textAlign: 'center',
              },
            ]}
          >
            Last updated: May 2026
          </Text>

          {/* VERSION INFO - Matching other screens */}
          <View style={styles.versionContainer}>
            <Text
              style={[
                styles.versionText,
                {
                  color: colors.textMuted,
                  fontSize: moderateScale(isTablet ? 14 : 11),
                  fontWeight: '500',
                  opacity: 0.6,
                },
              ]}
            >
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontWeight: '600',
    color: '#fff',
  },

  content: {
    padding: 20,
  },

  /* HERO */
  hero: {
    marginBottom: 24,
  },

  title: {
    fontWeight: '800' as const,
  },

  subtitle: {
    lineHeight: 20,
  },

  /* CARD */
  card: {
    borderWidth: 1,
  },

  sectionTitle: {
    fontWeight: '600',
  },

  text: {
    lineHeight: 22,
  },

  /* FOOTER */
  footer: {
    fontStyle: 'italic',
  },

  /* VERSION */
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
  },

  versionText: {
    fontWeight: '500',
    opacity: 0.6,
  },
});
