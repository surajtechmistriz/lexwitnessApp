import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import Subscription from "../screens/auth/screens/Subscription";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Tabs" component={BottomTabs} />
      <Drawer.Screen name="Subscription" component={Subscription} />
    </Drawer.Navigator>
  );
}