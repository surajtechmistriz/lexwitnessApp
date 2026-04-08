// TabBarContext.js
import React, { createContext, useContext } from 'react';

const TabBarContext = createContext({
  hideTabBar: () => {},
  showTabBar: () => {},
});

export const useTabBar = () => useContext(TabBarContext);

export default TabBarContext;