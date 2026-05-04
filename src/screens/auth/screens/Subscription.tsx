import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';

import PricingCard from '../../../components/common/PricingCard';
import { latesteEdition } from '../../../services/api/latestedition';
import MainLayout from '../../../MainLayout';

type Magazine = {
  id: number;
  title: string;
  image: string;
  description?: string;
};

const { width } = Dimensions.get('window');

export default function SubscriptionPage() {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const scrollRef = useRef<ScrollView>(null);
  const pricingYPos = useRef<number>(0);

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
    scrollRef.current?.scrollTo({ y: pricingYPos.current, animated: true });
  };

  const imageUrl = magazine?.image
    ? `${Config.MAGAZINES_BASE_URL}/${magazine.image}`
    : 'https://via.placeholder.com/300x400';

  return (
    <MainLayout title="Subscription" showFilter={false} routeName="Subscription">
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
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

              <Text style={styles.heroTitle}>
                Making Sense{"\n"}of India
              </Text>

              <Text style={styles.heroSub}>
                Unbiased journalism, deep-dive analysis, and the stories that define our nation.
              </Text>

              {/* IMAGE */}
              <View style={styles.imageWrapper}>
                <View style={styles.imageContainer}>
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
                <TouchableOpacity
                  style={styles.primaryBtn}
                  activeOpacity={0.9}
                  onPress={scrollToPricing}
                >
                  <Text style={styles.primaryBtnText}>
                    Your First Year is on Us
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  activeOpacity={0.7}
                  onPress={scrollToPricing}
                >
                  <Text style={styles.secondaryBtnText}>
                    Choose your Subscription Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* --- TRUST BAR --- */}
          <View style={styles.trustBar}>
            <Text style={styles.trustText}>
              Join 100,000+ Premium Readers
            </Text>
          </View>

          {/* --- BENEFITS --- */}
          <View style={styles.benefitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Subscription Benefits
              </Text>
              <View style={styles.titleUnderline} />
            </View>

            <View style={styles.benefitsGrid}>
              <BenefitItem
                icon="book-outline"
                title="Unlimited Access"
                text="Read all articles across web and app without limits"
              />

              <BenefitItem
                icon="newspaper-outline"
                title="Weekly Magazine"
                text="Get the latest print edition delivered to your doorstep"
              />

              <BenefitItem
                icon="analytics-outline"
                title="Premium Analysis"
                text="Expert opinions and deep-dive editorial insights"
              />
            </View>
          </View>

          {/* --- PRICING --- */}
          <View
            onLayout={e => {
              pricingYPos.current = e.nativeEvent.layout.y;
            }}
            style={styles.pricingSection}
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
}: {
  icon: string;
  title: string;
  text: string;
}) => (
  <View style={styles.benefitCard}>
    <Icon name={icon} size={28} color="#c9060a" style={styles.benefitIcon} />

    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  </View>
);

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 60 },

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
    backgroundColor: '#222',
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
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#c9060a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  /* TRUST */
  trustBar: {
    marginTop: -20,
    alignSelf: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  trustText: {
    fontSize: 12,
    color: '#666',
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
    color: '#1a1a1a',
  },
  titleUnderline: {
    width: 40,
    height: 4,
    backgroundColor: '#c9060a',
    marginTop: 8,
  },
  benefitsGrid: {
    gap: 20,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  /* PRICING */
  pricingSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});