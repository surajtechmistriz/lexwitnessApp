import React, { useState, useRef } from 'react';
import {
  View, Text, Modal, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const AuthPopup = ({ visible, mode: initialMode }: any) => {
  const [mode, setMode] = useState(initialMode || 'register');
  const { login } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let s = {} as any;
    if (!form.email.includes('@')) s.email = "Invalid email";
    if (form.password.length < 6) s.password = "Min 6 characters";
    if (mode === 'register') {
      if (!form.firstName) s.firstName = "Required";
      if (!form.lastName) s.lastName = "Required";
    }
    setErrors(s);
    return Object.keys(s).length === 0;
  };

  const handleSwitch = (newMode: 'register' | 'signin') => {
    setErrors({});
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setMode(newMode);
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            
            <View style={styles.topSection}>
              <Text style={styles.title}>{mode === 'register' ? 'Create Account' : 'Welcome Back'}</Text>
              <Text style={styles.subtitle}>Please enter your details to continue</Text>
            </View>

            <View style={styles.formSection}>
              {mode === 'register' && (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <TextInput 
                      style={[styles.input, errors.firstName && styles.inputErr]} 
                      placeholder="First Name" 
                      onChangeText={v => setForm({...form, firstName: v})}
                    />
                  </View>
                  <View style={{ width: 10 }} />
                  <View style={{ flex: 1 }}>
                    <TextInput 
                      style={[styles.input, errors.lastName && styles.inputErr]} 
                      placeholder="Last Name" 
                      onChangeText={v => setForm({...form, lastName: v})}
                    />
                  </View>
                </View>
              )}

              <TextInput 
                style={[styles.input, errors.email && styles.inputErr]} 
                placeholder="Email Address" 
                autoCapitalize="none"
                onChangeText={v => setForm({...form, email: v})}
              />
              {errors.email && <Text style={styles.errTxt}>{errors.email}</Text>}

              <TextInput 
                style={[styles.input, errors.password && styles.inputErr]} 
                placeholder="Password" 
                secureTextEntry 
                onChangeText={v => setForm({...form, password: v})}
              />
              {errors.password && <Text style={styles.errTxt}>{errors.password}</Text>}

              <TouchableOpacity style={styles.btn} onPress={() => validate() && login(form)}>
                <Text style={styles.btnTxt}>{mode === 'register' ? 'Register' : 'Sign In'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerTxt}>{mode === 'register' ? 'Already have an account? ' : "New here? "}</Text>
              <TouchableOpacity onPress={() => handleSwitch(mode === 'register' ? 'signin' : 'register')}>
                <Text style={styles.linkTxt}>{mode === 'register' ? 'Sign In' : 'Register'}</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%' },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 25, 
    minHeight: 480, // 👈 Identical height for both modes
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  topSection: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  formSection: { flex: 1, justifyContent: 'center', marginTop: 20 },
  row: { flexDirection: 'row', marginBottom: 5 },
  input: { backgroundColor: '#f5f5f7', padding: 15, borderRadius: 12, fontSize: 16, marginTop: 10 },
  inputErr: { borderWidth: 1, borderColor: '#ff3b30', backgroundColor: '#fff8f8' },
  errTxt: { color: '#ff3b30', fontSize: 11, fontWeight: '600', marginTop: 2, marginLeft: 5 },
  btn: { backgroundColor: '#c9060a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  footerTxt: { color: '#666', fontSize: 14 },
  linkTxt: { color: '#c9060a', fontWeight: '700', fontSize: 14 }
});

export default AuthPopup;