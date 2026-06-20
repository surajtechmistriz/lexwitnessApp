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

import PricingCard from '../../../components/common/PricingCard';
import { latesteEdition } from '../../../services/api/latestedition';
import MainLayout from '../../../MainLayout';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../redux/hooks/useTheme';
import { useSelector } from 'react-redux';

type Magazine = {
  id: number;
  title: string;
  image: string;
  description?: string;
};

const { width } = Dimensions.get('window');

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

  return (
    <MainLayout
      title="Subscription"
      showFilter={false}
      routeName="Subscription"
      showBackButton={true}
      onBackPress={handleBack}
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
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.premiumBadge}>PREMIUM ACCESS</Text>

              <Text style={styles.heroTitle}>Making Sense{'\n'}of India</Text>

              <Text style={styles.heroSub}>
                Unbiased journalism, deep-dive analysis, and the stories that
                define our nation.
              </Text>

              {/* IMAGE */}
              <View style={styles.imageWrapper}>
                <View
                  style={[styles.imageContainer, { backgroundColor: '#222' }]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="large" />
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
              <View style={styles.buttonContainer}>
                {!user && (
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: '#fff' }]}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('Register', {
                        selectedPlanId: 1,
                      })
                    }
                  >
                    <Text
                      style={[styles.primaryBtnText, { color: colors.primary }]}
                    >
                      Your First Year is on Us
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    { borderColor: 'rgba(255,255,255,0.5)' },
                  ]}
                  activeOpacity={0.7}
                  onPress={scrollToPricing}
                >
                  <Text style={[styles.secondaryBtnText, { color: '#fff' }]}>
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
              },
            ]}
          >
            <Text style={[styles.trustText, { color: colors.textSecondary }]}>
              Join 100,000+ Premium Readers
            </Text>
          </View>

          {/* --- BENEFITS --- */}
          <View style={styles.benefitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Subscription Benefits
              </Text>
              <View
                style={[
                  styles.titleUnderline,
                  { backgroundColor: colors.primary },
                ]}
              />
            </View>

            <View style={styles.benefitsGrid}>
              <BenefitItem
                icon="book-outline"
                title="Unlimited Access"
                text="Read all articles across web and app without limits"
                colors={colors}
                isDark={isDark}
              />

              <BenefitItem
                icon="newspaper-outline"
                title="Weekly Magazine"
                text="Get the latest print edition delivered to your doorstep"
                colors={colors}
                isDark={isDark}
              />

              <BenefitItem
                icon="analytics-outline"
                title="Premium Analysis"
                text="Expert opinions and deep-dive editorial insights"
                colors={colors}
                isDark={isDark}
              />
            </View>
          </View>

          {/* --- PRICING --- */}
          <View
            style={styles.pricingSection}
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
  isDark,
}: {
  icon: string;
  title: string;
  text: string;
  colors: any;
  isDark: boolean;
}) => (
  <View
    style={[
      styles.benefitCard,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
    ]}
  >
    <Icon
      name={icon}
      size={28}
      color={colors.primary}
      style={styles.benefitIcon}
    />

    <View style={styles.benefitContent}>
      <Text style={[styles.benefitTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  </View>
);

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 10 },

  /* HERO */
  heroGradient: {
    paddingTop: 40,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  premiumBadge: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 15,
  },
  heroSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  /* IMAGE */
  imageWrapper: {
    marginBottom: 35,
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.55,
    height: width * 0.75,
    borderRadius: 14,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  /* BUTTONS */
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryBtn: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },

  /* TRUST */
  trustBar: {
    marginTop: -20,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* BENEFITS */
  benefitsSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  titleUnderline: {
    width: 40,
    height: 4,
    marginTop: 8,
  },
  benefitsGrid: {
    gap: 20,
  },
  benefitCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
  },

  /* PRICING */
  pricingSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});
