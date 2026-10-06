import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { hydrateAuth } from './slices/authSlice';

const AppInitializer = ({ children }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          dispatch(hydrateAuth(null));
          return;
        }

        const [userStr, subscriptionStr, nextSubscriptionsStr] =
          await Promise.all([
            AsyncStorage.getItem('user'),
            AsyncStorage.getItem('subscription'),
            AsyncStorage.getItem('nextSubscriptions'),
          ]);

        if (userStr) {
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
            }),
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
  }, [dispatch]);

  return children;
};

export default AppInitializer;
