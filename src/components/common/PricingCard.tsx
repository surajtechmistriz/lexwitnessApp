import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');

const plans = {
  "1y": { duration: "1 Year", price: 599, original: 299, freeText: "Free", label: "/ 1 Month" },
  "2y": { duration: "2 Years", price: 999, original: 599, freeText: "Free", label: "/ 2 Months" },
  "3y": { duration: "3 Years", price: 1499, original: 899, freeText: "Free", label: "/ 3 Months" },
};

export default function PricingCard() {
  const [plan, setPlan] = useState("1y");
  const currentPlan = plans[plan];

 const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.pricingSection} id="pricing">
      {/* RECOMMENDED CARD */}
      <View style={styles.featuredCard}>
        <View style={styles.recommendedBanner}>
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>

        <View style={styles.cardPadding}>
          <Text style={styles.cardTitle}>Digital + Print</Text>
          <Text style={styles.cardSubTitle}>
            {currentPlan.duration} | Print Editions + Unlimited Digital Access
          </Text>

          <View style={styles.list}>
            <Text style={styles.listItem}>• Your First Month Is on Us</Text>
            <Text style={styles.listItem}>• ₹{currentPlan.price} / year thereafter</Text>
            <Text style={styles.listItem}>• ₹1 will be charged & refunded to activate</Text>
          </View>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            {Object.keys(plans).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPlan(p)}
                style={[styles.toggleBtn, plan === p ? styles.toggleBtnActive : styles.toggleBtnInactive]}
              >
                <View style={[styles.radio, plan === p && styles.radioSelected]} />
                <Text style={styles.toggleText}>{p.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gray Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>₹{currentPlan.original}</Text>
          <Text style={styles.freePrice}>
            {currentPlan.freeText} <Text style={styles.priceLabel}>{currentPlan.label}</Text>
          </Text>
          <Text style={styles.offText}>(100% Off) <Text style={styles.cancelText}>| Cancel anytime</Text></Text>

          <View style={styles.imageCircle}>
            <Text style={styles.placeholderText}>Magazine Image</Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={()=>navigation.navigate('Register')}>
            <Text style={styles.actionBtnText}>START MY FREE MONTH</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DIGITAL CARD */}
      <View style={styles.standardCard}>
         <View style={styles.cardPadding}>
            <Text style={styles.cardTitle}>Digital</Text>
            <Text style={styles.cardSubTitle}>1 Yr | Unlimited Digital Access</Text>
            <View style={styles.list}>
                <Text style={styles.listItem}>• Start reading instantly</Text>
                <Text style={styles.listItem}>• PDF download for offline</Text>
                <Text style={styles.listItem}>• Access timeless archives</Text>
            </View>
         </View>

         <View style={styles.priceContainer}>
            {/* Ribbon Simulation */}
            <View style={styles.ribbon}>
                <Text style={styles.ribbonText}>Save ₹4201</Text>
            </View>

            <Text style={styles.originalPrice}>₹5200</Text>
            <Text style={styles.mainPrice}>₹999 <Text style={styles.priceLabel}>/ 1 Yr</Text></Text>
            <Text style={styles.offText}>(81% Off) <Text style={styles.cancelText}>| Cancel anytime</Text></Text>

            <View style={styles.imageCircle}>
                <Text style={styles.placeholderText}>Image</Text>
            </View>

            <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText} onPress={()=>navigation.navigate('Register')}>GET INSTANT ACCESS</Text>
            </TouchableOpacity>
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pricingSection: { padding: 20 },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#ef4444',
    marginBottom: 30,
    overflow: 'hidden',
    elevation: 5,
  },
  recommendedBanner: { backgroundColor: '#c9060a', paddingVertical: 8 },
  recommendedText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic', fontSize: 18 },
  cardPadding: { padding: 15, alignItems: 'center' },
  cardTitle: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  cardSubTitle: { color: '#6b7280', fontSize: 12, marginBottom: 15 },
  list: { alignSelf: 'flex-start', marginBottom: 20 },
  listItem: { color: '#374151', fontSize: 13, marginBottom: 5 },
  toggleRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  toggleBtnActive: { backgroundColor: '#fee2e2', borderColor: '#ef4444' },
  toggleBtnInactive: { backgroundColor: '#f3f4f6', borderColor: '#d1d5db' },
  radio: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#9ca3af', marginRight: 5 },
  radioSelected: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  toggleText: { fontWeight: '600' },
  priceContainer: { backgroundColor: '#e5e7eb', padding: 20, alignItems: 'center' },
  originalPrice: { color: '#9ca3af', textDecorationLine: 'line-through', fontSize: 20 },
  freePrice: { color: '#c9060a', fontSize: 28, fontWeight: 'bold' },
  mainPrice: { color: '#000', fontSize: 40, fontWeight: 'bold' },
  priceLabel: { color: '#6b7280', fontSize: 14, fontWeight: '500' },
  offText: { color: '#c9060a', fontSize: 14, marginBottom: 20 },
  cancelText: { color: '#6b7280' },
  imageCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  placeholderText: { color: '#9ca3af' },
  actionBtn: { backgroundColor: '#c9060a', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  standardCard: { backgroundColor: '#fff', borderRadius: 16, elevation: 3, overflow: 'hidden' },
  ribbon: { position: 'absolute', top: 15, right: -30, backgroundColor: '#c9060a', paddingVertical: 5, paddingHorizontal: 40, transform: [{ rotate: '45deg' }] },
  ribbonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});