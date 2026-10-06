import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootState } from '../../store/store';
import { useTheme } from '../../store/hooks/useTheme';

type HeaderProps = {
  navigation?: any; //  ADD
  onSearchPress: () => void;
};

const Header = ({ navigation: _navigation, onSearchPress }: HeaderProps) => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width * 0.35, 150);
  const horizontalPadding = Math.max(12, width * 0.04);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // Toggle Drawer
  const handleToggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // Go Home
  const handleGoHome = () => {
    navigation.navigate('HomeTab');
  };

  // Go to Login
  const goToLogin = () => {
    navigation.navigate('SignIn');
  };

  // Go to Dashboard
  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: 0,
          paddingHorizontal: horizontalPadding,
          minHeight: width >= 768 ? 82 : 70,
          backgroundColor: colors.background,
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
                ? require('../../assets/icons/logo-dark.png')
                : require('../../assets/icons/main-logo-removebg-preview.png')
            }
            style={[
              styles.logo,
              {
                width: logoWidth,
                height: logoWidth * 0.42,
              },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RIGHT - Search + Login/Profile */}
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={onSearchPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Entypo name="magnifying-glass" size={24} color={colors.primary} />
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 1,
  },

  sideContainer: {
    width: '15%',
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  rightContainer: {
    width: '22%',
    minWidth: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    aspectRatio: 2.36,
  },
});

export default Header;
