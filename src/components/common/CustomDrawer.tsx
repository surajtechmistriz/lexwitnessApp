import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const CustomDrawer = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  // if (!isHydrated) return null;

  /* ---------------- NAVIGATION HELPERS ---------------- */

  const goToSubscription = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('MainTabs', {
        screen: 'HomeTab',
        params: { screen: 'Subscription' },
      });
    }, 200);
  };

  const goToDashboard = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('MainTabs', { screen: 'AccountTab' });
    }, 250);
  };

  const goToSignIn = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('MainTabs', {
        screen: 'AccountTab',
        params: { screen: 'SignIn' },
      });
    }, 250);
  };

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      type: 'info',
      text1: '👋 Logged Out',
      text2: 'You have been successfully logged out',
      position: 'top',
      visibilityTime: 2500,
    });
    goToSignIn();
  };

 const initials = React.useMemo(() => {
  if (!user) return 'G';

  const first = user?.first_name?.[0] || '';
  const last = user?.last_name?.[0] || '';

  const value = `${first}${last}`.toUpperCase();

  return value || 'G';
}, [user]);

if (!isHydrated) return null;

  const menuItems = isLoggedIn
    ? [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'grid',
          onPress: goToDashboard,
        },
        {
          id: 'subscribe',
          label: 'Subscribe',
          icon: 'shopping-bag',
          onPress: goToSubscription,
        },
      ]
    : [
        {
          id: 'signin',
          label: 'Sign In',
          icon: 'arrow-right',
          onPress: goToSignIn,
        },
        {
          id: 'subscribe',
          label: 'Subscribe',
          icon: 'shopping-bag',
          onPress: goToSubscription,
        },
      ];

  const quickActions = [
    { id: 'help', icon: 'help-circle', label: 'Help Center' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Header with Accent */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#fef2f2', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
           {isLoggedIn ? (
  <View
    key={`${user?.email}-${isLoggedIn}`}
    style={styles.profileContainer}
  >
                <View key={user?.email || 'guest'} style={styles.profileRing}>
                  <LinearGradient
                    colors={['#c9060a', '#ef4444']}
                    style={styles.profileGradient}
                  >
                    <Text style={styles.initials}>{initials}</Text>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.welcomeText}>Welcome back</Text>
                  <Text style={styles.fullName}>
                    {`${user?.first_name || ''} ${
                      user?.last_name || ''
                    }`.trim() || 'User'}
                  </Text>
                  <View style={styles.emailContainer}>
                    <Icon name="mail" size={12} color="#9ca3af" />
                    <Text style={styles.emailText} numberOfLines={1}>
                      {user?.email || ''}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.guestProfile}>
                <View style={styles.guestIconRing}>
                  <Icon name="users" size={28} color="#c9060a" />
                </View>
                <Text style={styles.guestTitle}>Guest User</Text>
                <Text style={styles.guestSubtitle}>
                  Sign in to access exclusive content
                </Text>
                {/* <TouchableOpacity style={styles.guestSignInBtn} onPress={goToSignIn}>
                  <Text style={styles.guestSignInText}>Sign In</Text>
                  <Icon name="arrow-right" size={14} color="#c9060a" />
                </TouchableOpacity> */}
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Menu Items with Modern Layout */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>MAIN MENU</Text>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Icon
                  name={item.icon}
                  size={20}
                  color="#c9060a"
                  strokeWidth={1.5}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon
                name="chevron-right"
                size={16}
                color="#d1d5db"
                style={styles.menuChevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActionsArea}>
          <View style={styles.quickHeader}>
            <View style={styles.quickDot} />
            <Text style={styles.quickTitle}>Quick Actions</Text>
          </View>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickItem}
              activeOpacity={0.7}
            >
              <Icon name={action.icon} size={18} color="#64748b" />
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider with Accent */}
        {isLoggedIn && (
          <>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              {/* <View style={styles.dividerDot} /> */}
              <View style={styles.dividerLine} />
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutMenuItem}
                activeOpacity={0.7}
              >
                <View style={styles.logoutIconWrapper}>
                  <Icon name="log-out" size={20} color="#c9060a" />
                </View>
                <Text style={styles.logoutLabel}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer with Minimal Design */}
        <View style={styles.footerSection}>
          <View style={styles.footerBrand}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>Lex Witness</Text>
          </View>
         <Text style={styles.copyright}>
  © {new Date().getFullYear()} All rights reserved
</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  headerGradient: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fef2f2',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
  },
  profileRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    padding: 3,

    overflow: 'hidden', // IMPORTANT

    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  profileGradient: {
    flex: 1,
    borderRadius: 32,

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden', // IMPORTANT
  },
  initials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emailText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  guestProfile: {
    alignItems: 'center',
  },
  guestIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  guestSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  guestSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#fef2f2',
    borderRadius: 20,
  },
  guestSignInText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c9060a',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
    backgroundColor: '#ffffff',
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  menuChevron: {
    opacity: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c9060a',
    marginHorizontal: 8,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
  },
  logoutIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c9060a',
  },
  footerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    marginTop: 'auto',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#c9060a',
    marginRight: 8,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  copyright: {
    fontSize: 11,
    color: '#d1d5db',
    textAlign: 'center',
  },
  quickActionsArea: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  quickDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#c9060a',
    marginRight: 8,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 12,
  },
  quickLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});
