import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { navigationRef } from '../../navigation/AppNavigator';

type HeaderProps = {
  onSearchPress: () => void;
  title?: string;
};

const Header = ({ onSearchPress }: HeaderProps) => {
  const { isLoggedIn } = useAuth();

const navigation = useNavigation()
const handleToggleDrawer = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.toggleDrawer());
  }
};
 const handleGoHome = () => {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate('Home', {
    screen: 'HomeTabs',
    params: {
      screen: 'HomeTab',
      params: {
        screen: 'Home',
      },
    },
  });
};

  return (
    <View style={styles.container}>

      {/* LEFT: MENU / USER */}
      <View style={styles.left}>
        {isLoggedIn ? (
          <TouchableOpacity onPress={handleToggleDrawer}>
            <Ionicons name="menu" size={28} color="#c9060a" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (navigationRef.isReady()) {
                navigationRef.navigate('SignIn');
              }
            }}
          >
            <Entypo name="user" size={20} color="#111" />
          </TouchableOpacity>
        )}
      </View>

      {/* CENTER: LOGO */}
      <View style={styles.center}>
        <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
          <Image
            source={require('../../assets/main-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* RIGHT: SEARCH */}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 20,
    position: 'relative',
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
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 130,
    height: 65,
  },
});
