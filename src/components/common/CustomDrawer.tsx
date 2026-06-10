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
import Toast from 'react-native-toast-message';

import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useTheme } from '../../hooks/useTheme';

const CustomDrawer = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { isLoggedIn, user, isHydrated } = auth;
  const { isDark, colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Navigation handlers
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

  const handleNavigate = (screen: string) => {
    navigation.closeDrawer();
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      type: 'info',
      text1: 'Logged Out',
      text2: 'You have been successfully logged out',
      position: 'top',
      visibilityTime: 2500,
    });
    goToSignIn();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Lex Witness app! Download now and explore amazing features.',
        title: 'Lex Witness',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  // Computed values
  const initials = React.useMemo(() => {
    return `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() || 'G';
  }, [user?.first_name, user?.last_name]);

  // Menu configuration
  const menuSections = [
    {
      title: 'MAIN',
      items: isLoggedIn
        ? [
            { id: 'dashboard', label: 'Dashboard', icon: 'grid', onPress: goToDashboard },
            { id: 'subscribe', label: 'Subscribe', icon: 'shopping-bag', onPress: goToSubscription },
          ]
        : [
            { id: 'signin', label: 'Sign In', icon: 'arrow-right', onPress: goToSignIn },
            { id: 'subscribe', label: 'Subscribe', icon: 'shopping-bag', onPress: goToSubscription },
          ],
    },
    {
      title: 'LEGAL',
      items: [
        { id: 'about', label: 'About Us', icon: 'info', onPress: () => handleNavigate('AboutUs') },
        { id: 'terms', label: 'Terms & Conditions', icon: 'file-text', onPress: () => handleNavigate('TermsAndConditions') },
        { id: 'privacy', label: 'Privacy Policy', icon: 'shield', onPress: () => handleNavigate('PrivacyPolicy') },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'contact', label: 'Contact Us', icon: 'phone', onPress: () => handleNavigate('ContactUs') },
      ],
    },
  ];

  const quickActions = [
    { id: 'settings', icon: 'settings', label: 'Settings', onPress: () => setSettingsOpen(p => !p) },
    { id: 'share', icon: 'share-2', label: 'Share App', onPress: handleShare },
  ];

  // Render settings panel
  const renderSettingsPanel = () => (
    <View style={[styles.settingsBox, { backgroundColor: colors.card }]}>
      <View style={styles.row}>
        <Icon name="bell" size={18} color="#c9060a" />
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>
      <View style={styles.row}>
        <Icon name="moon" size={18} color="#c9060a" />
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={() => dispatch(toggleTheme())} />
      </View>
    </View>
  );

  if (!isHydrated) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.closeDrawer()}>
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
              <View style={styles.profileRing}>
                <LinearGradient colors={['#c9060a', '#ef4444']} style={styles.profileGradient}>
                  <Text style={styles.initials}>{initials}</Text>
                </LinearGradient>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={[styles.fullName, { color: colors.text }]}>
                  {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
                </Text>
                <View style={styles.emailContainer}>
                  <Icon name="mail" size={12} color="#9ca3af" />
                  <Text style={styles.emailText} numberOfLines={1}>{user?.email || ''}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.guestProfile}>
              <View style={styles.guestIconRing}>
                <Icon name="users" size={28} color="#c9060a" />
              </View>
              <Text style={styles.guestTitle}>Hi, Guest</Text>
              <Text style={styles.guestSubtitle}>Sign in to access exclusive content</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Menu Sections */}
        <View style={styles.menuSection}>
          {menuSections.map(section => (
            <View key={section.title} style={{ marginBottom: 18 }}>
              <Text style={styles.sectionLabel}>{section.title}</Text>
              {section.items.map(item => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: colors.border }]}
                >
                  <View style={styles.menuIconChip}>
                    <Icon name={item.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <Icon name="chevron-right" size={14} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsArea}>
          <Text style={styles.quickTitle}>Quick Actions</Text>
          {quickActions.map(action => (
            <TouchableOpacity key={action.id} style={styles.quickItem} onPress={action.onPress}>
              <Icon name={action.icon} size={18} color={colors.text} />
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
          {settingsOpen && renderSettingsPanel()}
        </View>

        {/* Divider */}
        {isLoggedIn && (
          <>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerLine} />
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutMenuItem} activeOpacity={0.7}>
                <View style={styles.logoutIconWrapper}>
                  <Icon name="log-out" size={20} color="#c9060a" />
                </View>
                <Text style={styles.logoutLabel}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.copyright}>© {new Date().getFullYear()} All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1 },
  
  // Header
  headerSection: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  headerGradient: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border },
  closeButton: {
    position: 'absolute', top: 12, right: 20, width: 38, height: 38,
    borderRadius: 19, backgroundColor: colors.card, justifyContent: 'center',
    alignItems: 'center', zIndex: 99, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  
  // Profile
  profileContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 100 },
  profileRing: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center',
    alignItems: 'center', backgroundColor: colors.card, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4,
  },
  profileGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  initials: { fontSize: 24, fontWeight: '700', color: '#ffffff' },
  profileInfo: { marginLeft: 16, flex: 1 },
  welcomeText: { fontSize: 12, color: colors.muted, fontWeight: '500', letterSpacing: 0.5, marginBottom: 2 },
  fullName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emailContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  emailText: { fontSize: 12, color: colors.muted, flex: 1 },
  
  // Guest
  guestProfile: { alignItems: 'center' },
  guestIconRing: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.card,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  guestTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 6 },
  guestSubtitle: { fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: 16 },
  
  // Menu
  menuSection: { paddingHorizontal: 20, marginTop: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, marginBottom: 2 },
  menuIconChip: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  
  // Quick Actions
  quickActionsArea: { paddingHorizontal: 20, marginBottom: 4 },
  quickTitle: { fontSize: 12, fontWeight: '600', color: colors.muted, letterSpacing: 0.5 },
  quickItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, gap: 12 },
  quickLabel: { fontSize: 14, color: colors.text, fontWeight: '500' },
  
  // Settings
  settingsBox: { marginHorizontal: 20, marginBottom: -20, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '600', color: colors.text },
  
  // Divider
  dividerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  
  // Logout
  logoutSection: { paddingHorizontal: 20, marginBottom: 32 },
  logoutMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, backgroundColor: colors.card },
  logoutIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: colors.border },
  logoutLabel: { fontSize: 15, fontWeight: '600', color: colors.primary },
  
  // Footer
  footerSection: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, marginTop: 'auto' },
  copyright: { fontSize: 11, color: colors.muted, textAlign: 'center' },
});

export default CustomDrawer;