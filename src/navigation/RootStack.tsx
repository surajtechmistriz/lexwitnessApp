import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import SignIn from "../screens/auth/screens/SignIn";
import RegisterScreen from "../screens/auth/screens/Register";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main App */}
      <Stack.Screen name="App" component={DrawerNavigator} />

      {/* Auth Screens */}
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}