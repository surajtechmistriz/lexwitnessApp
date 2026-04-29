import { useState } from 'react';

export const useRefresh = (fetchFn: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFn();
    } catch (e) {
      console.log('Refresh error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  return { refreshing, onRefresh };
};