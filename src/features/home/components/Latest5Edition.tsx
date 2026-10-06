import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';



import { useTheme } from '../../../store/hooks/useTheme';
import { getMagazineImageUrl } from '../../../utils/helpers/imageHelper';

import { getLatestMagazines } from '../../../services/home.service';
import type {
  EditionCardProps,
  LatestEdition,
  LatestEditionsProps,
  PaginationDotProps,
} from '../../../types/home.types';

const { width } = Dimensions.get('window');

const ITEM_WIDTH = width * 0.42;
const ITEM_HEIGHT = ITEM_WIDTH * 1.4;

const Latest5Edition = ({
  skipId,
  onPressItem,
  onPressViewAll,
}: LatestEditionsProps) => {
  const { colors, isDark } = useTheme();

  const [editions, setEditions] = useState<LatestEdition[]>([]);
  const [loading, setLoading] = useState(true);

  const progressValue = useSharedValue(0);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await getLatestMagazines({
          skipId,
          limit: 6,
        });

        setEditions(response || []);
      } catch (error) {
        console.error('Failed to load latest editions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (skipId !== undefined) {
      fetchEditions();
    }
  }, [skipId]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} color={colors.primary} />;
  }

  if (!editions.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.heading,
              {
                color: colors.text,
              },
            ]}
          >
            Latest Editions
          </Text>

          <View
            style={[
              styles.accentBar,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={onPressViewAll} activeOpacity={0.7}>
          <Text
            style={[
              styles.viewAllText,
              {
                color: colors.primary,
              },
            ]}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <Carousel
        loop={false}
        autoPlay={false}
        style={styles.carouselStyle}
        width={ITEM_WIDTH + 16}
        height={ITEM_HEIGHT + 40}
        data={editions}
        pagingEnabled
        onConfigurePanGesture={gesture => {
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
            colors={colors}
            isDark={isDark}
          />
        )}
      />

      <View style={styles.paginationContainer}>
        {editions.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            progressValue={progressValue}
            color={colors.primary}
          />
        ))}
      </View>
    </View>
  );
};

const EditionCard = ({
  item,
  index,
  progressValue,
  onPress,
  colors,
  isDark,
}: EditionCardProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.95, 1, 0.95],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.border : '#eee',
            shadowColor: '#000',
          },
        ]}
      >
        <Image
          source={{
            uri: getMagazineImageUrl(item.image),
          }}
          style={styles.image}
        />

        <View
          style={[
            styles.imageOverlay,
            {
              borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const PaginationDot = ({ index, progressValue, color }: PaginationDotProps) => {
  const dotStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [8, 20, 8],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        dotStyle,
        {
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginHorizontal: -12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  heading: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
    marginLeft: -22,
  },

  accentBar: {
    width: 36,
    height: 3,
    marginLeft: -22,
  },

  viewAllText: {
    fontWeight: '600',
    fontSize: 14,
  },

  carouselStyle: {
    width,
    paddingLeft: 20,
  },

  cardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
    marginHorizontal: 4,
    marginBottom: 20,
  },

  loader: {
    marginVertical: 40,
  },
});

export default Latest5Edition;
