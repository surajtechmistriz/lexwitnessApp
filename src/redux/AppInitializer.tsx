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
        //  Fetch all data from AsyncStorage
        const [token, userStr, subscriptionStr, nextSubscriptionsStr] =
          await Promise.all([
            AsyncStorage.getItem('token'),
            AsyncStorage.getItem('user'),
            AsyncStorage.getItem('subscription'),
            AsyncStorage.getItem('nextSubscriptions'),
          ]);

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const subscription = subscriptionStr
            ? JSON.parse(subscriptionStr)
            : null;
          const nextSubscriptions = nextSubscriptionsStr
            ? JSON.parse(nextSubscriptionsStr)
            : [];

          dispatch(
            hydrateAuth({
              token,
              user,
              subscription,
              nextSubscriptions,
            })
          );
        } else {
          dispatch(hydrateAuth(null));
        }
      } catch (error) {
        console.log('AppInitializer Error:', error);
        dispatch(hydrateAuth(null));
      }
    };

    init();
  }, []);

  return children;
};

export default AppInitializer;