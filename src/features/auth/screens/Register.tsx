import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/common/Header'; // Import your header
import Ionicons from 'react-native-vector-icons/Ionicons';
import DynamicBanner from '../../../components/common/DynamicBanner';
import TopMenu from '../../../components/common/Menubar';

const Register = () => {
  const [selectedPlan, setSelectedPlan] = useState('1 Year Plan');
  const [autoRenew, setAutoRenew] = useState(false);

  const plans = [
    {
      id: '3 Year Plan',
      price: '₹1,200',
      duration: '3 Years',
      desc: 'Least cost effective',
    },
    {
      id: '1 Year Plan',
      price: '₹600',
      duration: 'Year',
      desc: 'Least cost effective',
    },
    {
      id: '2 Year Plan',
      price: '₹1,000',
      duration: '2 Years',
      desc: 'Least cost effective',
    },
    { id: 'Free Plan', price: 'Free', duration: '7 days', desc: 'effective' },
  ];

  return (
    <SafeAreaView style={styles.container}>
        <Header />
        <TopMenu/>
      <DynamicBanner title='Register'/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>REGISTER YOURSELF</Text>
        <Text style={styles.subText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis.
        </Text>
        <View style={styles.redDivider} />

        <View style={styles.formCard}>
          {/* Input Grid */}
          <View style={styles.row}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>E-mail *</Text>
              <TextInput style={styles.input}  />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput style={styles.input}  />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Repeat Password *</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
            />
          </View>

          <View style={styles.fullWidth}>
            <Text style={styles.label}>Contact * (10 digits only)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="9876543210"
            />
          </View>

          {/* Plan Selection Grid */}
          <View style={styles.plansGrid}>
            {plans.map(item => {
              const isActive = selectedPlan === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPlan(item.id)}
                  style={[styles.planCard, isActive && styles.planCardActive]}
                >
                  <Text style={[styles.pTitle, isActive && styles.whiteText]}>
                    {item.id}
                  </Text>
                  <Text style={[styles.pPrice, isActive && styles.whiteText]}>
                    {item.price} / {item.duration}
                  </Text>
                  <Text style={[styles.pDetail, isActive && styles.whiteText]}>
                    • Browse all charts
                  </Text>
                  <Text style={[styles.pDetail, isActive && styles.whiteText]}>
                    • Cancel anytime
                  </Text>
                  <Text style={[styles.pDetail, isActive && styles.whiteText]}>
                    • {item.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Checkbox Simulation */}
          <TouchableOpacity
            style={styles.checkRow}
            activeOpacity={0.8}
            onPress={() => setAutoRenew(!autoRenew)}
          >
            <View style={[styles.checkbox, autoRenew && styles.checkboxActive]}>
              {/* Only show the white checkmark icon when autoRenew is true */}
              {autoRenew && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkText}>
              Automatically renew subscription
            </Text>
          </TouchableOpacity>

          <View style={styles.paymentBox}>
            <Text style={styles.payHeader}>Payment Details</Text>
            <Text style={styles.payNote}>
              Before you can accept payments, you need to connect your Stripe
              Account by going to
              <Text style={{ fontWeight: 'bold' }}> Dashboard → Gateways.</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.regBtn}>
            <Text style={styles.regBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 15, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  subText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  redDivider: {
    width: 40,
    height: 3,
    backgroundColor: '#c9060a',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 1,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputHalf: { width: '48%' },
  fullWidth: { width: '100%', marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fafafa',
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  planCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  planCardActive: { backgroundColor: '#c9060a', borderColor: '#c9060a' },
  pTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  pPrice: { fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
  pDetail: { fontSize: 10, color: '#666' },
  whiteText: { color: '#fff' },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3, // Slight rounding like the screenshot
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff', // White when unchecked
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#c9060a', // Solid Red background when checked
    borderColor: '#c9060a', // Red border to match
  },
  checkText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },

  payHeader: { fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  payNote: { fontSize: 12, color: '#444' },
  regBtn: {
    backgroundColor: '#c9060a',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  regBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default Register;
