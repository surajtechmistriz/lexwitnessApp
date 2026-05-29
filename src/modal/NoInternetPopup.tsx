import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Feather';

const NoInternetPopup = () => {
  const [visible, setVisible] = useState(false);
  const [checking, setChecking] = useState(false);

  const wasConnected = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        state.isConnected && state.isInternetReachable;

      // internet lost → show popup
      if (!connected) {
        wasConnected.current = false;
        setVisible(true);
      }

      // internet back → auto close after short delay
      if (connected && !wasConnected.current) {
        wasConnected.current = true;

        setChecking(true);

        setTimeout(() => {
          setVisible(false);
          setChecking(false);
        }, 1000); // 👈 smooth UX delay
      }
    });

    return unsubscribe;
  }, []);

  const handleRetry = async () => {
    setChecking(true);

    const state = await NetInfo.fetch();

    const connected =
      state.isConnected && state.isInternetReachable;

    if (connected) {
      setTimeout(() => {
        setVisible(false);
        setChecking(false);
      }, 1000); // 👈 spinner visible for 1 sec
    } else {
      setTimeout(() => setChecking(false), 500);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* CLOSE BUTTON */}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeBtn}
          >
            <Icon name="x" size={20} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.iconWrapper}>
            <Icon name="wifi-off" size={34} color="#c9060a" />
          </View>

          <Text style={styles.title}>
            No Internet Connection
          </Text>

          <Text style={styles.description}>
            Please check your internet connection and try again.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleRetry}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Retry</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NoInternetPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 24,
  },

  closeBtn: {
  position: 'absolute',
  right: 14,
  top: 14,
  padding: 6,
  zIndex: 10,
},

  card: {
    width: '100%',

    backgroundColor: '#ffffff',

    borderRadius: 24,

    paddingVertical: 32,

    paddingHorizontal: 24,

    alignItems: 'center',
  },

  iconWrapper: {
    width: 74,

    height: 74,

    borderRadius: 37,

    backgroundColor: '#fff1f1',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  title: {
    fontSize: 20,

    fontWeight: '700',

    color: '#111827',

    marginBottom: 10,
  },

  description: {
    fontSize: 14,

    color: '#6b7280',

    textAlign: 'center',

    lineHeight: 22,

    marginBottom: 24,
  },

  button: {
    backgroundColor: '#c9060a',

    paddingVertical: 14,

    paddingHorizontal: 40,

    borderRadius: 14,

    minWidth: 140,

    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',

    fontSize: 15,

    fontWeight: '700',
  },
});