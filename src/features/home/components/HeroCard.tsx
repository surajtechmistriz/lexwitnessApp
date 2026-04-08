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

type HeroCardProps = {
  category: any; // can be string or object
  title: string;
  slug: string; //  REQUIRED
  date?: string;
  image?: string;
  height?: number;
};

const HeroCard = ({
  category,
  title,
  slug,
  date,
  image,
  height = 280,
}: HeroCardProps) => {
  const navigation = useNavigation<any>();

  const categoryName =
    typeof category === 'string' ? category : category?.name;

  const categorySlug = category?.slug ?? 'general';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { height }]}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug,
          category: categorySlug,
        })
      }
    >
      <ImageBackground source={{ uri: image }} style={styles.image}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          {/* Category */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CategoryScreen', {
                slug: categorySlug,
              })
            }
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{categoryName}</Text>
          </TouchableOpacity>

          {/* Bottom Content */}
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
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 14,
  },
  badge: {
    backgroundColor: '#c9060a',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomContent: {
    gap: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  dateText: {
    color: '#ddd',
    fontSize: 12,
  },
});

export default HeroCard;
