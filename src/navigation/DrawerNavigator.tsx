import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BottomTabs from "./BottomTabs";
import Subscription from "../screens/auth/screens/Subscription";

import CustomDrawer from "../components/common/CustomDrawer";
import Header from "../components/common/Header";
import SearchOverlay from "../components/common/SearchOverlay";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <>
     <Drawer.Navigator
  screenOptions={{
   header: ({ navigation }) => (
  <Header
    navigation={navigation} //  pass navigation
    onSearchPress={() => setIsSearchVisible(true)}
  />
)
  }}
  drawerContent={(props) => <CustomDrawer {...props} />}
>
        {/* MAIN APP */}
        <Drawer.Screen name="MainTabs" component={BottomTabs} />

        {/* EXTRA */}
        <Drawer.Screen name="Subscription" component={Subscription} />
      </Drawer.Navigator>

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
}