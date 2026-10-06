import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import { defaultStackOptions } from './navigationConfig';
import { useSelector } from 'react-redux';
import SignIn from '../features/auth/SignIn';
import Register from '../features/auth/Register';
import ForgetPassword from '../features/auth/ForgetPassword';
import ResetPassword from '../features/auth/ResetPassword';
import HomeScreen from '../features/home/HomeScreen';
import ArchiveScreen from '../features/archive/ArchiveScreen';
import CategoryScreen from '../features/category/CategoryScreen';
import ArticleDetailPage from '../features/article/ArticleScreen';
import AuthorScreen from '../features/author/AuthorScreen';
import TagScreen from '../features/tag/TagScreen';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import Subscription from '../features/auth/Subscription';
import InvoiceScreen from '../features/invoice/InvoiceScreen';
import EditProfileScreen from '../features/auth/EditProfile';
import EditorialDetail from '../features/editorial/EditorialDetail';
import AboutUs from '../features/static/AboutUs';
import TermsAndConditions from '../features/static/TermsAndConditions';
import PrivacyPolicy from '../features/static/PrivacyPolicy';
import ContactUs from '../features/static/ContactUs';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const isHydrated = useSelector((state: any) => state.auth.isHydrated);

  if (!isHydrated) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      {/* ===== 1. MAIN APP WITH DRAWER ===== */}
      <Stack.Screen
        name="MainApp"
        component={DrawerNavigator}
        options={{ animation: 'fade' }}
      />

      {/* ===== 2. AUTH SCREENS ===== */}
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />

      {/* ===== 3. HOME SCREENS ===== */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />
      <Stack.Screen name="Author" component={AuthorScreen} />
      <Stack.Screen name="Tag" component={TagScreen} />

      {/* ===== 4. MAGAZINE SCREENS ===== */}
      <Stack.Screen name="Magazines" component={MagazinesScreen} />
      <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />

      {/* ===== 5. DASHBOARD & OTHERS ===== */}
      {/* <Stack.Screen name="Dashboard" component={DashboardScreen} /> */}
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
      <Stack.Screen name="EditorialDetail" component={EditorialDetail} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      {/* ===== 6. STATIC PAGES ===== */}
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
}
