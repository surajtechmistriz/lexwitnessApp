import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getLatestMagazines } from "../api/home.api";
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.47; 
const imgUrl = Config.MAGAZINES_BASE_URL;

const LatestEditions = ({ skipId }: { skipId?: number }) => {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const progressValue = useSharedValue<number>(0); 
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await getLatestMagazines({ skipId, limit: 5 });
        setEditions(response || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (skipId !== undefined) fetchEditions();
  }, [skipId]);

  if (loading) return <ActivityIndicator style={styles.loader} color="#d32f2f" />;
  if (editions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>LATEST EDITIONS</Text>
      <View style={styles.underline} />

      <Carousel
        loop={false}
        width={ITEM_WIDTH}
        height={320}
        style={{ width: width }}
        data={editions}
        /* FIX: Prevents the whole page from scrolling vertically when swiping horizontally */
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("MagazineDetail", { slug: item.slug })}
          >
            <Image 
              source={{ uri: item.image ? `${imgUrl}/${item.image}` : "https://via.placeholder.com/300x400" }} 
              style={styles.coverImage} 
              resizeMode="cover"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Pagination.Basic
        progress={progressValue}
        data={editions}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        containerStyle={styles.paginationContainer}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate("MagazinesTab")}
      >
        <Text style={styles.buttonText}>VIEW ALL EDITIONS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', paddingVertical: 20 },
  loader: { margin: 50 },
  headerTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', color: '#1a2a3a' },
  underline: { 
    height: 3, 
    width: 35, 
    backgroundColor: '#d32f2f', 
    alignSelf: 'center', 
    marginTop: 6, 
    marginBottom: 20 
  },
  card: {
    width: ITEM_WIDTH - 15, 
    marginHorizontal: 7.5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  coverImage: { width: '100%', height: 220 },
  titleContainer: { padding: 10, height: 60, justifyContent: 'center' },
  titleText: { fontSize: 13, fontWeight: '600', textAlign: 'center', color: '#333' },
  button: {
    backgroundColor: '#c9060a',
    paddingVertical: 15,
    width: 250,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  paginationContainer: { 
    flexDirection: 'row',
    gap: 5, 
    marginBottom: 25,
    marginTop: -10, // Adjusted to match your desired spacing
    justifyContent: 'center' 
  },
  dot: { 
    backgroundColor: '#e0e0e0', 
    width: 12, 
    height: 4, 
    borderRadius: 2 
  },
  activeDot: { 
    backgroundColor: '#d32f2f', 
    width: 35, 
    height: 4, 
    borderRadius: 2 
  },
});

export default LatestEditions;