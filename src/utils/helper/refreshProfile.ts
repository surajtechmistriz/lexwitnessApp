import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../../screens/dashboard/api';
import { setProfile } from '../../redux/slices/authSlice';

export const refreshProfile = async (dispatch: any) => {
  try {
    const profileRes = await getProfile();

    console.log(
      'PROFILE RESPONSE =>',
      JSON.stringify(profileRes, null, 2),
    );

    const profile = profileRes?.data;

    console.log(
      'PROFILE DATA =>',
      JSON.stringify(profile, null, 2),
    );

    if (!profile) return;

    await AsyncStorage.setItem(
      'user',
      JSON.stringify(profile.user),
    );

    await AsyncStorage.setItem(
      'subscription',
      JSON.stringify(profile.subscription),
    );

    await AsyncStorage.setItem(
      'nextSubscriptions',
      JSON.stringify(profile.next_subscriptions || []),
    );

    console.log(
      'SET PROFILE PAYLOAD =>',
      JSON.stringify(
        {
          user: profile.user,
          subscription: profile.subscription,
          nextSubscriptions: profile.next_subscriptions || [],
        },
        null,
        2,
      ),
    );

    dispatch(
      setProfile({
        user: profile.user,
        subscription: profile.subscription,
        nextSubscriptions: profile.next_subscriptions || [],
      }),
    );

    console.log('PROFILE UPDATED IN REDUX');

    return profile;
  } catch (error) {
    console.log('refreshProfile error =>', error);
    throw error;
  }
};