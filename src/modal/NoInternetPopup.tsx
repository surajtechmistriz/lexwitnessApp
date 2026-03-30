import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetPopup = () => {
  const [isConnected, setIsConnected] = useState(true);
  const slideAnim = useRef(new Animated.Value(100)).current; // Start off-screen (bottom)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Animate in when disconnected, animate out when reconnected
    Animated.spring(slideAnim, {
      toValue: isConnected ? 100 : 0, // 0 is the "visible" resting position
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isConnected]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.indicator} />
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40, // Distance from the bottom of the screen
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f', // Dark "Sonner" aesthetic
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '90%',
    maxWidth: 400,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c9060a', // Red dot
    marginRight: 12,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NoInternetPopup;