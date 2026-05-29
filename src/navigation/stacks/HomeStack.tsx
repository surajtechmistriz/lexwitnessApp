import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../../screens/home/HomeScreen';
import ArchiveScreen from '../../screens/archive/ArchiveScreen';
import CategoryScreen from '../../screens/category/CategoryScreen';
import ArticleDetailPage from '../../screens/article/ArticleScreen';
import AuthorScreen from '../../screens/author/AuthorScreen';
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import Subscription from '../../screens/auth/screens/Subscription';
import InvoiceScreen from '../../screens/Invoice/InvoiceScreen';
import EditorialDetail from '../../screens/editorial/EditorialDetail';
import TagScreen from '../../screens/tag/TagScreen';

import { defaultStackOptions } from '../navigationConfig';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={defaultStackOptions}
    >
      {/* HOME */}
      <Stack.Screen
        name="Home"
        component={Home}
      />

      {/* ARCHIVE */}
      <Stack.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* CATEGORY */}
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* ARTICLE */}
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailPage}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* AUTHOR */}
      <Stack.Screen
        name="Author"
        component={AuthorScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* TAG */}
      <Stack.Screen
        name="Tag"
        component={TagScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* DASHBOARD */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* SUBSCRIPTION */}
      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* INVOICE */}
      <Stack.Screen
        name="InvoiceScreen"
        component={InvoiceScreen}
        options={{
          animation: 'simple_push',
        }}
      />

      {/* EDITORIAL */}
      <Stack.Screen
        name="EditorialDetail"
        component={EditorialDetail}
        options={{
          animation: 'simple_push',
        }}
      />
    </Stack.Navigator>
  );
}