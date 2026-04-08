import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/colors';

type HeaderProps = {
  onSearchPress: () => void;
  title?: string;
};

const Header = ({ onSearchPress }: HeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { isLoggedIn, userData, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuVisible(false);
    navigation.navigate('HomeTab');
  };

  const getInitials = () => {
    if (!userData?.firstName) return 'U';
    return `${userData.firstName[0]}${
      userData.lastName ? userData.lastName[0] : ''
    }`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeTab')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../assets/main-logo.png')} // Adjust the path to match your folder structure
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* RIGHT */}
      <View style={styles.right}>
        {/* Search */}
        <TouchableOpacity onPress={onSearchPress}>
          <Entypo name="magnifying-glass" size={20} color="#111" />
        </TouchableOpacity>

        {/* AUTH */}
        {isLoggedIn ? (
          <View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </TouchableOpacity>

            {menuVisible && (
              <>
                {/* BACKDROP */}
                <Pressable
                  style={styles.backdrop}
                  onPress={() => setMenuVisible(false)}
                />

                {/* DROPDOWN */}
                <View style={styles.dropdown}>
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>
                      {userData?.firstName} {userData?.lastName}
                    </Text>
                    {!!userData?.email && (
                      <Text style={styles.email}>{userData.email}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      navigation.navigate('Subscription');
                    }}
                  >
                    <Text style={styles.menuText}>My Plan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      // Navigate to profile tab or screen
                    }}
                  >
                    <Text style={styles.menuText}>Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                  >
                    <Text style={[styles.menuText, { color: '#ff3b30' }]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Entypo name="user" size={20} color="#111" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 35,
    marginLeft: -10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#eee',
    zIndex: 999,
  },
  userInfo: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  email: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    color: '#222',
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    bottom: -1000,
    left: -1000,
    right: -1000,
  },
});
