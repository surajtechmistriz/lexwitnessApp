import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderProps = {
  navigation: any; //  added
  onSearchPress: () => void;
};

const Header = ({ navigation, onSearchPress }: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  /* ---------------- DRAWER ---------------- */
  const handleToggleDrawer = () => {
    navigation.openDrawer(); //  fixed
  };

  /* ---------------- GO HOME ---------------- */
  const handleGoHome = () => {
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'Home',
      },
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
          height: 70 + insets.top,
        },
      ]}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <TouchableOpacity onPress={handleToggleDrawer}>
          <Ionicons name="menu" size={28} color="#c9060a" />
        </TouchableOpacity>
      </View>

      {/* CENTER */}
      <View style={styles.center}>
        <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
          <Image
            source={require('../../assets/main-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <TouchableOpacity onPress={onSearchPress}>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 20,
  },

  left: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  right: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 140,
    height: 65,
  },
});