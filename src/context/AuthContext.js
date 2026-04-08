import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { navigationRef } from '../navigation/AppNavigator';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

 useEffect(() => {
  loadStorageData();

  const listener = DeviceEventEmitter.addListener('AUTH_CHANGE', () => {
    loadStorageData(); // reload state on login/logout
  });

  return () => listener.remove();
}, []);

  const loadStorageData = async () => {
    const data = await AsyncStorage.getItem('userData');
    if (data) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(data));
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
console.log("logout")
  setUserData(null);
  setIsLoggedIn(false);

  DeviceEventEmitter.emit('AUTH_CHANGE'); // trigger update

  if (navigationRef.isReady()) {
      // Navigate to the 'Home' screen inside your BottomTabs
      navigationRef.navigate('Home');
    }
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);