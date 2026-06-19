import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootState } from '../../redux/store';
import { useTheme } from '../../redux/useTheme';

type HeaderProps = {
  onSearchPress: () => void;
  navigation?: any;
};

const Header = ({ onSearchPress, navigation: propNavigation }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  // ------FIXED NAVIGATION FUNCTIONS ------

  // 1. Toggle Drawer
  const handleToggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // 2. Go Home
  const handleGoHome = () => {
    navigation.navigate('HomeTab');
  };

  // 3. Go to Login
  const goToLogin = () => {
    navigation.navigate('SignIn');
  };

  // 4. Go to Dashboard (if logged in)
  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* LEFT - Menu Button */}
      <View style={styles.sideContainer}>
        <TouchableOpacity
          onPress={handleToggleDrawer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* CENTER - Logo */}
      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
          <Image
            source={
              isDark
                ? require('../../assets/logo-dark.png')
                : require('../../assets/main-logo-removebg-preview.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RIGHT - Search + Login/Profile */}
      <View style={styles.rightContainer}>
        {/* Search Button */}
        <TouchableOpacity
          onPress={onSearchPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Entypo name="magnifying-glass" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Login/Profile Button */}
        {!isLoggedIn ? (
          <TouchableOpacity
            onPress={goToLogin}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.loginButton}
          >
            <Ionicons name="person-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={goToDashboard}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.loginButton}
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 1,
    minHeight: 70,
  },

  sideContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
  },

  searchButton: {
    padding: 4,
  },

  loginButton: {
    padding: 4,
    marginLeft: 8,
  },

  logo: {
    width: 130,
    height: 55,
  },
});
