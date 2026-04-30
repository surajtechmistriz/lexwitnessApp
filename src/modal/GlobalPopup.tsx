import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AuthPopup from '../modal/AuthPopup';

const GlobalPopup = () => {
  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  const [visible, setVisible] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    // 👇 Show ONLY on app open
    if (!isLoggedIn && !shownOnce) {
      setVisible(true);
      setShownOnce(true);
    }
  }, [isHydrated, isLoggedIn]);

  return (
    <AuthPopup
      visible={visible}
      onClose={() => setVisible(false)}
    />
  );
};

export default GlobalPopup;