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
  height = 350,
}: HeroCardProps) => {
  const navigation = useNavigation<any>();

  const categoryName = typeof category === 'string' ? category : category?.name;

  const categorySlug = category?.slug ?? 'general';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { height }]}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          {/* CATEGORY CLICK */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CategoryScreen', {
                slug: categorySlug,
              })
            }
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{categoryName}</Text>
          </TouchableOpacity>

          {/* TITLE CLICK */}
          <View style={styles.bottomContent}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ArticleDetail', {
                  slug: slug,
                  category: categorySlug,
                })
              }
            >
              <Text style={styles.title} numberOfLines={3}>
                {title}
              </Text>
            </TouchableOpacity>

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
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    // Removed general padding here to let badge hit the edges
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#C9060a',
    alignSelf: 'flex-start',
    paddingHorizontal: 10, // Reduced from 15
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12, // Reduced from 16
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomContent: {
    padding: 12, // Reduced from 20
  },
  title: {
    color: '#FFF',
    fontSize: 16, // Reduced from 22
    fontWeight: '600',
    lineHeight: 20, // Adjusted for smaller font
    marginBottom: 4,
  },
  dateText: {
    color: '#E0E0E0',
    fontSize: 11, // Reduced from 14
    fontWeight: '500',
  },
});

export default HeroCard;
