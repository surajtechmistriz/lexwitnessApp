import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACING = 12;

const STATIC_PLANS = [
  {
    id: 1,
    name: 'Free',
    price: '0',
    tag: 'Beginner',
    features: ['Basic Access', 'Web Only', 'Ads Included'],
    color: '#94a3b8',
  },
  {
    id: 2,
    name: 'Silver',
    price: '1,000',
    tag: 'Popular',
    features: ['Digital Edition', 'Full Archive', 'Mobile App'],
    color: '#475569',
  },
  {
    id: 3,
    name: 'Gold',
    price: '1,800',
    tag: 'Best Value',
    features: ['Print + Digital', 'Priority Support', 'No Ads'],
    color: '#b45309',
  },
  {
    id: 4,
    name: 'Platinum',
    price: '2,500',
    tag: 'Elite',
    features: ['Corporate Access', 'Event Invites', 'Legal Directory'],
    color: '#4338ca',
  },
];

const PricingCard = () => {
  const [selectedPlanId, setSelectedPlanId] = useState(2);
  const navigation = useNavigation<any>();

  const handleSubscribe = () => {
    navigation.navigate('Register', { selectedPlanId: String(selectedPlanId) });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Choose your Plan</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.cardList}
      >
        {STATIC_PLANS.map(plan => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              onPress={() => setSelectedPlanId(plan.id)}
              style={[
                styles.card,
                {
                  width: CARD_WIDTH,
                  borderColor: isSelected ? '#c9060a' : '#e2e8f0',
                },
                isSelected && styles.activeCard,
              ]}
            >
              {isSelected && (
                <View style={styles.selectedTick}>
                  <Text style={styles.tickText}>✓</Text>
                </View>
              )}

              <Text style={[styles.planTag, { color: plan.color }]}>
                {plan.tag}
              </Text>
              <Text style={styles.planName}>{plan.name}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.duration}>/yr</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.featureContainer}>
                {plan.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Text style={styles.featureDot}>✦</Text>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.mainCta} onPress={handleSubscribe}>
        <Text style={styles.mainCtaText}>
          Continue with {STATIC_PLANS.find(p => p.id === selectedPlanId)?.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardList: { paddingLeft: 0, paddingRight: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginRight: SPACING,
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activeCard: {
    elevation: 8,
    shadowOpacity: 0.15,
    backgroundColor: '#fff',
  },
  selectedTick: {
    position: 'absolute',
    right: 16,
    top: 4,
    backgroundColor: '#c9060a',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  planTag: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  planName: { fontSize: 26, fontWeight: '800', color: '#111' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 15 },
  currency: { fontSize: 18, fontWeight: '700', color: '#111' },
  price: { fontSize: 32, fontWeight: '900', color: '#111' },
  duration: { fontSize: 14, color: '#666', marginLeft: 4 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  featureContainer: { gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureDot: { color: '#c9060a', marginRight: 10, fontSize: 14 },
  featureText: { fontSize: 14, color: '#475569', fontWeight: '500' },
  mainCta: {
    backgroundColor: '#c9060a',
    marginHorizontal: 0,
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#c9060a',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  mainCtaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default PricingCard;
