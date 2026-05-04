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
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { COLORS } from '../../../theme/colors';

type Props = {
  skipId?: number;
  onPressItem?: (item: any) => void;
  onPressViewAll?: () => void;
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.47;

const imgUrl = Config.MAGAZINES_BASE_URL;

const LatestEditions = ({
  skipId,
  onPressItem,
  onPressViewAll,
}: Props) => {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const progressValue = useSharedValue<number>(0);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await getLatestMagazines({
          skipId,
          limit: 5,
        });
        setEditions(response || []);
      } catch (error) {
        console.log('Latest Editions Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (skipId !== undefined) fetchEditions();
  }, [skipId]);

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} color={COLORS.primary} />
    );
  }

  if (!editions.length) return null;

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <Text style={styles.heading}>Latest Editions</Text>
      <View style={styles.redLine} />

      {/* CAROUSEL */}
      <Carousel
        loop={false}
        width={ITEM_WIDTH}
        height={260}
        style={{ width }}
        data={editions}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onPressItem?.(item)}
          >
            <Image
              source={{
                uri: item.image
                  ? `${imgUrl}/${item.image}`
                  : 'https://via.placeholder.com/300x400',
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />

      {/* DOTS */}
      <View style={styles.dotsContainer}>
        {editions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              // simple active indicator (optional improvement later)
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => onPressViewAll?.()}
      >
        <Text style={styles.ctaText}>View All Editions</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    paddingHorizontal: 12,
  },
  redLine: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.primary,
    marginTop: 5,
    marginLeft: 1,
    alignSelf: 'center',
    marginBottom: 18,
  },

  card: {
    width: ITEM_WIDTH - 12,
    marginLeft: 12,
    borderRadius:8,

    // borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 208,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    padding: 10,
    lineHeight: 18,
  },

  pagination: {
    marginTop: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 3,
    marginTop: -15,
    marginBottom: 15,
  },

  activeDot: {
    width: 16,
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
    marginBottom: 15,
  },

  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LatestEditions;
