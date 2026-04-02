import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions, //  Added this
  Linking,    //  Added for opening links
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Get device height for calculations
const { height: SCREEN_HEIGHT } = Dimensions.get('window'); //  Defined height constant
const DRAWER_MARGIN_TOP = 65;

type Category = {
  id: number;
  name: string;
  slug: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  categories: Category[];
  onClose: () => void;
  navigation: NavigationProp;
};

const DrawerUI: React.FC<Props> = ({ categories, onClose, navigation }) => {
  
  // Fixed the openLink function
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.drawer}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://lexwitness.com/wp-content/themes/lexwitness/images/favicon.png',
          }}
          style={styles.logo}
        />

        <TouchableOpacity onPress={onClose}>
          <Entypo name="cross" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* MENU */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {categories?.length === 0 ? (
          <Text style={{ color: 'white', padding: 15 }}>Loading...</Text>
        ) : (
          categories.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('CategoryScreen', {
                  slug: item.slug,
                });
                onClose();
              }}
            >
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {/* LEFT SIDE */}
          <View style={styles.footerLeft}>
            <Entypo name="user" size={18} color="white" />
            <Text style={styles.footerText}>Sign In</Text>
          </View>

          {/* RIGHT SIDE */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.linkedin]}
              onPress={() => openLink('https://www.linkedin.com/')}
            >
              <Icon name="linkedin-in" size={12} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.whatsapp]}
              onPress={() => openLink('https://wa.me/')}
            >
              <Icon name="whatsapp" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DrawerUI;

const styles = StyleSheet.create({
  drawer: {
    width: 260,
    //  Used the defined SCREEN_HEIGHT constant
    height: SCREEN_HEIGHT - DRAWER_MARGIN_TOP, 
    backgroundColor: '#333',
    marginTop: DRAWER_MARGIN_TOP,
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
    paddingBottom: 25, // Added padding for better bottom clearance
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'white',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    width: 36,
    height: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedin: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },
  whatsapp: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
});