import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // 1. Import hook
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust path as needed

const Header = () => {
  // 2. Initialize navigation with types
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity>
          <Entypo name="menu" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="search" style={styles.icon} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Image
          source={require('../assets/main-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.right}>
        {/* Navigates to Registration/Profile Page */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Entypo name="text-document" size={18} color="black" />
        </TouchableOpacity>

        {/* Navigates to Registration/Profile Page */}
        <TouchableOpacity onPress={()=> navigation.navigate('SignIn')} >
          <Entypo name="user" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000', // Added for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1, // Ensure it doesn't block icon clicks
  },
  logoImage: { width: 120, height: 40 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  icon: { marginLeft: 8 },
});

export default Header;