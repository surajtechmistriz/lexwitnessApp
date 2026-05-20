import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux/store';

import { logout } from '../../redux/slices/authSlice';

const CustomDrawer = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const { isLoggedIn, user, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isHydrated) return null;

  const handleLogout = () => {
    dispatch(logout());

    navigation.closeDrawer();

    navigation.navigate('MainTabs', {
      screen: 'AccountTab',
      params: {
        screen: 'SignIn',
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* USER SECTION */}
      <View style={styles.userInfoSection}>
        {isLoggedIn ? (
          <>
            <Text style={styles.userName}>
              {`${user?.first_name || ''} ${
                user?.last_name || ''
              }`.trim() || 'Welcome User'}
            </Text>

            <Text style={styles.userEmail}>
              {user?.email || ''}
            </Text>
          </>
        ) : (
          <Text style={styles.userName}>
            Welcome Guest
          </Text>
        )}
      </View>

      {/* MENU */}
      {isLoggedIn ? (
        <>
          {/* DASHBOARD */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainTabs', {
                screen: 'HomeTab',
                params: {
                  screen: 'Dashboard',
                },
              });

              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>
              Dashboard
            </Text>
          </TouchableOpacity>

          {/* MY PLAN */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Subscription');

              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>
              My Plan
            </Text>
          </TouchableOpacity>

          {/* PROFILE */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainTabs', {
                screen: 'HomeTab',
              });

              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>
              Profile
            </Text>
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[
              styles.drawerItem,
              styles.logoutItem,
            ]}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* SIGN IN */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainTabs', {
                screen: 'AccountTab',
                params: {
                  screen: 'SignIn',
                },
              });

              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>
              Sign In
            </Text>
          </TouchableOpacity>

          {/* SUBSCRIBE */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Subscription');

              navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.menuText}>
              Subscribe
            </Text>
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
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  userEmail: {
    color: '#777',
    marginTop: 4,
    fontSize: 13,
  },

  drawerItem: {
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },

  menuText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },

  logoutItem: {
    marginTop: 20,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },

  logoutText: {
    color: '#c9060a',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 15,
  },
});