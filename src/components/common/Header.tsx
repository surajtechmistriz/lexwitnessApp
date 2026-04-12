import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
// Import the navigationRef from your AppNavigator file
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
    // This helper specifically looks for a navigator that handles 'openDrawer'
    // even if the currently focused screen isn't a direct child.
    navigationRef.dispatch(DrawerActions.toggleDrawer());
  }
};

  const handleGoHome = () => {
    if (navigationRef.isReady()) {
     navigationRef.navigate('AppMain', {
  screen: 'HomeTab',
  params: {
    screen: 'Home',
  },
});
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
        <Image
          source={require('../../assets/main-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.right}>
        <TouchableOpacity onPress={onSearchPress}>
          <Entypo name="magnifying-glass" size={20} color="#111" />
        </TouchableOpacity>

{isLoggedIn ? (
  <TouchableOpacity onPress={handleToggleDrawer}>
    <Ionicons name="menu" size={24} color="#111" />
  </TouchableOpacity>
) : (
  <TouchableOpacity 
    onPress={() => {
       if (navigationRef.isReady()) {
          // Navigate directly to 'SignIn' because it is a sibling of 'AppMain' 
          // in your RootStack.Navigator
          navigationRef.navigate('SignIn'); 
        }
    }}
  >
    <Entypo name="user" size={20} color="#111" />
  </TouchableOpacity>
)}
      </View>
    </View>
  );
};

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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});

export default Header;