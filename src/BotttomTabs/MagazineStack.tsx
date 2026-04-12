import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import ArticleDetailPage from '../features/article/ArticleScreen';

const Stack = createNativeStackNavigator();

export const MagazineStack = ({ onScrollDown, onScrollUp }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Magazines">
        {props => <MagazinesScreen {...props} onScrollDown={onScrollDown} onScrollUp={onScrollUp} />}
      </Stack.Screen>

      <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />

      {/* ADD THIS HERE: Now ArticleDetail is inside the Magazine flow! */}
      <Stack.Screen name="ArticleDetail">
        {props => <ArticleDetailPage {...props} onScrollDown={onScrollDown} onScrollUp={onScrollUp} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};