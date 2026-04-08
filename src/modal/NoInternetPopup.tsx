import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetPopup = () => {
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? true;

      if (!connected) {
        setStatus('offline');
        showToast();
      } else {
        setStatus('online');
        showToast();

        // Auto hide after 2 sec when back online
        setTimeout(hideToast, 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isOffline = status === 'offline';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, isOffline ? styles.offline : styles.online]}>
        <View style={[styles.dot, isOffline ? styles.dotOffline : styles.dotOnline]} />
        <Text style={styles.text}>
          {isOffline ? 'No Internet Connection' : 'Back Online'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    width: '90%',
    maxWidth: 420,

    // Glassy modern look
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)', // ignored on RN but ok

    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  offline: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  online: {
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  dotOffline: {
    backgroundColor: '#ff3b30',
  },
  dotOnline: {
    backgroundColor: '#34c759',
  },
  text: {
    color: '#c9060a',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default NoInternetPopup;