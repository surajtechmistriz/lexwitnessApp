import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MagazinesScreen from '../features/magazines/MagazinesScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';

const Stack = createNativeStackNavigator();

export const MagazineStack = ({ onScrollDown, onScrollUp }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Magazines">
        {props => (
          <MagazinesScreen
            {...props}
            onScrollDown={onScrollDown}
            onScrollUp={onScrollUp}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="MagazineDetail"
        component={MagazineDetailScreen}
      />
    </Stack.Navigator>
  );
};