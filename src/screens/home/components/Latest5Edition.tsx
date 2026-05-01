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
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { COLORS } from '../../../theme/colors';

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
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (skipId !== undefined) fetchEditions();
  }, [skipId]);

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loader}
        color={COLORS.primary}
      />
    );
  }

  if (editions.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Text style={styles.heading}>Latest Editions</Text>
      <View style={styles.redLine} />

      {/* Carousel */}
      <Carousel
        loop={false}
        width={ITEM_WIDTH}
        height={220}
        data={editions}
        style={{ width }}
        enabled
        pagingEnabled
        scrollAnimationDuration={600}
        panGestureHandlerProps={{
          activeOffsetX: [-20, 20],   // require stronger horizontal swipe
          failOffsetY: [-10, 10],     // allow vertical scroll
        }}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Magazines', {
                screen: 'MagazineDetail',
                params: { slug: item.slug },
              })
            }
          >
            <Image
              source={{
                uri: item.image
                  ? `${imgUrl}/${item.image}`
                  : 'https://via.placeholder.com/300x400',
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      />

      {/* Pagination */}
      <Pagination.Basic
        progress={progressValue}
        data={editions}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        containerStyle={styles.pagination}
      />

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Magazines')}
      >
        <Text style={styles.ctaText}>View All Editions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LatestEditions;


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingBottom: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    alignSelf: 'center',
  },

  redLine: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 16,
    borderRadius: 2,
  },

  loader: {
    marginTop: 30,
  },

  card: {
    width: ITEM_WIDTH - 12,
    marginLeft: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 200,
  },

  pagination: {
    marginTop: 10,
    marginBottom: 14,
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 3,
  },

  activeDot: {
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
  },

  cta: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});