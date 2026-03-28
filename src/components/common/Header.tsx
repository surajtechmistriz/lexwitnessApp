import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,

} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import SearchOverlay from './SearchOverlay';
import DrawerUI from './Drawer';
import { getMenu } from '../../services/api/category';

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
      {/* ========== HEADER CONTAINER ========== */}
      <View style={styles.container}>
        {/* LEFT ICONS */}
        <View style={styles.left}>
          {/* MENU ICON */}
          <TouchableOpacity onPress={() => setDrawerVisible(true)}>
            <Entypo name="menu" size={24} color="black" />
          </TouchableOpacity>

          {/* SEARCH ICON */}
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setIsSearchVisible(true)}
          >
            <Ionicons name="search" size={20} />
          </TouchableOpacity>
        </View>

        {/* LOGO */}
<View style={styles.center}>
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Image
      source={require('../../assets/main-logo.png')}
      style={styles.logoImage}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>

        {/* RIGHT ICONS */}
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
            <Entypo name="text-document" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Entypo name="user" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ========== SEARCH OVERLAY MODAL ========== */}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {/* ========== DRAWER ========== */}
      {drawerVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setDrawerVisible(false)}
          />
          <View style={styles.drawerContainer}>
            <DrawerUI
              categories={categories}
              onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />
          </View>
        </>
      )}
    </>
  );
};

// ===================== STYLES =====================
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    zIndex: 0,
  },

  // LEFT ICONS
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10, // ensure icons clickable above logo
  },

  icon: { marginLeft: 8 },

  // LOGO CENTERED
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    // pointerEvents: 'none', // logo does not block touches
    zIndex: 0,
  },

  logoImage: { width: 120, height: 40 },

  // RIGHT ICONS
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    zIndex: 10, // ensure icons clickable above logo
  },

  // DRAWER OVERLAY
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },

  // DRAWER CONTAINER
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 20,
  },
});

export default Header;