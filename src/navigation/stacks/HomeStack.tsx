import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../../screens/home/HomeScreen";
import ArchiveScreen from "../../screens/archive/ArchiveScreen";
import CategoryScreen from "../../screens/category/CategoryScreen";
import ArticleDetailPage from "../../screens/article/ArticleScreen";
import AuthorScreen from "../../screens/author/AuthorScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ✅ Header handled by Drawer
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />
      <Stack.Screen name="Author" component={AuthorScreen} />
    </Stack.Navigator>
  );
}