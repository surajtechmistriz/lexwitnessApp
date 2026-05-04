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
import { getLatestMagazines } from '../api/home.api';
import Config from 'react-native-config';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');
// Modern magazine ratio is usually 3:4 or 1:1.41
const ITEM_WIDTH = width * 0.42; 
const ITEM_HEIGHT = ITEM_WIDTH * 1.4; 
const BRAND_RED = '#c9060a';
const BRAND_DARK = '#333';

const imgUrl = Config.MAGAZINES_BASE_URL;

const LatestEditions = ({ skipId, onPressItem, onPressViewAll }: any) => {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const progressValue = useSharedValue<number>(0);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await getLatestMagazines({ skipId, limit: 6 });
        setEditions(response || []);
      } catch (error) {
        console.log('Latest Editions Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (skipId !== undefined) fetchEditions();
  }, [skipId]);

  if (loading) return <ActivityIndicator style={styles.loader} color={BRAND_RED} />;
  if (!editions.length) return null;

  return (
    <View style={styles.wrapper}>
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Latest Editions</Text>
          <View style={styles.accentBar} />
        </View>
        <TouchableOpacity onPress={onPressViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* CAROUSEL */}
     <Carousel
  loop={false}
  autoPlay={false}
  style={styles.carouselStyle}
  width={ITEM_WIDTH + 16}
  height={ITEM_HEIGHT + 40}
  data={editions}
  pagingEnabled
  onConfigurePanGesture={(gesture) => {
    gesture.activeOffsetX([-10, 10]);
  }}
  onProgressChange={(_, absoluteProgress) => {
    progressValue.value = absoluteProgress;
  }}
  renderItem={({ item, index }) => (
    <EditionCard 
      item={item}
      index={index}
      progressValue={progressValue}
      onPress={() => onPressItem?.(item)}
    />
  )}
/>

      {/* DYNAMIC PAGINATION */}
      <View style={styles.paginationContainer}>
        {editions.map((_, index) => {
          return (
            <PaginationDot 
                key={index} 
                index={index} 
                progressValue={progressValue} 
            />
          );
        })}
      </View>
    </View>
  );
};

// Internal component for the animated card
const EditionCard = ({ item, index, progressValue, onPress }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.95, 1, 0.95],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
        <Image
          source={{ uri: item.image ? `${imgUrl}/${item.image}` : 'https://via.placeholder.com/300x400' }}
          style={styles.image}
        />
        <View style={styles.imageOverlay} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Internal component for the dynamic dots
const PaginationDot = ({ index, progressValue }: any) => {
    const dotStyle = useAnimatedStyle(() => {
        const width = interpolate(
            progressValue.value,
            [index - 1, index, index + 1],
            [8, 20, 8],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            progressValue.value,
            [index - 1, index, index + 1],
            [0.3, 1, 0.3],
            Extrapolate.CLAMP
        );
        return { width, opacity };
    });

    return <Animated.View style={[styles.dot, dotStyle]} />;
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal:-12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  accentBar: {
    width: 30,
    height: 3,
    backgroundColor: BRAND_RED,
    marginTop: 4,
  },
  viewAllText: {
    color: BRAND_RED,
    fontWeight: '700',
    fontSize: 14,
  },
  carouselStyle: {
    width: width,
    paddingLeft: 20, // Modern offset look
  },
  cardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#eee',
    // High-end shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Subtle border to define edges
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_RED,
    marginHorizontal: 4,
  },
  loader: {
    marginVertical: 40,
  },
});

export default LatestEditions;