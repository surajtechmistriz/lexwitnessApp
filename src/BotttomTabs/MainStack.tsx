import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../features/home/HomeScreen";
import MagazineDetailScreen from "../features/magazines/MagazineDetailScreen";
import CategoryScreen from "../features/category/CategoryScreen";
import AuthorScreen from "../features/author/AuthorScreen";
import ArchiveScreen from "../features/archive/ArchiveScreen";
import ArticleDetailPage from "../features/article/ArticleScreen";
import EditorialDetail from "../features/editorial/EditorialDetail";

const Stack = createNativeStackNavigator();

export const MainStack = ({ onScrollDown, onScrollUp }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />
       <Stack.Screen name="CategoryScreen">
        {props => (
          <CategoryScreen
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen>
       <Stack.Screen name="AuthorScreen">
        {props => (
          <AuthorScreen
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen>
       <Stack.Screen name="Archive">
        {props => (
          <ArchiveScreen
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen> 
       <Stack.Screen name="ArticleDetail">
        {props => (
          <ArticleDetailPage
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen>
        <Stack.Screen name="EditorialDetail">
        {props => (
          <EditorialDetail
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen>
      {/* <Stack.Screen name="AuthorScreen" component={AuthorScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailPage} />
      <Stack.Screen name="EditorialDetail" component={EditorialDetail} /> */}
    </Stack.Navigator>
  );
};