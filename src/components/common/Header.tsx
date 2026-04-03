import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Modal, Pressable } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import DrawerUI from './Drawer';
import { getMenu } from '../../services/api/category';

type HeaderProps = {
  onSearchPress: () => void;
};

const Header = ({ onSearchPress }: HeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [categories, setCategories] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, []);

  const checkAuth = async () => {
    const data = await AsyncStorage.getItem('userData');
    if (data) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(data));
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getMenu();
      setCategories(res?.data || res || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userToken'); // remove token too if you use one
    setIsLoggedIn(false);
    setMenuVisible(false);
    navigation.navigate('HomeTab');
  };

  const getInitials = () => {
    if (!userData?.firstName) return 'U';
    return `${userData.firstName[0]}${userData.lastName ? userData.lastName[0] : ''}`.toUpperCase();
  };

  return (
    <>
      <View style={styles.container}>
        {/* LEFT ICONS */}
        <View style={styles.left}>
          <TouchableOpacity onPress={() => setDrawerVisible(true)}>
            <Entypo name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* LOGO */}
        <View style={styles.center}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
            <Image
              source={require('../../assets/main-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* RIGHT CONTENT (CONDITIONAL) */}
      <View style={styles.right}>
  {isLoggedIn ? (
    <View>
      <TouchableOpacity 
        style={styles.avatarCircle} 
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <Text style={styles.avatarText}>{getInitials()}</Text>
      </TouchableOpacity>

      {/* DROPDOWN MENU */}
      {menuVisible && (
        <View style={styles.dropdown}>
          {/*  USER INFO SECTION AT TOP */}
          <View style={styles.userInfoHeader}>
            <Text style={styles.userNameText} numberOfLines={1}>
              {userData?.firstName} {userData?.lastName}
            </Text>
            {userData?.email && (
               <Text style={styles.userEmailText} numberOfLines={1}>
                 {userData.email}
               </Text>
            )}
          </View>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Subscription'); }}>
            <Text style={styles.menuText}>My Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); /* navigation.navigate('Profile'); */ }}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuText, { color: '#c9060a' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ) :  (
            <View style={styles.rightIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
                <Entypo name="text-document" size={18} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Entypo name="user" size={18} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* DRAWER & OVERLAYS */}
      {drawerVisible && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={() => setDrawerVisible(false)} />
          <View style={styles.drawerContainer}>
            <DrawerUI categories={categories} onClose={() => setDrawerVisible(false)} navigation={navigation} />
          </View>
        </>
      )}

      {/* Click outside to close dropdown */}
      {menuVisible && (
        <Pressable style={styles.invisibleClose} onPress={() => setMenuVisible(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
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
    zIndex: 100, // Increased zIndex for dropdown
  },
  left: { zIndex: 10 },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 0,
  },
  logoImage: { width: 120, height: 40 },
  right: { zIndex: 110 },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  // AVATAR STYLES
  avatarCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#c9060a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // DROPDOWN STYLES
  // dropdown: {
  //   position: 'absolute',
  //   top: 45,
  //   right: 0,
  //   backgroundColor: '#fff',
  //   width: 140,
  //   borderRadius: 8,
  //   paddingVertical: 5,
  //   elevation: 5,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 5,
  //   borderWidth: 1,
  //   borderColor: '#f0f0f0',
  // },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    // marginHorizontal: 10,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1001,
  },
  invisibleClose: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 105, // Sit just below dropdown, above header
  },
  userInfoHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9', // Light background to distinguish it
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmailText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    width: 180, // Slightly wider to accommodate full name
    borderRadius: 8,
    paddingVertical: 0, // Changed to 0 so header touches the top
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

});

export default Header;