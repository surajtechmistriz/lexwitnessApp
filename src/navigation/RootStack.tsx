import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import AuthStack from './stacks/AuthStack';

import AboutUs from '../screens/AboutUs';
import TermsAndConditions from '../screens/TermsAndConditions';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import ContactUs from '../screens/ContactUs';

import { defaultStackOptions } from './navigationConfig';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={defaultStackOptions}
    >
      <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{
          animation: 'fade',
        }}
      />

      <Stack.Screen
        name="Auth"
        component={AuthStack}
      />

      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
      />

      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />

      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
      />
      
    </Stack.Navigator>
  );
}