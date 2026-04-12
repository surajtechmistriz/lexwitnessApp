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
//   Animated,
// } from 'react-native';

// import { navigationRef } from '../navigation/AppNavigator';
// import { useAuth } from '../context/AuthContext';

// type Props = {
//   visible: boolean;
//   onSwitchToRegister: () => void;
// };

// const SignInPopup = ({ visible, onSwitchToRegister }: Props) => {
//   const { isLoggedIn, login } = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const fadeAnim = useState(new Animated.Value(1))[0];
//   const translateX = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     const checkStatus = () => {
//       if (!navigationRef.isReady()) return;

//       const currentRouteName = navigationRef.getCurrentRoute()?.name;
//       const authScreens = ['SignIn', 'Register'];

//       // This DOES NOT control visibility anymore, only parent does
//       if (authScreens.includes(currentRouteName || '')) {
//         return;
//       }
//     };

//     checkStatus();
//     return navigationRef.addListener('state', checkStatus);
//   }, [isLoggedIn]);

//   const handleLogin = async () => {
//     await login({ email, password });
//   };

//   const handleGoToRegister = () => {
//   Animated.parallel([
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }),
//     Animated.timing(translateX, {
//       toValue: 50,
//       duration: 300,
//       useNativeDriver: true,
//     }),
//   ]).start();

//   setTimeout(() => {
//     fadeAnim.setValue(1);
//     translateX.setValue(0);
//     onSwitchToRegister();
//   }, 280);
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
//           <Animated.View
//             style={{
//               opacity: fadeAnim,
//               transform: [{ translateX }],
//               width: '100%',
//               alignItems: 'center',
//             }}
//           >
//             <Text style={styles.title}>Sign In</Text>
// <Text style={styles.subtitle}>Login to continue</Text>
//             <View style={styles.form}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 autoCapitalize="none"
//               />

//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//               />

//               <TouchableOpacity style={styles.button} onPress={handleLogin}>
//                 <Text style={styles.buttonText}>Login</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity onPress={handleGoToRegister}>
//               <Text style={styles.footerText}>
//                 New here? <Text style={styles.linkText}>Register</Text>
//               </Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </KeyboardAvoidingView>
//       </View>
//     </Modal>
//   );
// };

// // Use the same styles as RegisterPopup for a consistent look
// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// container: {
//   backgroundColor: 'white',
//   width: '90%',
//   height: 420, //  FIXED HEIGHT (same in both)
//   padding: 25,
//   borderRadius: 12,
//   alignItems: 'center',
//   justifyContent: 'center', //  centers content properly
// },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#000' },
//   subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
//  form: { 
//   width: '100%',
//   flex: 1,              //  ADD THIS
//   justifyContent: 'center' //  keeps centered
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
//   footer: { 
//   flexDirection: 'row',
//   position: 'absolute',   //  FIXED POSITION
//   bottom: 20,
//   alignItems: 'center' 
// },
//   footerText: { fontSize: 14, color: '#000' },
//   linkText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//     color: '#c9060a',
//   },
// });
// export default SignInPopup;
