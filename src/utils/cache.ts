import AsyncStorage from '@react-native-async-storage/async-storage';

export const setCache = async (key: string, data: any) => {
  await AsyncStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

export const getCache = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const isCacheExpired = (
  timestamp: number,
  maxAge = 5 * 60 * 1000
) => {
  return Date.now() - timestamp > maxAge;
};