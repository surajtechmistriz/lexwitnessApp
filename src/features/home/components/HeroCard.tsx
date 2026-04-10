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
  category: any;
  title: string;
  slug: string;
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
  height = 260, // slightly tighter
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
          colors={[
            'rgba(0,0,0,0.05)',
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.85)',
          ]}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          {/* Category */}
          {!!categoryName && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryScreen', {
                  slug: categorySlug,
                })
              }
              activeOpacity={0.8}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>
                {categoryName.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}

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
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,

    // 🔥 subtle premium shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  image: {
    flex: 1,
  },

  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },

  badge: {
    backgroundColor: 'rgba(201, 6, 10, 0.9)', // softer red
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  bottomContent: {
    marginTop: 10,
  },

  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 6,
  },

  dateText: {
    color: '#ddd',
    fontSize: 12,
  },
});

export default HeroCard;