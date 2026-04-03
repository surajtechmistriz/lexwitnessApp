import React, { useEffect, useState } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert, 
  DeviceEventEmitter
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/AppNavigator'; 

const RegisterPopup = () => {
  const [visible, setVisible] = useState(false);
  
  // 1. Initial state setup
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    checkStatus();
    const unsubscribe = navigationRef.addListener('state', () => {
      checkStatus();
    });
    return unsubscribe;
  }, []);

  const checkStatus = async () => {
    if (!navigationRef.isReady()) return;
    try {
      const currentRouteName = navigationRef.getCurrentRoute()?.name;
      const authScreens = ['SignIn', 'Register', 'Subscription'];
      
      if (currentRouteName && authScreens.includes(currentRouteName)) {
        setVisible(false);
        return;
      }

      const isFirst = await AsyncStorage.getItem('alreadyLaunched');
      const userToken = await AsyncStorage.getItem('userToken');

      if (isFirst === null && !userToken) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } catch (e) {
      console.log('Status check error:', e);
    }
  };

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      Alert.alert("Required", "Please fill in all details to register.");
      return;
    }

    await AsyncStorage.setItem('alreadyLaunched', 'true');
  await AsyncStorage.setItem('userData', JSON.stringify(form));
  await AsyncStorage.setItem('userToken', 'some_token');

  DeviceEventEmitter.emit('AUTH_CHANGE');
  
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
            {/* 2. Added 'value' prop to ensure text is visible while typing */}
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={form.firstName} 
              onChangeText={(v) => setForm({...form, firstName: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={form.lastName}
              onChangeText={(v) => setForm({...form, lastName: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm({...form, email: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm({...form, phone: v})}
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