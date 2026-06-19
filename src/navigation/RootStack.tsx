import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import { defaultStackOptions } from './navigationConfig';

// ============ AUTH SCREENS ============
import SignIn from '../screens/auth/screens/SignIn';
import Register from '../screens/auth/screens/Register';

// ============ HOME SCREENS ============
import HomeScreen from '../screens/home/HomeScreen';
import ArchiveScreen from '../screens/archive/ArchiveScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import ArticleDetailPage from '../screens/article/ArticleScreen';
import AuthorScreen from '../screens/author/AuthorScreen';
import TagScreen from '../screens/tag/TagScreen';

// ============ MAGAZINE SCREENS ============
import MagazinesScreen from '../screens/magazines/MagazinesScreen';
import MagazineDetailScreen from '../screens/magazines/MagazineDetailScreen';

// ============ DASHBOARD & OTHER ============
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import Subscription from '../screens/auth/screens/Subscription';
import InvoiceScreen from '../screens/Invoice/InvoiceScreen';
import EditorialDetail from '../screens/editorial/EditorialDetail';

// ============ STATIC PAGES ============
import AboutUs from '../screens/AboutUs';
import TermsAndConditions from '../screens/TermsAndConditions';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import ContactUs from '../screens/ContactUs';
import ForgetPassword from '../screens/auth/screens/ForgetPassword';
import ResetPassword from '../screens/auth/screens/ResetPassword';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();


export default function RootStack() {
  const isHydrated = useSelector(
    (state: any) => state.auth.isHydrated
  );

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
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
      <Stack.Screen name="EditorialDetail" component={EditorialDetail} />
      
      {/* ===== 6. STATIC PAGES ===== */}
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      
    </Stack.Navigator>
  );
}