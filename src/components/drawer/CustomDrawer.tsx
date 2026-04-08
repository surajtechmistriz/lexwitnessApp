import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/colors';

const CustomDrawer = ({ navigation }) => {
  const { userData, logout } = useAuth();

  return (
    <View style={styles.container}>
      
      {/* USER INFO */}
      <View style={styles.userInfoSection}>
        <Text style={styles.userName}>
          {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
      </View>

      {/* MENU ITEMS */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Subscription')}
        style={styles.drawerItem}
      >
        <Text style={styles.menuText}>My Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileTab')}
        style={styles.drawerItem}
      >
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SettingTab')}
        style={styles.drawerItem}
      >
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={logout} 
        style={[styles.drawerItem, styles.logoutItem]}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userInfoSection: {
    marginBottom: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Square separator
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userEmail: {
    color: '#777',
    marginTop: 4,
  },
  drawerItem: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Blocky background
    // borderRadius: 0 is the default for Views, so we just omit it
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  logoutItem: {
    marginTop: 'auto', // Pushes logout to the bottom
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'red',
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomDrawer;