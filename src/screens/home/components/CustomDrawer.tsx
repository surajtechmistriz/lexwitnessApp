import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';

const CustomDrawer = ({ navigation }) => {
  const dispatch = useDispatch();

  const { isLoggedIn, user, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  // Wait until auth loads
  if (!isHydrated) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      
      {/* USER / AUTH SECTION */}
      <View style={styles.userInfoSection}>
        {isLoggedIn ? (
          <>
            <Text style={styles.userName}>
              {user?.name || 'Welcome User'}
            </Text>

            <Text style={styles.userEmail}>
              {user?.email || ''}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.userName}>Welcome Guest</Text>
          </>
        )}
      </View>

      {/*  MENU */}
      {isLoggedIn ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('Subscription')}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>My Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'ProfileTab',
              })
            }
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.drawerItem, styles.logoutItem]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
  onPress={() => navigation.navigate('Subscription')}
  style={styles.drawerItem}
>
  <Text style={styles.menuText}>Subscribe</Text>
   </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  userInfoSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: '#f9f9f9',
  },

  menuText: {
    fontSize: 15,
    color: '#333',
  },

  logoutItem: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'red',
  },

  logoutText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});