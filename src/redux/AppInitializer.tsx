// src/redux/AppInitializer.tsx

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hydrateAuth } from './slices/authSlice';

const AppInitializer = ({ children }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        if (token && user) {
          dispatch(
            hydrateAuth({
              token,
              user: JSON.parse(user),
            })
          );
        } else {
          dispatch(hydrateAuth(null));
        }
      } catch {
        dispatch(hydrateAuth(null));
      }
    };

    init();
  }, []);

  return children;
};

export default AppInitializer;