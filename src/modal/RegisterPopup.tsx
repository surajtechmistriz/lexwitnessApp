import React, { useEffect, useState } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { navigationRef } from '../navigation/AppNavigator'; 
import { useAuth } from '../context/AuthContext';
import NetInfo from '@react-native-community/netinfo';

const RegisterPopup = () => {
  const [visible, setVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const { isLoggedIn, login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // ✅ Network listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return unsubscribe;
  }, []);

  // ✅ Main logic (single source)
  useEffect(() => {
    const checkStatus = () => {
      if (!navigationRef.isReady()) return;

      const currentRouteName = navigationRef.getCurrentRoute()?.name;
      const authScreens = ['SignIn', 'Register', 'Subscription'];

      // ❌ Hide on auth screens
      if (currentRouteName && authScreens.includes(currentRouteName)) {
        setVisible(false);
        return;
      }

      // 🔥 Priority: No internet → hide register popup
      if (!isConnected) {
        setVisible(false);
        return;
      }

      // ✅ Show only if not logged in
      setVisible(!isLoggedIn);
    };

    checkStatus();

    const unsubscribeNav = navigationRef.addListener('state', checkStatus);

    return unsubscribeNav;
  }, [isLoggedIn, isConnected]); // 🔥 correct dependencies

  const handleRegister = async () => {
    const { firstName, lastName, email, phone } = form;

    if (!firstName || !lastName || !email || !phone) {
      Alert.alert("Required", "Please fill in all details to register.");
      return;
    }

    await login(form);

    setVisible(false);

    if (navigationRef.isReady()) {
      navigationRef.navigate('Subscription' as never);
    }
  };

  const handleGoToSignIn = () => {
    setVisible(false);
    if (navigationRef.isReady()) {
      navigationRef.navigate('SignIn' as never);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <Text style={styles.title}>Register to Continue</Text>
          <Text style={styles.subtitle}>Fill your details to register</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={form.firstName}
              onChangeText={(v) => setForm({ ...form, firstName: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={form.lastName}
              onChangeText={(v) => setForm({ ...form, lastName: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleGoToSignIn}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#000' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  form: { width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#c9060a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#000' },
  linkText: { fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline', color: '#c9060a' },
});

export default RegisterPopup;