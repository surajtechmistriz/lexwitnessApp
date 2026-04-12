// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Alert
// } from 'react-native';

// import { navigationRef } from '../navigation/AppNavigator';
// import { useAuth } from '../context/AuthContext';
// import NetInfo from '@react-native-community/netinfo';
// import { Animated } from 'react-native';
// type Props = {
//   visible: boolean;
//   onSwitchToSignIn: () => void;
// };

// const RegisterPopup = ({ visible, onSwitchToSignIn }: Props) => {
//   const [isConnected, setIsConnected] = useState(true);
//   const { isLoggedIn, login } = useAuth();

//   const fadeAnim = useState(new Animated.Value(1))[0];
// const translateX = useState(new Animated.Value(0))[0];

//   const initialFormState = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//   };

//   const [form, setForm] = useState(initialFormState);

//   // Reset form on logout
//   useEffect(() => {
//     if (!isLoggedIn) {
//       setForm(initialFormState);
//     }
//   }, [isLoggedIn]);

//   // Network listener (optional use)
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected ?? true);
//     });

//     return unsubscribe;
//   }, []);

//   const handleRegister = async () => {
//     const { firstName, lastName, email, phone } = form;
// // 
//     if (!firstName || !lastName || !email || !phone) {
//       Alert.alert("Required", "Please fill in all details to register.");
//       return;
//     }

//     if (!isConnected) {
//       Alert.alert("No Internet", "Please check your connection.");
//       return;
//     }

//     await login(form);

//     // Navigate after success
//     if (navigationRef.isReady()) {
//       navigationRef.navigate('Subscription' as never);
//     }
//   };

//  const handleGoToSignIn = () => {
//   Animated.parallel([
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }),
//     Animated.timing(translateX, {
//       toValue: -50,
//       duration: 300,
//       useNativeDriver: true,
//     }),
//   ]).start();

//   setTimeout(() => {
//     fadeAnim.setValue(1);
//     translateX.setValue(0);
//     onSwitchToSignIn();
//   }, 280); // 👈 delay before switching modal
// };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//       presentationStyle="overFullScreen"
//     >
//       <View style={styles.overlay}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.container}
//         >
//             <Animated.View
//     style={{
//       opacity: fadeAnim,
//       transform: [{ translateX }],
//       width: '100%',
//       alignItems: 'center',
//     }}
//   >
//           <Text style={styles.title}>Register to Continue</Text>
//           <Text style={styles.subtitle}>Fill your details to register</Text>

//           <View style={styles.form}>
//             <TextInput
//               style={styles.input}
//               placeholder="First Name"
//               placeholderTextColor="#999"
//               value={form.firstName}
//               onChangeText={(v) => setForm({ ...form, firstName: v })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Last Name"
//               placeholderTextColor="#999"
//               value={form.lastName}
//               onChangeText={(v) => setForm({ ...form, lastName: v })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor="#999"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={form.email}
//               onChangeText={(v) => setForm({ ...form, email: v })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               placeholderTextColor="#999"
//               keyboardType="phone-pad"
//               value={form.phone}
//               onChangeText={(v) => setForm({ ...form, phone: v })}
//             />

//             <TouchableOpacity style={styles.button} onPress={handleRegister}>
//               <Text style={styles.buttonText}>Register</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account? </Text>
//            <TouchableOpacity onPress={handleGoToSignIn}>
//               <Text style={styles.linkText}>Sign In</Text>
//             </TouchableOpacity>
//           </View>
//           </Animated.View>
//         </KeyboardAvoidingView>
//       </View>
//     </Modal>
//   );
// };


// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//  container: {
//   backgroundColor: 'white',
//   width: '90%',
//   height: 420, // 👈 FIXED HEIGHT (same in both)
//   padding: 25,
//   borderRadius: 12,
//   alignItems: 'center',
//   justifyContent: 'center', // 👈 centers content properly
// },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#000' },
//   subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
//   form: { 
//   width: '100%',
//   flex: 1,              // 👈 ADD THIS
//   justifyContent: 'center' // 👈 keeps centered
// },
//   input: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     marginBottom: 12,
//     color: '#000',
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#c9060a',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//  footer: { 
//   flexDirection: 'row',
//   position: 'absolute',   // 👈 FIXED POSITION
//   bottom: 20,
//   alignItems: 'center' 
// },
//   footerText: { fontSize: 14, color: '#000' },
//   linkText: { fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline', color: '#c9060a' },
// });

// export default RegisterPopup;