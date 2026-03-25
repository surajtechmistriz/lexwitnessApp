// import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
// import { getMenu } from '../../services/api/menubar';

type Category = {
  id: number;
  name: string;
};

type Props = {
    categories: Category[];
  onClose: () => void;
};

const DrawerUI: React.FC<Props> = ({ categories, onClose }) => {
   
  return (
    <View style={styles.drawer}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/main-logo.png')}
          style={styles.logo}
        />

        {/* CLOSE BUTTON */}
        <TouchableOpacity onPress={onClose}>
          <Entypo name="cross" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* MENU */}
      <ScrollView style={styles.menuContainer}>
        {categories?.length === 0 ? (
          <Text style={{ color: 'white', padding: 15 }}>Loading...</Text>
        ) : (
          categories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Entypo name="user" size={18} color="white" />
          <Text style={styles.footerText}>Sign In</Text>
        </View>

        <View style={styles.socialContainer}>
          <View style={[styles.socialBox, { backgroundColor: '#0A66C2' }]} />
          <View style={[styles.socialBox, { backgroundColor: '#25D366' }]} />
        </View>
      </View>
    </View>
  );
};

export default DrawerUI;

const styles = StyleSheet.create({
  drawer: {
    width: 260,
    height: '100%',
    backgroundColor: '#333',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#555',
  },

  logo: {
    width: 40,
    height: 40,
  },

  menuContainer: {
    flex: 1,
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#555',
  },

  menuText: {
    color: 'white',
    fontSize: 14,
  },

  footer: {
    backgroundColor: '#545454',
    borderTopWidth: 1,
    borderColor: '#555',
    padding: 15,
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  footerText: {
    color: 'white',
  },

  socialContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  socialBox: {
    width: 40,
    height: 25,
  },
});
