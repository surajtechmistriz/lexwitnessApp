import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import MainLayout from "../../../components/layout/MainLayout";

const plansData = [
  { id: "1", name: "FREE", price: 0 },
  { id: "2", name: "SILVER", price: 1000 },
  { id: "3", name: "GOLD", price: 1800 },
  { id: "4", name: "PLATINUM", price: 2500 },
];

const RegisterScreen = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    otp: "",
    dob: "",
    organisation_name: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    password: "",
    password_confirmation: "",
    plan: "1",
    auto_renew: false,
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (name: string, value: any) => {
    if (name === "contact") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm({ ...form, [name]: value });
  };

  /* ---------- OTP ---------- */
  const handleSendOtp = () => {
    if (form.contact.length !== 10) {
      return Alert.alert("Error", "Enter valid 10-digit number");
    }
    setIsOtpSent(true);
    Alert.alert("OTP Sent", "Use 1234");
  };

  const handleVerifyOtp = () => {
    if (form.otp === "1234") {
      setIsOtpVerified(true);
      Alert.alert("Verified");
    } else {
      Alert.alert("Invalid OTP");
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmit = () => {
    if (!isOtpVerified) {
      return Alert.alert("Error", "Verify phone first");
    }

    const selectedPlan = plansData.find(p => p.id === form.plan);

    Alert.alert(
      "Success",
      `Registered with ${selectedPlan?.name}`
    );
  };

  const selectedPlan = plansData.find(p => p.id === form.plan);
  const otherPlans = plansData.filter(p => p.id !== form.plan);

  const price = selectedPlan?.price || 0;
  const gst = price * 0.18;
  const total = price + gst;

  return (
    <MainLayout title="Register" showFilter={false} routeName='Register'>

    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      {/* -------- PERSONAL -------- */}
      <Input label="First Name *" value={form.first_name} onChange={(v)=>handleChange("first_name",v)} />
      <Input label="Last Name *" value={form.last_name} onChange={(v)=>handleChange("last_name",v)} />
      <Input label="Email *" value={form.email} onChange={(v)=>handleChange("email",v)} />

      {/* PHONE */}
      <View style={styles.row}>
        <TextInput
          placeholder="Contact (10 digit)"
          style={[styles.input, { flex: 1 }]}
          keyboardType="number-pad"
          value={form.contact}
          onChangeText={(v)=>handleChange("contact",v)}
        />
        {!isOtpVerified && (
          <TouchableOpacity style={styles.otpBtn} onPress={handleSendOtp}>
            <Text style={styles.btnText}>
              {isOtpSent ? "Resend" : "Get OTP"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isOtpSent && !isOtpVerified && (
        <View style={styles.row}>
          <TextInput
            placeholder="OTP"
            style={[styles.input, { flex: 1 }]}
            value={form.otp}
            onChangeText={(v)=>handleChange("otp",v)}
          />
          <TouchableOpacity onPress={handleVerifyOtp}>
            <Text style={styles.verify}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}

      {isOtpVerified && <Text style={styles.success}>✓ Verified</Text>}

      <Input label="Date of Birth *" value={form.dob} onChange={(v)=>handleChange("dob",v)} />
      <Input label="Organisation Name" value={form.organisation_name} onChange={(v)=>handleChange("organisation_name",v)} />
      <Input label="Address *" value={form.address} onChange={(v)=>handleChange("address",v)} />
      <Input label="City *" value={form.city} onChange={(v)=>handleChange("city",v)} />
      <Input label="Pincode *" value={form.pincode} onChange={(v)=>handleChange("pincode",v)} />
      <Input label="State *" value={form.state} onChange={(v)=>handleChange("state",v)} />
      <Input label="Country *" value={form.country} onChange={(v)=>handleChange("country",v)} />

      <Input label="Password *" secure value={form.password} onChange={(v)=>handleChange("password",v)} />
      <Input label="Confirm Password *" secure value={form.password_confirmation} onChange={(v)=>handleChange("password_confirmation",v)} />

      {/* -------- PLAN -------- */}
      <Text style={styles.section}>Your Plan</Text>
      <View style={styles.selected}>
        <Text>{selectedPlan?.name}</Text>
        <Text>₹{selectedPlan?.price}</Text>
      </View>

      <Text style={styles.section}>Other Plans</Text>
      {otherPlans.map(plan => (
        <TouchableOpacity
          key={plan.id}
          style={styles.plan}
          onPress={()=>handleChange("plan",plan.id)}
        >
          <Text>{plan.name}</Text>
          <Text>₹{plan.price}</Text>
        </TouchableOpacity>
      ))}

      {/* -------- SUMMARY -------- */}
      <View style={styles.summary}>
        <Text>Base: ₹{price}</Text>
        {price > 0 && <Text>GST: ₹{gst.toFixed(2)}</Text>}
        <Text style={styles.total}>Total: ₹{total.toFixed(2)}</Text>
      </View>

      {/* -------- SUBMIT -------- */}
      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {price === 0 ? "Subscribe Now" : "Pay Now"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
    </MainLayout>
  );
};

/* ---------- INPUT COMPONENT ---------- */
const Input = ({ label, value, onChange, secure = false }: any) => {
  const isRequired = label.includes('*');

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>
        {label.replace('*', '')}
        {isRequired && <Text style={{ color: 'red' }}> *</Text>}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
};

export default RegisterScreen;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:"#fff" },
  heading: { fontSize:22, fontWeight:"bold", marginBottom:20 },

  label: { fontSize:12, color:"#666", marginBottom:4 },

  input: {
    borderWidth:1,
    borderColor:"#ddd",
    padding:10,
    borderRadius:6,
  },

  row: { flexDirection:"row", gap:10, alignItems:"center", marginBottom:10 },

  otpBtn: {
    backgroundColor:"#c9060a",
    padding:10,
    borderRadius:6,
  },

  btnText: { color:"#fff", fontSize:12 },

  verify: { color:"#c9060a", fontWeight:"bold" },

  success: { color:"green", marginBottom:10 },

  section: { marginTop:20, fontWeight:"bold" },

  selected: {
    borderWidth:2,
    borderColor:"#c9060a",
    padding:10,
    borderRadius:8,
    marginVertical:10,
  },

  plan: {
    borderWidth:1,
    borderColor:"#eee",
    padding:10,
    borderRadius:8,
    marginBottom:8,
  },

  summary: {
    marginTop:20,
    padding:10,
    backgroundColor:"#f5f5f5",
    borderRadius:8,
  },

  total: { fontWeight:"bold", marginTop:5 },

  submit: {
    backgroundColor:"#c9060a",
    padding:15,
    borderRadius:8,
    marginTop:20,
    alignItems:"center",
  },

  submitText: { color:"#fff", fontWeight:"bold" },
});