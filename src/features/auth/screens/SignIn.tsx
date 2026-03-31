import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // You'll need to install this
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DynamicBanner from '../../../components/common/DynamicBanner';
import Header from '../../../components/common/Header';
import TopMenu from '../../../components/common/Menubar';
import { AsyncStorage } from 'react-native';
import Footer from '../../../components/common/Footer';
import MainLayout from '../../../components/layout/MainLayout';
// import Banner from '../components/Banner'; // Use the Banner we made
// import { loginUser } from '../lib/auth/auth'; // Ensure path is correct

const SignInScreen = () => {
  const navigation = useNavigation<any>();
  
  // States matching your Next.js logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // if (!email || !password) {
    //   setError("Please fill in all fields");
    //   return;
    // }

    // setError("");
    setLoading(true);

    try {
      const res = loginUser(email.trim(), password);

      // Mobile equivalent of localStorage
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to Home
      navigation.replace("Home"); 
    } catch (err: any) {
      setError(err?.message || "Login failed");
      Alert.alert("Error", err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Sign In" showFilter={false}>

  <SafeAreaView style={styles.container}>
    
    {/*  FIXED PART */}
    {/* <Header /> */}
    {/* <TopMenu /> */}
    {/* <DynamicBanner title="Signin" /> */}

    {/*  SCROLLABLE PART */}
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.content}>
        <Text style={styles.header}>SIGN IN YOURSELF</Text>
        <Text style={styles.subText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <View style={styles.redDivider} />

        <View style={styles.card}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            style={[styles.input, loading && styles.disabledInput]}
            placeholder="Enter email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            style={[styles.input, loading && styles.disabledInput]}
            placeholder="Enter password"
          />

          <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.checkboxText}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.disabledBtn]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.redLink}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
              <Text style={styles.redLink}>Lost your password?</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
        <Footer />
    </ScrollView>
  </SafeAreaView>
    </MainLayout>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' , paddingTop:80, paddingBottom:140},
  header: { fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  subText: { textAlign: 'center', fontSize: 13, color: '#333', marginVertical: 10, paddingHorizontal: 10 },
  redDivider: { width: 45, height: 4, backgroundColor: '#c9060a', marginBottom: 25 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#eee',
    // High shadow to match shadow-[0_8px_20px_rgba(0,0,0,0.25)]
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  errorText: { color: '#c9060a', fontSize: 13, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    padding: 10, 
    marginBottom: 15, 
    fontSize: 14,
    borderRadius: 2
  },
  disabledInput: { backgroundColor: '#f5f5f5', opacity: 0.6 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { 
    width: 18, 
    height: 18, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    marginRight: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkboxActive: { backgroundColor: '#c9060a', borderColor: '#c9060a' },
  checkboxText: { fontSize: 14 },
  loginBtn: { 
    backgroundColor: '#c9060a', 
    padding: 14, 
    alignItems: 'center', 
    borderRadius: 2 
  },
  disabledBtn: { opacity: 0.5 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  footerLinks: { flexDirection: 'row', marginTop: 15 },
  redLink: { color: '#c9060a', fontSize: 14 },
  separator: { marginHorizontal: 5 }
});

export default SignInScreen;

function loginUser(arg0: string, password: string) {
  throw new Error('Function not implemented.');
}
