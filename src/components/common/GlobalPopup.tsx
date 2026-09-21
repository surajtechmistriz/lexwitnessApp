import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Popup from './Popup';

const GlobalPopup = () => {
  const { isLoggedIn, isHydrated } = useSelector(
    (state: RootState) => state.auth
  );

  const [visible, setVisible] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn && !shownOnce) {
      const timer = setTimeout(() => {
        setVisible(true);
        setShownOnce(true);
      }, 800); // optional delay

      return () => clearTimeout(timer);
    }
  }, [isHydrated, isLoggedIn, shownOnce]);

  return (
    <Popup
      visible={visible}
      onClose={() => setVisible(false)}
    />
  );
};

export default GlobalPopup;