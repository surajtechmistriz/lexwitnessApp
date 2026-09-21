import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useTheme } from '../redux/hooks/useTheme';

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

const isSmallDevice = width < 375;
const isTablet = width >= 768;

const ContactUs = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Social Media Handlers
  const handleWhatsApp = () => {
    const phoneNumber = '+917982771770';
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'WhatsApp is not installed',
      });
    });
  };

  const handlePhone = () => {
    const phoneNumber = '+917982771770';
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Phone dialer not available',
      });
    });
  };

  const handleLinkedIn = () => {
    const url = 'https://www.linkedin.com/company/lexwitness';
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'LinkedIn not available',
      });
    });
  };

  const handleEmail = () => {
    const email = 'info@lexwitness.com';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email client not available',
      });
    });
  };

  // Responsive values
  const glassIconSize = isTablet ? 50 : 44;
  const glassIconInner = isTablet ? 22 : 18;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        translucent={false}
        backgroundColor={colors.primary}
        barStyle="light-content"
      />

      {/* Header with Gradient */}
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
          }
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
              }
            ]}
          >
            <Icon name="arrow-left" size={moderateScale(22)} color="#fff" />
          </TouchableOpacity>
          <Text style={[
            styles.headerTitle,
            {
              fontSize: moderateScale(isTablet ? 22 : 18),
            }
          ]}>
            Contact Us
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
            { paddingBottom: verticalScale(40) }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={[
            styles.hero,
            {
              marginBottom: verticalScale(24),
              marginTop: verticalScale(8),
            }
          ]}>
            <Text style={[
              styles.title,
              {
                color: colors.primary,
                fontSize: moderateScale(isTablet ? 32 : 28),
              }
            ]}>
              Get in Touch
            </Text>
            <Text style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontSize: moderateScale(isTablet ? 16 : 14),
                marginTop: verticalScale(4),
              }
            ]}>
              We're here to help you anytime
            </Text>
          </View>

          {/* EMAIL - Updated to match PrivacyPolicy card style */}
          <View style={[
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
            }
          ]}>
            <View style={styles.row}>
              <View style={[
                styles.iconWrap,
                {
                  backgroundColor: isDark ? colors.primaryBackground : '#fff1f1',
                  width: scale(44),
                  height: scale(44),
                  borderRadius: scale(12),
                  marginRight: scale(14),
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}>
                <Icon name="mail" size={moderateScale(20)} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[
                  styles.label,
                  {
                    color: colors.textMuted,
                    fontSize: moderateScale(12),
                    fontWeight: '500',
                    marginBottom: verticalScale(2),
                  }
                ]}>
                  Email
                </Text>
                <Text style={[
                  styles.value,
                  {
                    color: colors.text,
                    fontSize: moderateScale(isTablet ? 16 : 15),
                    fontWeight: '600',
                  }
                ]}>
                  support@lexwitness.com
                </Text>
              </View>
            </View>
          </View>

          {/* PHONE - Updated to match PrivacyPolicy card style */}
          <View style={[
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
            }
          ]}>
            <View style={styles.row}>
              <View style={[
                styles.iconWrap,
                {
                  backgroundColor: isDark ? colors.primaryBackground : '#fff1f1',
                  width: scale(44),
                  height: scale(44),
                  borderRadius: scale(12),
                  marginRight: scale(14),
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}>
                <Icon name="phone" size={moderateScale(20)} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[
                  styles.label,
                  {
                    color: colors.textMuted,
                    fontSize: moderateScale(12),
                    fontWeight: '500',
                    marginBottom: verticalScale(2),
                  }
                ]}>
                  Phone
                </Text>
                <Text style={[
                  styles.value,
                  {
                    color: colors.text,
                    fontSize: moderateScale(isTablet ? 16 : 15),
                    fontWeight: '600',
                  }
                ]}>
                  +91 79827 71770
                </Text>
              </View>
            </View>
          </View>

          {/* ADDRESS - Updated to match PrivacyPolicy card style */}
          <View style={[
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
            }
          ]}>
            <View style={styles.row}>
              <View style={[
                styles.iconWrap,
                {
                  backgroundColor: isDark ? colors.primaryBackground : '#fff1f1',
                  width: scale(44),
                  height: scale(44),
                  borderRadius: scale(12),
                  marginRight: scale(14),
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}>
                <Icon name="map-pin" size={moderateScale(20)} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[
                  styles.label,
                  {
                    color: colors.textMuted,
                    fontSize: moderateScale(12),
                    fontWeight: '500',
                    marginBottom: verticalScale(2),
                  }
                ]}>
                  Address
                </Text>
                <Text style={[
                  styles.value,
                  {
                    color: colors.text,
                    fontSize: moderateScale(isTablet ? 16 : 15),
                    fontWeight: '600',
                  }
                ]}>
                  Delhi, India
                </Text>
              </View>
            </View>
          </View>

          {/* SOCIAL MEDIA SECTION */}
          <View style={[
            styles.socialSection,
            {
              marginTop: verticalScale(16),
              marginBottom: verticalScale(8),
            }
          ]}>
            <View style={styles.socialDividerContainer}>
              <View style={[
                styles.socialDivider,
                { backgroundColor: colors.border }
              ]} />
              <Text style={[
                styles.socialDividerText,
                {
                  color: colors.textMuted,
                  fontSize: moderateScale(12),
                  paddingHorizontal: scale(16),
                  fontWeight: '600',
                  letterSpacing: 0.5,
                }
              ]}>
                Connect With Us
              </Text>
              <View style={[
                styles.socialDivider,
                { backgroundColor: colors.border }
              ]} />
            </View>

            {/* Liquid Glass Icons */}
            <View style={[
              styles.socialIconsContainer,
              {
                gap: scale(isTablet ? 20 : 12),
                marginTop: verticalScale(isTablet ? 16 : 12),
              }
            ]}>
              {/* WhatsApp */}
              <TouchableOpacity
                style={[
                  styles.glassIconWrapper,
                  {
                    width: scale(glassIconSize),
                    height: scale(glassIconSize),
                    borderRadius: scale(glassIconSize / 2),
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(223, 216, 216, 0.5)',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    borderWidth: 1,
                  }
                ]}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
                  style={[
                    styles.glassGradient,
                    {
                      borderRadius: scale(glassIconSize / 2),
                    }
                  ]}
                >
                  <FontAwesome
                    name="whatsapp"
                    size={scale(glassIconInner)}
                    color={isDark ? '#25D366' : '#25D366'}
                  />
                </LinearGradient>
              </TouchableOpacity>

              {/* Phone */}
              <TouchableOpacity
                style={[
                  styles.glassIconWrapper,
                  {
                    width: scale(glassIconSize),
                    height: scale(glassIconSize),
                    borderRadius: scale(glassIconSize / 2),
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(223, 216, 216, 0.5)',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    borderWidth: 1,
                  }
                ]}
                onPress={handlePhone}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
                  style={[
                    styles.glassGradient,
                    {
                      borderRadius: scale(glassIconSize / 2),
                    }
                  ]}
                >
                  <Icon
                    name="phone"
                    size={scale(glassIconInner)}
                    color={isDark ? '#4CAF50' : '#4CAF50'}
                  />
                </LinearGradient>
              </TouchableOpacity>

              {/* LinkedIn */}
              <TouchableOpacity
                style={[
                  styles.glassIconWrapper,
                  {
                    width: scale(glassIconSize),
                    height: scale(glassIconSize),
                    borderRadius: scale(glassIconSize / 2),
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(223, 216, 216, 0.5)',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    borderWidth: 1,
                  }
                ]}
                onPress={handleLinkedIn}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
                  style={[
                    styles.glassGradient,
                    {
                      borderRadius: scale(glassIconSize / 2),
                    }
                  ]}
                >
                  <FontAwesome
                    name="linkedin"
                    size={scale(glassIconInner)}
                    color={isDark ? '#0A66C2' : '#0A66C2'}
                  />
                </LinearGradient>
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity
                style={[
                  styles.glassIconWrapper,
                  {
                    width: scale(glassIconSize),
                    height: scale(glassIconSize),
                    borderRadius: scale(glassIconSize / 2),
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(223, 216, 216, 0.5)',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    borderWidth: 1,
                  }
                ]}
                onPress={handleEmail}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
                  style={[
                    styles.glassGradient,
                    {
                      borderRadius: scale(glassIconSize / 2),
                    }
                  ]}
                >
                  <Icon
                    name="mail"
                    size={scale(glassIconInner)}
                    color={isDark ? '#EA4335' : '#EA4335'}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                marginTop: verticalScale(20),
                paddingVertical: verticalScale(16),
                borderRadius: scale(12),
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }
            ]}
          >
            <Text style={[
              styles.buttonText,
              {
                color: '#fff',
                fontSize: moderateScale(isTablet ? 17 : 16),
                fontWeight: '700',
              }
            ]}>
              Send Message
            </Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <Text style={[
            styles.footer,
            {
              color: colors.textMuted,
              marginTop: verticalScale(20),
              fontSize: moderateScale(12),
              textAlign: 'center',
              fontStyle: 'italic',
            }
          ]}>
            We'll respond within 24 hours
          </Text>

          {/* VERSION INFO */}
          <View style={styles.versionContainer}>
            <Text style={[
              styles.versionText,
              {
                color: colors.textMuted,
                fontSize: moderateScale(isTablet ? 14 : 11),
                fontWeight: '500',
                opacity: 0.6,
              }
            ]}>
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ContactUs;

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
    fontWeight: '700',
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
    fontWeight: '800',
  },

  subtitle: {
    lineHeight: 20,
  },

  /* CARD - Updated to match PrivacyPolicy */
  card: {
    borderWidth: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  contactInfo: {
    flex: 1,
  },

  label: {
    fontWeight: '500',
  },

  value: {
    fontWeight: '600',
  },

  /* SOCIAL SECTION */
  socialSection: {
    alignItems: 'center',
    width: '100%',
  },

  socialDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },

  socialDivider: {
    flex: 1,
    height: 1,
  },

  socialDividerText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  glassIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },

  glassGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* BUTTON */
  button: {
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: '700',
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