import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const STATIC_PLANS = [
  {
    id: 1,
    name: 'Free',
    price: '0',
    tag: 'STARTER',
    features: ['No Edition Print', '1 Month Access', 'Trial Access'],
    color: '#6366f1',
  },
  {
    id: 2,
    name: 'Silver',
    price: '1000',
    tag: 'MOST POPULAR',
    features: ['12 Print Editions', '1 Year Access', 'Digital Library'],
    color: '#ec4899',
    highlight: true,
  },
  {
    id: 3,
    name: 'Gold',
    price: '1800',
    tag: 'BEST VALUE',
    features: ['24 Print Editions', '2 Year Access', 'Full Archive'],
    color: '#f59e0b',
  },
  {
    id: 4,
    name: 'Platinum',
    price: '2500',
    tag: 'ELITE',
    features: ['36 Print Editions', '3 Year Access', 'Premium Support'],
    color: '#06b6d4',
  },
];

const PricingCard = () => {
  const [selectedPlanId, setSelectedPlanId] = useState(2);
  const navigation = useNavigation<any>();

  const selectedPlan = STATIC_PLANS.find(p => p.id === selectedPlanId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Membership Plans</Text>
        <View style={styles.divider}/>
        <Text style={styles.subtitle}>
          Choose the perfect plan for your needs
        </Text>
      </View>

      <View style={styles.plansGrid}>
        {STATIC_PLANS.map(plan => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              onPress={() => setSelectedPlanId(plan.id)}
              style={[
                styles.card,
                isSelected && styles.cardActive,
                { borderTopColor: '#c9060a' }
              ]}
            >
              {/* POPULAR BADGE */}
              {plan.highlight && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>🔥 {plan.tag}</Text>
                </View>
              )}

              {/* PLAN ICON / HEADER */}
              {/* <View style={[styles.cardHeader, { backgroundColor: `${plan.color}10` }]}>
                <View style={[styles.iconContainer, { backgroundColor: plan.color }]}>
                  <Text style={styles.iconText}>
                    {plan.name === 'Free' ? '🎁' : plan.name === 'Silver' ? '🥈' : plan.name === 'Gold' ? '🥇' : '💎'}
                  </Text>
                </View>
              </View> */}

              {/* PLAN NAME */}
              <Text style={styles.planName}>{plan.name}</Text>
              
              {!plan.highlight && plan.tag !== 'ELITE' && (
                <View style={styles.tagContainer}>
                  <Text style={[styles.tagText, { color: plan.color }]}>{plan.tag}</Text>
                </View>
              )}

              {/* PRICE */}
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>/year</Text>
              </View>

              {/* FEATURES */}
              <View style={styles.featuresContainer}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Text style={[styles.checkMark, { color: plan.color }]}>✓</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* SELECT INDICATOR */}
              <View style={[
                styles.selectIndicator,
                isSelected && styles.selectIndicatorActive,
                { backgroundColor: isSelected ? plan.color : '#f0f0f0' }
              ]}>
                <Text style={[
                  styles.selectText,
                  isSelected && styles.selectTextActive
                ]}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA BUTTON */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: '#c9060a' }]}
          onPress={() =>
            navigation.navigate('Register', {
              selectedPlanId: String(selectedPlanId),
            })
          }
        >
          {/* <Text style={styles.ctaText}>
            Continue with {selectedPlan?.name} Plan
          </Text> */}
          <Text style={styles.ctaText}>
            SUBSCRIBE NOW
          </Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          Cancel anytime • Free trial available
        </Text>
      </View>
    </ScrollView>
  );
};

export default PricingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
    marginTop:30,
    marginHorizontal:-12
  },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#fafaf9',
    // borderBo/ttomLeftRadius: 24,
    // borderBottomRightRadius: 24,
    borderRadius: 24,
    marginBottom: 16,

  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: '#333',
    letterSpacing: -0.5,
  },
divider: {
  width: 60,
  height: 4,
  backgroundColor: '#c9060a',
  borderRadius: 2,
  marginTop: 4,
  alignSelf: 'center',
},

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 20,
  },

  plansGrid: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal:12
  },

  cardActive: {
    borderColor: '#cbd5e1',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },

  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 9999,
  },

  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },

  cardHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  iconText: {
    fontSize: 28,
  },

  planName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: -0.3,
  },

  tagContainer: {
    alignItems: 'center',
    marginTop: 4,
  },

  tagText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
  },

  price: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 4,
    letterSpacing: -1,
  },

  period: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 4,
    fontWeight: '500',
  },

  featuresContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  checkMark: {
    fontSize: 16,
    fontWeight: '700',
    width: 20,
  },

  featureText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },

  selectIndicator: {
    margin: 16,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  selectIndicatorActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  selectTextActive: {
    color: '#fff',
  },

  ctaContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  ctaArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 16,
  },
});