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
  Platform,
} from 'react-native';
import Config from 'react-native-config';

// --- Types ---
type Magazine = {
  id: number;
  title: string;
  image: string;
  description?: string;
};

// --- Components ---
import PricingCard from '../../../components/common/PricingCard';
import TopMenu from '../../../components/common/Menubar';
import Header from '../../../components/common/Header';
import { latesteEdition } from '../../../services/api/latestedition';
import Footer from '../../../components/common/Footer';
import LatestEditions from '../../home/components/Latest5Edition';
import MainLayout from '../../../MainLayout';

const { width, height } = Dimensions.get('window');

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
    <MainLayout
      title="Subscription"
      showFilter={false}
      routeName="Subscription"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section with Gradient Background */}
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Making Sense of India</Text>
              <Text style={styles.heroSub}>
                From breaking news to in-depth analysis, we bring clarity.
              </Text>
              {/*               
              <View style={styles.issueCard}>
                <Text style={styles.issueHeader}>
                  How Delhi should deal with the reset in Dhaka
                </Text>
                <Text style={styles.issueBody}>
                  The new Tarique Rahman regime in Dhaka gives India a fresh chance 
                  to resolve longstanding disputes with its neighbour.
                </Text>
              </View> */}

              <View style={styles.imageWrapper}>
                <View style={styles.imageContainer}>
                  {loading ? (
                    <ActivityIndicator color="#c9060a" size="large" />
                  ) : (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.heroImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={scrollToPricing}
                >
                  <View style={styles.gradientBtn}>
                    <Text style={styles.primaryBtnText}>
                      Your First Year is on Us
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={scrollToPricing}
                >
                  <Text style={styles.secondaryBtnText}>
                    Choose your Subscription Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <LatestEditions skipId={magazine?.id} />

          {/* Benefits Section - Modern Cards */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Why Subscribe?</Text>
            <Text style={styles.sectionSubtitle}>
              Get the most out of your reading experience
            </Text>

            <View style={styles.benefitsGrid}>
              <BenefitItem
                icon="📱"
                title="Unlimited Access"
                text="Access full website and app content"
              />
              <BenefitItem
                icon="📰"
                title="Weekly Magazine"
                text="Get physical print delivered to your doorstep"
              />
              <BenefitItem
                icon="🔍"
                title="Premium Analysis"
                text="Deep insights & complete archives access"
              />
            </View>
          </View>

          {/* Pricing Section */}
          <View
            onLayout={event => {
              pricingYPos.current = event.nativeEvent.layout.y;
            }}
            style={styles.pricingSection}
          >
            {/* <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            <Text style={styles.sectionSubtitle}>
              Flexible plans to suit your reading needs
            </Text> */}
            <PricingCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
}

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
    <View style={styles.benefitIconContainer}>
      <Text style={styles.benefitIcon}>{icon}</Text>
    </View>
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroGradient: {
    backgroundColor: '#c9060a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom:20
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSub: {
    fontSize: 16,
    color: '#ffebeb',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.95,
    fontWeight: '400',
  },

  issueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  issueHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  issueBody: {
    fontSize: 14,
    color: '#4a4a4a',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },

  imageWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    width: width * 0.5,
    height: width * 0.66,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#c9060a',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },

  // Benefits Section
  benefitsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginVertical: 20,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  benefitsGrid: {
    gap: 16,
  },
  benefitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // Pricing Section
  pricingSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#f8f9fa',
  },
});
