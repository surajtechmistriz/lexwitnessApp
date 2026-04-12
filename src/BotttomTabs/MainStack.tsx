import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../features/home/HomeScreen";
import CategoryScreen from "../features/category/CategoryScreen";
import ArchiveScreen from "../features/archive/ArchiveScreen";

const Stack = createNativeStackNavigator();

export const MainStack = ({ onScrollDown, onScrollUp }) => {
  return (
   <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Home" component={Home} />

  <Stack.Screen name="CategoryScreen">
    {props => (
      <CategoryScreen {...props} onScrollDown={onScrollDown} onScrollUp={onScrollUp} />
    )}
  </Stack.Screen>

  <Stack.Screen name="Archive">
    {props => (
      <ArchiveScreen {...props} onScrollDown={onScrollDown} onScrollUp={onScrollUp} />
    )}
  </Stack.Screen>

  
</Stack.Navigator>
  );
};