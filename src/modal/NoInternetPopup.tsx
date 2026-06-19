import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  Linking,
  StatusBar,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../redux/useTheme';

const { width, height } = Dimensions.get('window');

const NoInternetPopup = () => {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [connectionState, setConnectionState] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const wasConnected = useRef(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current; // Start off-screen
  const progressWidth = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const unsubscribeRef = useRef(null);
  const progressAnimationRef = useRef(null);

  const openDeviceSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openSettings().catch(() => Linking.openURL('app-settings:'));
    } else {
      Linking.sendIntent('android.settings.SETTINGS');
    }
  }, []);

  const closePopupWithAnimation = useCallback(() => {
    if (progressAnimationRef.current) {
      progressAnimationRef.current.stop();
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setConnectionState('checking');
      setRetryCount(0);
      setShowTips(false);
      progressWidth.setValue(0);
    });
  }, [fadeAnim, slideAnim]);

  const showConnectedAndAutoClose = useCallback(() => {
    progressWidth.setValue(0);
    setConnectionState('connected');
    setVisible(true);

    progressAnimationRef.current = Animated.timing(progressWidth, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    });

    progressAnimationRef.current.start(({ finished }) => {
      if (finished) closePopupWithAnimation();
    });
  }, [progressWidth, closePopupWithAnimation]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      if (connectionState === 'disconnected') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }
    }
  }, [visible, connectionState]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected =
        state.isConnected === true && state.isInternetReachable !== false;

      if (!isConnected && wasConnected.current) {
        wasConnected.current = false;
        setConnectionState('disconnected');
        setVisible(true);
      }

      if (isConnected && !wasConnected.current) {
        wasConnected.current = true;
        showConnectedAndAutoClose();
      }
    });

    return () => unsubscribe();
  }, [showConnectedAndAutoClose]);

  const handleRetry = useCallback(async () => {
    setConnectionState('checking');
    setRetryCount(prev => prev + 1);

    setTimeout(async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        showConnectedAndAutoClose();
      } else {
        setConnectionState('disconnected');
        if (retryCount >= 2) setShowTips(true);
      }
    }, 1200);
  }, [retryCount, showConnectedAndAutoClose]);

  const getTheme = () => {
    switch (connectionState) {
      case 'connected':
        return { color: '#00C853', icon: 'wifi', label: 'Back Online' };
      case 'checking':
        return { color: colors.textSecondary, icon: 'loader', label: 'Checking...' };
      default:
        return { color: colors.primary, icon: 'wifi-off', label: 'No Connection' };
    }
  };

  const theme = getTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={
              connectionState === 'connected' ? null : closePopupWithAnimation
            }
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet, 
            { 
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
            }
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.content}>
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: `${theme.color}15`,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {connectionState === 'checking' ? (
                <ActivityIndicator size="large" color={theme.color} />
              ) : (
                <Icon name={theme.icon} size={32} color={theme.color} />
              )}
            </Animated.View>

            <Text style={[styles.title, { color: colors.text }]}>
              {theme.label}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {connectionState === 'disconnected'
                ? "We can't reach our servers. Please check your data or Wi-Fi."
                : connectionState === 'connected'
                ? "You're back! Synchronizing your data now..."
                : "Just a second, we're testing your signal..."}
            </Text>

            {showTips && connectionState === 'disconnected' && (
              <View style={[styles.tipsBox, { backgroundColor: colors.background }]}>
                <Tip item="Check Airplane Mode" icon="send" />
                <Tip item="Restart Wi-Fi Router" icon="refresh-cw" />
              </View>
            )}

            <View style={styles.footer}>
              {connectionState === 'disconnected' ? (
                <>
                  <TouchableOpacity
                    style={[styles.mainBtn, { backgroundColor: theme.color }]}
                    onPress={handleRetry}
                  >
                    <Text style={styles.mainBtnText}>
                      {retryCount > 0 ? `Retry (${retryCount})` : 'Try Again'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, { borderColor: colors.border }]}
                    onPress={openDeviceSettings}
                  >
                    <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>
                      Network Settings
                    </Text>
                  </TouchableOpacity>
                </>
              ) : connectionState === 'connected' ? (
                <View style={styles.progressWrapper}>
                  <View style={[styles.track, { backgroundColor: colors.border }]}>
                    <Animated.View
                      style={[
                        styles.fill,
                        {
                          width: progressWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                          backgroundColor: colors.success || '#00C853',
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Tip = ({ item, icon }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.tipRow}>
      <Icon name={icon} size={14} color={colors.textSecondary} />
      <Text style={[styles.tipText, { color: colors.text }]}>{item}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 24,
  },
  content: { width: '100%', alignItems: 'center' },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  tipsBox: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipText: { marginLeft: 10, fontSize: 14, fontWeight: '500' },
  footer: { width: '100%', gap: 12 },
  mainBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryBtn: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 4,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '500' },
  progressWrapper: { width: '100%', paddingVertical: 20 },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
});

export default NoInternetPopup;