import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../../screens/dashboard/api';
import { setProfile } from '../../redux/slices/authSlice';

export const refreshProfile = async (dispatch: any) => {
  try {
    const profileRes = await getProfile();

    const profile = profileRes?.data;

    if (!profile) return;

    await AsyncStorage.setItem('user', JSON.stringify(profile.user));
    await AsyncStorage.setItem(
      'subscription',
      JSON.stringify(profile.subscription),
    );
    await AsyncStorage.setItem(
      'nextSubscriptions',
      JSON.stringify(profile.next_subscriptions || []),
    );

    dispatch(
      setProfile({
        user: profile.user,
        subscription: profile.subscription,
        nextSubscriptions: profile.next_subscriptions || [],
      }),
    );
  } catch (error) {
    console.log('refreshProfile error =>', error);
  }
};