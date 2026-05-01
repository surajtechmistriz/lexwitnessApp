import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./stacks/HomeStack";
import CategoryScreen from "../screens/category/CategoryScreen";
import { MagazineStack } from "./stacks/MagazineStack";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="MagazinesStack" component={MagazineStack} />
    </Tab.Navigator>
  );
}