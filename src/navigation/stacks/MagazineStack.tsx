import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MagazinesScreen from '../../screens/magazines/MagazinesScreen';
import MagazineDetailScreen from '../../screens/magazines/MagazineDetailScreen';

const Stack = createNativeStackNavigator();

export const MagazineStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Magazines" component={MagazinesScreen} />
    <Stack.Screen name="MagazineDetail" component={MagazineDetailScreen} />
    </Stack.Navigator>
  );
};