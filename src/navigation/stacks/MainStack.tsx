import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../../features/home/HomeScreen";
import CategoryScreen from "../../features/category/CategoryScreen";
import ArchiveScreen from "../../features/archive/ArchiveScreen";
import ArticleDetailPage from "../../features/article/ArticleScreen";
import AuthorScreen from "../../features/author/AuthorScreen";

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />

      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />
      <Stack.Screen name="Author" component={AuthorScreen} />
    </Stack.Navigator>
  );
};