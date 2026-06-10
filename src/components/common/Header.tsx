import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';

type HeaderProps = {
  navigation: any;
  onSearchPress: () => void;
};

const Header = ({ navigation, onSearchPress }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  /* ---------------- DRAWER ---------------- */
  const handleToggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  /* ---------------- GO HOME ---------------- */
  const handleGoHome = () => {
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
    });
  };

  /* ---------------- LOGIN ---------------- */
  const goToLogin = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* LEFT */}
      <View style={styles.sideContainer}>
        <TouchableOpacity
          onPress={handleToggleDrawer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={28} color="#c9060a" />
        </TouchableOpacity>
      </View>

      {/* CENTER */}
      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
          <Image
            source={require('../../assets/main-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      <View style={styles.sideContainer}>
        <TouchableOpacity
          onPress={onSearchPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Entypo name="magnifying-glass" size={24} color="#c9060a" />
        </TouchableOpacity>
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

    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderColor: '#eee',

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

  logo: {
    width: 130,
    height: 55,
  },
});
