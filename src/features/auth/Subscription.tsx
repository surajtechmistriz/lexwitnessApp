import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';

// import PricingCard from '../../../components/common/PricingCard';
// import { latesteEdition } from '../../../services/api/latestedition';
// import MainLayout from '../../../MainLayout';
import { useNavigation } from '@react-navigation/native';
// import { useTheme } from '../../../store/hooks/useTheme';
import { useSelector } from 'react-redux';
import PricingCard from '../../components/common/PricingCard';
import MainLayout from '../../MainLayout';
import { useTheme } from '../../store/hooks/useTheme';
import { latesteEdition } from '../../services/home.service';

type Magazine = {
  id: number;
  title: string;
  image: string;
  description?: string;
};

const { width, height } = Dimensions.get('window');

// Responsive utility functions
const scale = (size: number) => {
  const baseWidth = 375; // iPhone SE/8 base
  const scaleFactor = width / baseWidth;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const verticalScale = (size: number) => {
  const baseHeight = 667; // iPhone SE/8 base
  const scaleFactor = height / baseHeight;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const isSmallDevice = width < 375;
const isTablet = width >= 768;
// const isLargeTablet = width >= 1024;

export default function SubscriptionPage() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const scrollRef = useRef<ScrollView>(null);
  const pricingY = useRef(0);

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await latesteEdition();
        setMagazine(response.data.magazine);
      } catch (error) {
        console.error('Magazine API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToPricing = () => {
    scrollRef.current?.scrollTo({
      y: pricingY.current,
      animated: true,
    });
  };

  const imageUrl = magazine?.image
    ? `${Config.MAGAZINES_BASE_URL}/${magazine.image}`
    : 'https://via.placeholder.com/300x400';

  const handleBack = () => {
    navigation.goBack();
  };

  // Responsive image size
  const getImageSize = () => {
    if (isTablet) {
      return { width: width * 0.35, height: width * 0.48 };
    }
    return { width: width * 0.55, height: width * 0.75 };
  };

  const imageSize = getImageSize();

  // Responsive font sizes
  const heroTitleSize = moderateScale(isTablet ? 44 : 38);
  const heroSubSize = moderateScale(isTablet ? 18 : 16);
  const sectionTitleSize = moderateScale(isTablet ? 28 : 24);

  const statusBarColor = '#c9060a';
  const statusBarStyle = 'light-content';
  return (
    <MainLayout
      title="Subscription"
      showFilter={false}
      routeName="Subscription"
      showBackButton={true}
      onBackPress={handleBack}
      statusBarColor={statusBarColor}
      statusBarStyle={statusBarStyle}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HERO SECTION --- */}
          <LinearGradient
            colors={['#1a1a1a', '#c9060a', '#9e0508']}
            style={[
              styles.heroGradient,
              {
                paddingTop: verticalScale(isSmallDevice ? 30 : 40),
                paddingBottom: verticalScale(isSmallDevice ? 35 : 50),
              },
            ]}
          >
            <View style={styles.heroContent}>
              <Text
                style={[
                  styles.premiumBadge,
                  {
                    fontSize: moderateScale(isSmallDevice ? 10 : 12),
                    paddingHorizontal: scale(isSmallDevice ? 10 : 12),
                    paddingVertical: scale(isSmallDevice ? 3 : 4),
                  },
                ]}
              >
                PREMIUM ACCESS
              </Text>

              <Text
                style={[
                  styles.heroTitle,
                  {
                    fontSize: heroTitleSize,
                    lineHeight: heroTitleSize * 1.15,
                    marginBottom: verticalScale(isSmallDevice ? 10 : 15),
                  },
                ]}
              >
                Making Sense{'\n'}of India
              </Text>

              <Text
                style={[
                  styles.heroSub,
                  {
                    fontSize: heroSubSize,
                    lineHeight: heroSubSize * 1.5,
                    marginBottom: verticalScale(isSmallDevice ? 20 : 30),
                    paddingHorizontal: isTablet ? scale(40) : 0,
                  },
                ]}
              >
                Unbiased journalism, deep-dive analysis, and the stories that
                define our nation.
              </Text>

              {/* IMAGE */}
              <View
                style={[
                  styles.imageWrapper,
                  { marginBottom: verticalScale(isSmallDevice ? 25 : 35) },
                ]}
              >
                <View
                  style={[
                    styles.imageContainer,
                    {
                      backgroundColor: '#222',
                      width: imageSize.width,
                      height: imageSize.height,
                      borderRadius: scale(isTablet ? 16 : 14),
                    },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator
                      color="#fff"
                      size={isSmallDevice ? 'small' : 'large'}
                    />
                  ) : (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.heroImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>

              {/* BUTTONS */}
              <View
                style={[
                  styles.buttonContainer,
                  {
                    maxWidth: isTablet ? 500 : '100%',
                    gap: verticalScale(isSmallDevice ? 12 : 15),
                  },
                ]}
              >
                {!user && (
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      {
                        backgroundColor: '#fff',
                        paddingVertical: verticalScale(isSmallDevice ? 14 : 18),
                        borderRadius: scale(isTablet ? 14 : 12),
                      },
                    ]}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('Register', {
                        selectedPlanId: 1,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.primaryBtnText,
                        {
                          color: colors.primary,
                          fontSize: moderateScale(isSmallDevice ? 14 : 16),
                        },
                      ]}
                    >
                      Your First Year is on Us
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    {
                      borderColor: 'rgba(255,255,255,0.5)',
                      paddingVertical: verticalScale(isSmallDevice ? 14 : 16),
                      borderRadius: scale(isTablet ? 14 : 12),
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={scrollToPricing}
                >
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      {
                        color: '#fff',
                        fontSize: moderateScale(isSmallDevice ? 13 : 15),
                      },
                    ]}
                  >
                    Choose your Subscription Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* --- TRUST BAR --- */}
          <View
            style={[
              styles.trustBar,
              {
                backgroundColor: isDark ? colors.card : '#f8f9fa',
                borderColor: isDark ? colors.border : '#eee',
                paddingHorizontal: scale(isTablet ? 40 : 20),
                paddingVertical: verticalScale(isTablet ? 12 : 10),
                marginTop: verticalScale(isTablet ? -25 : -20),
                borderRadius: scale(isTablet ? 35 : 30),
              },
            ]}
          >
            <Text
              style={[
                styles.trustText,
                {
                  color: colors.textSecondary,
                  fontSize: moderateScale(isTablet ? 14 : 12),
                },
              ]}
            >
              Join 100,000+ Premium Readers
            </Text>
          </View>

          {/* --- BENEFITS --- */}
          <View
            style={[
              styles.benefitsSection,
              {
                paddingHorizontal: scale(isTablet ? 40 : 24),
                marginTop: verticalScale(isTablet ? 50 : 40),
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                    fontSize: sectionTitleSize,
                  },
                ]}
              >
                Subscription Benefits
              </Text>
              <View
                style={[
                  styles.titleUnderline,
                  {
                    backgroundColor: colors.primary,
                    width: scale(isTablet ? 50 : 40),
                    height: scale(isTablet ? 5 : 4),
                    marginTop: scale(isTablet ? 10 : 8),
                  },
                ]}
              />
            </View>

            <View
              style={[
                styles.benefitsGrid,
                {
                  gap: verticalScale(isTablet ? 24 : 20),
                  flexDirection: isTablet ? 'row' : 'column',
                  flexWrap: isTablet ? 'wrap' : 'nowrap',
                },
              ]}
            >
              <BenefitItem
                icon="book-outline"
                title="Unlimited Digital Reading"
                text="Access Lex Witness content anytime on desktop, tablet, or mobile."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />

              <BenefitItem
                icon="analytics-outline"
                title="12–36 Print Editions"
                text="Receive up to 36 print editions depending on your plan."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />

              <BenefitItem
                icon="newspaper-outline"
                title="Print Magazine Delivery"
                text="Get every issue delivered to your doorstep with paid plans."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />
              <BenefitItem
                icon="newspaper-outline"
                title="Flexible Subscription Options"
                text="Choose from 1 month, 1 year, 2 year, or 3 year access."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />
              <BenefitItem
                icon="newspaper-outline"
                title="Expert Legal Insights"
                text="In-depth analysis covering law, policy, and business."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />
              <BenefitItem
                icon="newspaper-outline"
                title="Trusted Industry Coverage"
                text="Stay updated on developments shaping India's legal ecosystem."
                colors={colors}
                isDark={isDark}
                isTablet={isTablet}
              />
            </View>
          </View>

          {/* --- PRICING --- */}
          <View
            style={[
              styles.pricingSection,
              {
                marginTop: verticalScale(isTablet ? 30 : 20),
                paddingHorizontal: scale(isTablet ? 24 : 16),
              },
            ]}
            onLayout={event => {
              pricingY.current = event.nativeEvent.layout.y;
            }}
          >
            <PricingCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
}

/* -------------------- BENEFIT ITEM -------------------- */
const BenefitItem = ({
  icon,
  title,
  text,
  colors,
}: {
  icon: string;
  title: string;
  text: string;
  colors: any;
  isDark: boolean;
  isTablet: boolean;
}) => {
  // const { width } = Dimensions.get('window');

  return (
    <View
      style={[
        styles.benefitCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: scale(isTablet ? 20 : 16),
          borderRadius: scale(isTablet ? 20 : 16),
          flex: isTablet ? 1 : undefined,
          minWidth: isTablet ? width / 3 - 40 : '100%',
          borderWidth: 1,
        },
      ]}
    >
      <Icon
        name={icon}
        size={moderateScale(isTablet ? 32 : 28)}
        color={colors.primary}
        style={[styles.benefitIcon, { marginRight: scale(isTablet ? 20 : 16) }]}
      />

      <View style={styles.benefitContent}>
        <Text
          style={[
            styles.benefitTitle,
            {
              color: colors.text,
              fontSize: moderateScale(isTablet ? 19 : 17),
              marginBottom: scale(isTablet ? 6 : 4),
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.benefitText,
            {
              color: colors.textSecondary,
              fontSize: moderateScale(isTablet ? 15 : 14),
              lineHeight: moderateScale(isTablet ? 22 : 20),
            },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingBottom: verticalScale(10),
    flexGrow: 1,
  },

  /* HERO */
  heroGradient: {
    borderBottomLeftRadius: scale(40),
    borderBottomRightRadius: scale(40),
  },
  heroContent: {
    paddingHorizontal: scale(24),
    alignItems: 'center',
  },
  premiumBadge: {
    color: '#FFD700',
    fontWeight: '800' as const,
    letterSpacing: 2,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  heroTitle: {
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  /* IMAGE */
  imageWrapper: {
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  /* BUTTONS */
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  primaryBtn: {
    alignItems: 'center',
  },
  primaryBtnText: {
    fontWeight: 'bold',
  },
  secondaryBtn: {
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontWeight: '600' as const,
  },

  /* TRUST */
  trustBar: {
    alignSelf: 'center',
    borderWidth: 1,
  },
  trustText: {
    fontWeight: '600' as const,
  },

  /* BENEFITS */
  benefitsSection: {},
  sectionHeader: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontWeight: '800' as const,
  },
  titleUnderline: {
    borderRadius: 2,
  },
  benefitsGrid: {
    justifyContent: 'center',
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontWeight: '600',
  },
  benefitText: {},

  /* PRICING */
  pricingSection: {},
});
