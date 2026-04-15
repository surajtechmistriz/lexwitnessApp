import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { navigationRef } from '../navigation/AppNavigator';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    loadStorageData();

    const listener = DeviceEventEmitter.addListener('AUTH_CHANGE', () => {
      loadStorageData();
    });

    return () => listener.remove();
  }, []);

  const loadStorageData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');

      if (data) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(data));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (e) {
      console.log('Auth load error:', e);
    } finally {
      setIsAuthLoading(false); // ✅ IMPORTANT
    }
  };

  const login = async (data) => {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    setUserData(data);
    setIsLoggedIn(true);

    DeviceEventEmitter.emit('AUTH_CHANGE');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userToken');

    setUserData(null);
    setIsLoggedIn(false);

    DeviceEventEmitter.emit('AUTH_CHANGE');

    if (navigationRef.isReady()) {
      navigationRef.navigate('Home');
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, login, logout, isAuthLoading }} // ✅ expose it
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);