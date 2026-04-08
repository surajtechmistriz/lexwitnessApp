import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ActivityIndicator 
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
import MainLayout from '../../../components/layout/MainLayout';

export default function SubscriptionPage() {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Refs for smooth scrolling to the pricing section
  const scrollRef = useRef<ScrollView>(null);
  const pricingYPos = useRef<number>(0);

  /**
   * Fetch the latest magazine edition on component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await latesteEdition();
        // Set the magazine data from the nested response object
        setMagazine(response.data.magazine);
      } catch (error) {
        console.error("Magazine API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Smooth scrolls the view to the pricing card's captured Y position
   */
  const scrollToPricing = () => {
    scrollRef.current?.scrollTo({ y: pricingYPos.current, animated: true });
  };

  // Construct full image URL using the base path from Config
  const imageUrl = magazine?.image 
    ? `${Config.MAGAZINES_BASE_URL}/${magazine.image}`
    : 'https://via.placeholder.com/300x400';

  return (
    <MainLayout title="Subscription" showFilter={false}>

    <SafeAreaView style={styles.safeArea}>
      {/* <Header />
      <TopMenu /> */}
      
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO SECTION: Marketing Copy & Latest Issue */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Making Sense of India</Text>
          <Text style={styles.heroSub}>From breaking news to in-depth analysis, we bring clarity.</Text>
          
          <Text style={styles.issueHeader}>
            {magazine?.title || "How Delhi should deal with the reset in Dhaka"}
          </Text>
          
          <Text style={styles.issueBody}>
            {magazine?.description || "The new Tarique Rahman regime in Dhaka gives India a fresh chance... expressways near completion across the country."}
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={scrollToPricing}>
            <Text style={styles.primaryBtnText}>Your first year is on us!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Existing readers - Renew Now!</Text>
          </TouchableOpacity>

          {/* Issue Cover Image with Shadow/Elevation */}
          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator color="#c9060a" />
            ) : (
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.heroImage} 
                resizeMode="cover" 
              />
            )}
          </View>
        </View>

        {/* BENEFITS SECTION: Value propositions */}
        <View style={styles.benefitsRow}>
          <BenefitItem title="Unlimited Access" text="Access full website and app content" />
          <BenefitItem title="Weekly Magazine" text="Get physical print delivered" />
          <BenefitItem title="Premium Analysis" text="Deep insights & archives access" />
        </View>

        {/* PRICING SECTION: Captured via onLayout for scroll reference */}
        <View onLayout={(event) => { pricingYPos.current = event.nativeEvent.layout.y }}>
          <PricingCard />
        </View>
        
      {/* <Footer/> */}
      </ScrollView>
    </SafeAreaView>
    </MainLayout>
  );
}

/**
 * Reusable Benefit Item Component
 */
const BenefitItem = ({ title, text }: { title: string, text: string }) => (
  <View style={styles.benefitBox}>
    <Text style={styles.benefitTitle}>{title}</Text>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: {  },
  hero: { padding: 20, alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#c9060a', textAlign: 'center', marginBottom: 10 },
  heroSub: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 20 },
  issueHeader: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  issueBody: { fontSize: 14, color: '#374151', textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  primaryBtn: { backgroundColor: '#c9060a', width: '100%', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { borderWidth: 1, borderColor: '#d1d5db', width: '100%', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  secondaryBtnText: { color: '#333', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  imageContainer: { 
    width: 250, 
    height: 330, 
    elevation: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImage: { width: '100%', height: '100%' },
  benefitsRow: { backgroundColor: '#fee2e2', paddingVertical: 30, paddingHorizontal: 10, flexDirection: 'column', gap: 20 },
  benefitBox: { alignItems: 'center' },
  benefitTitle: { fontWeight: 'bold', fontSize: 18, color: '#000' },
  benefitText: { fontSize: 13, color: '#4b5563', textAlign: 'center', marginTop: 4 },
});