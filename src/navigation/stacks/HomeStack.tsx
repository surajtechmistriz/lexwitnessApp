import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/home/HomeScreen";
import AuthorScreen from "../../screens/author/AuthorScreen";
import ArticleDetailPage from "../../screens/article/ArticleScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />
      <Stack.Screen name="Author" component={AuthorScreen} />
    </Stack.Navigator>
  );
}