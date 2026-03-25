import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // 1. Import hook
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust path as needed
import SearchOverlay from './SearchOverlay';
import DrawerUI from './Drawer';
import { getMenu } from '../services/api/menubar';

const Header = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [categories, setCategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);


  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getMenu();
      setCategories(res?.data || res || []);
    } catch (err) {
      console.log(err);
    }
  };

  fetchCategories();
}, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          {/* MENU */}
          <TouchableOpacity onPress={() => setDrawerVisible(true)}>
            <Entypo name="menu" size={24} color="black" />
          </TouchableOpacity>

          {/* SEARCH */}
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setIsSearchVisible(true)}
          >
            <Ionicons name="search" size={20} />
          </TouchableOpacity>
        </View>

        <SearchOverlay
          visible={isSearchVisible}
          onClose={() => setIsSearchVisible(false)}
        />

        {/* LOGO */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
          style={styles.center}
        >
          <Image
            source={require('../assets/main-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* RIGHT */}
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Entypo name="text-document" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Entypo name="user" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= DRAWER ================= */}
      {drawerVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setDrawerVisible(false)}
          />

          <View style={styles.drawerContainer}>
            <DrawerUI 
            categories={categories}
            onClose={() => setDrawerVisible(false)} />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
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

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },

  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 20,
  },
});

export default Header;
