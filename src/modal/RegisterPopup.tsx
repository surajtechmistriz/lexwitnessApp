import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const RegisterPopup = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation(); // Initialize navigation
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const isFirst = await AsyncStorage.getItem('alreadyLaunched');
    if (isFirst === null) {
      setVisible(true);
    }
  };

  const handleRegister = async () => {
    // Required fields check
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      Alert.alert("Required", "Please fill in all details to register.");
      return;
    }

    await AsyncStorage.setItem('alreadyLaunched', 'true');
    await AsyncStorage.setItem('userData', JSON.stringify(form));
    setVisible(false);
    navigation.navigate('Subscription'); // Navigate after registration
  };

  const handleGoToSignIn = () => {
    setVisible(false); // Close the popup first
    navigation.navigate('SignIn'); // Navigate to your existing SignIn screen
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
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
              onChangeText={(v) => setForm({...form, firstName: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#999"
              onChangeText={(v) => setForm({...form, lastName: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(v) => setForm({...form, email: v})}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
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
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333', // Thin dark border from your image
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  button: {
    backgroundColor: '#c9060a', // Bright red from image
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
});

export default RegisterPopup;