import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

const STATIC_PLANS = [
  { id: 1, name: 'Free', price: '0', tag: null, features: ['Basic Access', 'Limited Issues', 'Web Only'] },
  { id: 2, name: 'Silver', price: '1999', tag: 'Best Value', features: ['Digital Edition', 'Full Archive', 'Mobile App'] },
  { id: 3, name: 'Gold', price: '4999', tag: 'Most Popular', features: ['Print + Digital', 'Priority Support', 'Legal Directory'] },
  { id: 4, name: 'Platinum', price: '9999', tag: null, features: ['Corporate Access', 'Ad-Free Experience', 'Event Invites'] },
];

const PricingCard = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);
  const navigation = useNavigation<any>();

  const handleSubscribe = () => {
    const selectedPlan = STATIC_PLANS.find((p) => p.id === selectedPlanId);
    
    console.log("Navigating to Register with plan ID:", selectedPlan?.id);
    
    // Ensure 'Register' matches exactly the name in your Stack.Screen
    navigation.navigate('Register', {  
      selectedPlanId: String(selectedPlan?.id) 
    });
  };

  const getPlanColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'silver': return '#475569';
      case 'gold': return '#f59e0b';
      case 'platinum': return '#6366f1';
      default: return '#111';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CHOOSE YOUR PLAN</Text>
          <Text style={styles.headerSubtitle}>Flexible pricing built for professionals</Text>
          <View style={styles.redDivider} />
        </View>

        {/* PLANS GRID */}
        <View style={styles.grid}>
          {STATIC_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                {plan.tag && (
                  <View style={[styles.tagBadge, plan.tag === 'Free' ? styles.tagGray : styles.tagRed]}>
                    <Text style={styles.tagText}>{plan.tag}</Text>
                  </View>
                )}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.planName, { color: getPlanColor(plan.name) }]}>{plan.name}</Text>
                <View style={styles.featureList}>
                  {plan.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{plan.price === '0' ? 'FREE' : `₹${plan.price}`}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA BUTTON */}
        <TouchableOpacity 
          style={styles.subscribeBtn} 
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeBtnText}>SUBSCRIBE NOW</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  redDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#c9060a',
    borderRadius: 2,
    marginTop: 15,
  },
  grid: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    position: 'relative',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 3,
  },
  cardSelected: {
    borderColor: '#c9060a',
    transform: [{ scale: 1.02 }],
    elevation: 10,
    shadowOpacity: 0.2,
  },
  tagBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  tagRed: { backgroundColor: '#c9060a' },
  tagGray: { backgroundColor: '#d1d5db' },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioOuterSelected: {
    borderColor: '#c9060a',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c9060a',
  },
  planName: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  featureList: {
    marginBottom: 20,
    minHeight: 80,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  bullet: {
    color: '#c9060a',
    fontWeight: 'bold',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
  },
  gstText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  subscribeBtn: {
    backgroundColor: '#c9060a',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  subscribeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default PricingCard;