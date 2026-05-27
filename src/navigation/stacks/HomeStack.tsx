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

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="Archive" component={ArchiveScreen} />

      <Stack.Screen name="Category" component={CategoryScreen} />

      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />

      <Stack.Screen name="Author" component={AuthorScreen} />
      <Stack.Screen name="Tag" component={TagScreen}/>

      {/* ADD DASHBOARD HERE */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      <Stack.Screen name="Subscription" component={Subscription} />

      <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />

      <Stack.Screen name="EditorialDetail" component={EditorialDetail} />
    </Stack.Navigator>
  );
}
