import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity>
          <Entypo name="menu" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="search" style={styles.icon} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Image
          source={require('../assets/main-logo.png')}
          style={styles.logoImage}
          //   resizeMode="contain"
        />
      </View>

      <View style={styles.right}>
        <TouchableOpacity>
          <Entypo name="text-document" size={18} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Entypo name="user" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 4, // Android shadow
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  logoImage: {
    width: 120,
    height: 40,
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  icon: {
    fontSize: 20,
    marginLeft: 8,
  },

  explore: {
    fontSize: 16,
    fontWeight: '500',
  },

  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  subscribe: {
    fontSize: 14,
    color: 'red',
    marginLeft: 10,
  },

  signIn: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default Header;
