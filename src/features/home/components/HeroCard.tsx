import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../store/hooks/useTheme';



type HeroCardProps = {
  category: any;
  title: string;
  slug: string;
  date?: string;
  image?: string;
  height?: number;
  onLoadEnd?: () => void;
  onPress?: () => void;
};

const HeroCard = ({
  category,
  title,
  slug,
  date,
  image,
  onLoadEnd,
  onPress,
}: HeroCardProps) => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const categoryName = typeof category === 'string' ? category : category?.name;
  const categorySlug = category?.slug ?? 'general';

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate('ArticleDetail', {
      slug,
      category: categorySlug,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        {
          shadowColor: colors.shadow || '#000',
        },
      ]}
      onPress={handlePress}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        onLoadEnd={onLoadEnd}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          {!!categoryName && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Category', {
                  slug: categorySlug,
                })
              }
              activeOpacity={0.8}
              style={[styles.badge, { backgroundColor: colors.primary + 'E6' }]}
            >
              <Text style={styles.badgeText}>{categoryName.toUpperCase()}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomContent}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            {date && <Text style={styles.dateText}>{date}</Text>}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: -8,
    marginLeft: -6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  bottomContent: {
    marginTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 6,
  },
  dateText: {
    color: '#ddd',
    fontSize: 12,
  },
});

export default HeroCard;