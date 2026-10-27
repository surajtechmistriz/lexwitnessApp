import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
// import { LightColors, DarkColors } from '../../constants/colors';
import { useTheme } from '../../store/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../common/ConfirmationModal';
import { logoutApi } from '../../features/auth/api/auth';

const CustomDrawer = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { isLoggedIn, user, isHydrated } = auth;
  const { isDark, colors } = useTheme();

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Create styles with current theme
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // ------
  // NAVIGATION FUNCTIONS
  // ------

  const goToSubscription = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('Subscription');
    }, 200);
  };

  const goToDashboard = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 250);
  };

  const goToSignIn = () => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate('SignIn');
    }, 250);
  };

  const handleNavigate = (screen: string) => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 200);
  };

  // ------HANDLE LOGOUT------

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Call logout API (don't stop logout if API fails)
      try {
        await logoutApi();
      } catch (e) {
        console.log('Logout API failed', e);
      }

      // Clear storage
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('subscription'),
        AsyncStorage.removeItem('nextSubscriptions'),
        AsyncStorage.removeItem('persist:root'),
      ]);

      // Close modal
      setShowLogoutModal(false);

      Toast.show({
        type: 'success',
        text1: '👋 Logged Out',
        text2: 'You have been successfully logged out',
        position: 'top',
      });

      // Clear redux
      dispatch(logout());

      // Close drawer
      navigation.closeDrawer();

      // Navigate to login
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'MainApp' }, { name: 'SignIn' }],
          }),
        );
      }, 250);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out Lex Witness app! Download now and explore amazing features.',
        title: 'Lex Witness',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  // ------Computed values------
  const initials = React.useMemo(() => {
    return (
      `${user?.first_name?.[0] ?? ''}${
        user?.last_name?.[0] ?? ''
      }`.toUpperCase() || 'G'
    );
  }, [user?.first_name, user?.last_name]);

  // ------Menu configuration------
  const menuSections = [
    {
      title: 'MAIN',
      items: isLoggedIn
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
          ],
    },
    {
      title: 'LEGAL',
      items: [
        {
          id: 'about',
          label: 'About Us',
          icon: 'info',
          onPress: () => handleNavigate('AboutUs'),
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          icon: 'shield',
          onPress: () => handleNavigate('PrivacyPolicy'),
        },
        {
          id: 'terms',
          label: 'Terms & Conditions',
          icon: 'file-text',
          onPress: () => handleNavigate('TermsAndConditions'),
        },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        {
          id: 'contact',
          label: 'Contact Us',
          icon: 'phone',
          onPress: () => handleNavigate('ContactUs'),
        },
      ],
    },
  ];

  const quickActions = [
    { id: 'share', icon: 'share-2', label: 'Share App', onPress: handleShare },
    {
      id: 'settings',
      icon: 'settings',
      label: 'Settings',
      onPress: () => setSettingsOpen(p => !p),
    },
  ];

  // ------Render settings panel with dark mode toggle------
  const renderSettingsPanel = () => (
    <View style={[styles.settingsBox, { backgroundColor: colors.card }]}>
      <View style={styles.row}>
        <Icon name="bell" size={18} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>
          Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.row, styles.lastRow]}>
        <Icon name="moon" size={18} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={(_value: boolean) => {
            dispatch(toggleTheme());
          }}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDark ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Current theme indicator */}
      <View style={styles.themeIndicator}>
        <View
          style={[
            styles.themeDot,
            { backgroundColor: isDark ? '#fff' : '#000' },
          ]}
        />
        <Text style={[styles.themeText, { color: colors.textSecondary }]}>
          {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
        </Text>
      </View>
    </View>
  );

  if (!isHydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.closeDrawer()}
        >
          <Icon name="x" size={22} color={colors.text} />
        </TouchableOpacity>

        <LinearGradient
          colors={isDark ? ['#1e293b', '#0f172a'] : ['#fef2f2', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {isLoggedIn ? (
            <View style={styles.profileContainer}>
              <View style={[styles.profileRing, { overflow: 'hidden' }]}>
                <LinearGradient
                  colors={['#c9060a', '#ef4444']}
                  style={[styles.profileGradient, { overflow: 'hidden' }]}
                >
                  <Text style={styles.initials}>{initials}</Text>
                </LinearGradient>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={[styles.fullName, { color: colors.text }]}>
                  {`${user?.first_name || ''} ${
                    user?.last_name || ''
                  }`.trim() || 'User'}
                </Text>
                <View style={styles.emailContainer}>
                  <Icon name="mail" size={12} color={colors.textMuted} />
                  <Text style={styles.emailText} numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.guestProfile}>
              <View style={[styles.guestIconRing, { overflow: 'hidden' }]}>
                <Icon name="users" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.guestTitle, { color: colors.text }]}>
                Hi, Guest
              </Text>
              <Text
                style={[styles.guestSubtitle, { color: colors.textSecondary }]}
              >
                Sign in to access exclusive content
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Sections */}
        <View style={styles.menuSection}>
          {menuSections.map(section => (
            <View key={section.title} style={{ marginBottom: 18 }}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                {section.title}
              </Text>
              {section.items.map(item => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.menuIconChip,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Icon name={item.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Icon
                    name="chevron-right"
                    size={14}
                    color={colors.textMuted}
                  />
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsArea}>
          <Text style={[styles.quickTitle, { color: colors.textMuted }]}>
            Quick Actions
          </Text>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickItem}
              onPress={action.onPress}
            >
              <Icon name={action.icon} size={18} color={colors.text} />
              <Text style={[styles.quickLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {settingsOpen && renderSettingsPanel()}

        {/* Divider */}
        {isLoggedIn && (
          <>
            <View style={styles.dividerContainer}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(true)}
                style={[
                  styles.logoutMenuItem,
                  { backgroundColor: colors.card },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.logoutIconWrapper,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Icon name="log-out" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.logoutLabel, { color: colors.primary }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* 
<View style={styles.socialSection}>
  <Text style={[styles.socialTitle, { color: colors.textSecondary }]}>
    Connect With Us
  </Text>

  <View style={styles.socialIcons}>
    <TouchableOpacity
      onPress={() => Linking.openURL('https://wa.me/+919876543210')}
    >
      <Ionicons
        name="logo-whatsapp"
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => Linking.openURL('tel:+919876543210')}
    >
      <Feather
        name="phone-call"
        size={22}
        color={colors.primary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => Linking.openURL('mailto:info@lexwitness.com')}
    >
      <Feather
        name="mail"
        size={22}
        color={colors.primary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() =>
        Linking.openURL('https://www.linkedin.com/company/lexwitness')
      }
    >
      <Ionicons
        name="logo-linkedin"
        size={24}
        color={colors.primary}
      />
    </TouchableOpacity>
  </View>
</View> */}

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © {new Date().getFullYear()} All rights reserved
          </Text>
        </View>
      </ScrollView>
      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        loading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
};

// ------Styles------
const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flexGrow: 1 },

    // Header
    headerSection: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
    headerGradient: {
      borderRadius: 24,
      padding: 20,
      borderWidth: 2,
      borderColor: '#c6090a',
    },
    closeButton: {
      position: 'absolute',
      top: 12,
      right: 20,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    // Profile
    profileContainer: { flexDirection: 'row', alignItems: 'center' },
    profileRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    profileGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    initials: { fontSize: 24, fontWeight: '600', color: '#ffffff' },
    profileInfo: { marginLeft: 16, flex: 1 },
    welcomeText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '500',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    fullName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
    emailContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    emailText: { fontSize: 12, color: colors.textMuted, flex: 1 },

    // Guest
    guestProfile: { alignItems: 'center' },
    guestIconRing: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestTitle: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
    guestSubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 16 },

    // Menu
    menuSection: { paddingHorizontal: 20, marginTop: 8 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginBottom: 2,
    },
    menuIconChip: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    menuLabel: { flex: 1, fontSize: 14, fontWeight: '600' as const },

    // Quick Actions
    quickActionsArea: { paddingHorizontal: 20, marginBottom: 4 },
    quickTitle: {
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
    quickItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 8,
      gap: 12,
    },
    quickLabel: { fontSize: 14, fontWeight: '500' },

    // Settings
    settingsBox: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastRow: { borderBottomWidth: 0 },
    label: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      fontWeight: '600' as const,
    },
    themeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    themeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    themeText: {
      fontSize: 12,
      fontWeight: '500',
    },

    // Divider
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginVertical: 24,
    },
    dividerLine: { flex: 1, height: 1 },

    // Logout
    logoutSection: { paddingHorizontal: 20, marginBottom: 32 },
    logoutMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 14,
    },
    logoutIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
      borderWidth: 1,
    },
    logoutLabel: { fontSize: 15, fontWeight: '600' as const },

    //socail icons

    // socialSection: {
    //   alignItems: 'center',
    //   marginBottom: 2,
    //   marginTop: 30,
    // },

    // socialTitle: {
    //   fontSize: 12,
    //   fontWeight: '600' as const,
    //   marginBottom: 12,
    // },

    // socialIcons: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   gap: 24,
    // },

    // Footer
    footerSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
      marginTop: 'auto',
    },
    copyright: { fontSize: 11, textAlign: 'center' },
  });

export default CustomDrawer;
