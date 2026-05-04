// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Dimensions,
//   Linking,
// } from 'react-native';

// import Entypo from 'react-native-vector-icons/Entypo';
// import Icon from 'react-native-vector-icons/FontAwesome6';

// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { logout } from '../../redux/slices/authSlice';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// const DRAWER_MARGIN_TOP = 65;

// type Category = {
//   id: number;
//   name: string;
//   slug: string;
// };

// type Props = {
//   categories: Category[];
//   onClose: () => void;
//   navigation: NativeStackNavigationProp<any>;
// };

// const DrawerUI: React.FC<Props> = ({ categories, onClose, navigation }) => {
//   const dispatch = useDispatch();

//   const { isLoggedIn, user } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const handleLogout = () => {
//     dispatch(logout());
//     onClose();
//   };

//   return (
//     <View style={styles.drawer}>

//       {/* HEADER */}
//       <View style={styles.header}>
//         <Image
//           source={require('../../assets/drawer.png')}
//           style={styles.logo}
//         />
//         <TouchableOpacity onPress={onClose}>
//           <Entypo name="cross" size={22} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/*  AUTH / USER SECTION */}
//     <View style={styles.userSection}>
//   {isLoggedIn ? (
//     <>
//       <Text style={styles.userName}>
//         {user?.name || 'Welcome User'}
//       </Text>

//       <TouchableOpacity onPress={() => {
//         navigation.navigate('Profile');
//         onClose();
//       }}>
//         <Text style={styles.link}>My Profile</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={handleLogout}>
//         <Text style={styles.logout}>Logout</Text>
//       </TouchableOpacity>
//     </>
//   ) : (
//     <>
//       <TouchableOpacity onPress={() => {
//         navigation.navigate('SignIn');
//         onClose();
//       }}>
//         <Text style={styles.link}>Sign In</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => {
//         navigation.navigate('Register');
//         onClose();
//       }}>
//         <Text style={styles.link}>Register</Text>
//       </TouchableOpacity>
//     </>
//   )}
// </View>

//       {/* MENU */}
//       <ScrollView style={styles.menuContainer}>
//         {categories?.map(item => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.menuItem}
//             onPress={() => {
//               navigation.navigate('Category', { slug: item.slug });
//               onClose();
//             }}
//           >
//             <Text style={styles.menuText}>{item.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//     </View>
//   );
// };

// export default DrawerUI;

// const styles = StyleSheet.create({
//   drawer: {
//     width: 260,
//     height: SCREEN_HEIGHT - DRAWER_MARGIN_TOP,
//     backgroundColor: '#333',
//     marginTop: DRAWER_MARGIN_TOP,
//   },

//   userSection: {
//   padding: 15,
//   borderBottomWidth: 1,
//   borderColor: '#555',
// },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderColor: '#555',
//   },

//   logo: {
//     width: 40,
//     height: 40,
//   },

//   /*  AUTH SECTION */
//   authSection: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderColor: '#555',
//   },

//   userName: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },

//   link: {
//     color: '#ddd',
//     marginBottom: 8,
//   },

//   logout: {
//     color: '#ff4d4d',
//     marginTop: 10,
//     fontWeight: '600',
//   },

//   authBtn: {
//     color: '#fff',
//     fontSize: 14,
//     marginBottom: 10,
//   },

//   menuContainer: {
//     flex: 1,
//   },

//   menuItem: {
//     paddingVertical: 14,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderColor: '#555',
//   },

//   menuText: {
//     color: 'white',
//     fontSize: 14,
//   },

//   loading: {
//     color: 'white',
//     padding: 15,
//   },

//   footer: {
//     backgroundColor: '#545454',
//     borderTopWidth: 1,
//     borderColor: '#555',
//     padding: 15,
//     paddingBottom: 25,
//   },

//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },

//   socialContainer: {
//     flexDirection: 'row',
//     gap: 10,
//   },

//   btn: {
//     width: 36,
//     height: 26,
//     borderWidth: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   linkedin: {
//     backgroundColor: '#0A66C2',
//     borderColor: '#0A66C2',
//   },

//   whatsapp: {
//     backgroundColor: '#25D366',
//     borderColor: '#25D366',
//   },
// });