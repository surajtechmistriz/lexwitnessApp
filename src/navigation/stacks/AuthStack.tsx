import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../../screens/auth/screens/SignIn';
import Register from '../../screens/auth/screens/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
      />

      <Stack.Screen
        name="Register"
        component={Register}
      />
    </Stack.Navigator>
  );
}