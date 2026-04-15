import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Config from 'react-native-config';

/* ---------- TYPES ---------- */
type HeroCardProps = {
  category: any;
  title: string;
  slug: string;
  date?: string;
  image?: string;
};

type RootStackParamList = {
  ArticleDetail: { slug: string; category: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const imgUrl = Config.POSTS_BASE_URL;

/* ---------- COMPONENT ---------- */

const ListCard = ({ category, title, slug, date, image }: HeroCardProps) => {
  const navigation = useNavigation<NavigationProp>();

  const categoryName = typeof category === 'string' ? category : category?.name;

  const categorySlug = category?.slug ?? 'general';

  const fullImageUrl = image ? `${imgUrl}/${image}` : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug,
          category: categorySlug,
        })
      }
    >
      <View style={styles.row}>
        {/* TEXT */}
        <View style={styles.textContainer}>
          {!!categoryName && (
            <TouchableOpacity
              style={styles.category}
              onPress={() =>
                navigation.navigate('Category', {
                  slug: categorySlug,
                })
              }
            >
              <Text numberOfLines={1} style={styles.categoryText}>
                {categoryName.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {date && <Text style={styles.date}>{date}</Text>}
        </View>

        {/* IMAGE */}
        {fullImageUrl ? (
          <Image
            source={{ uri: fullImageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
            fadeDuration={300}
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
      </View>
    </TouchableOpacity>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10, // reduced from 12
    marginBottom: 8,

    // softer premium shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  //   category: {
  //   marginBottom: 4,
  // },

  categoryText: {
    color: '#c9060a',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  category: {
    color: '#c9060a',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    lineHeight: 20,
    marginBottom: 4,
  },

  date: {
    fontSize: 12,
    color: '#888',
  },

  thumbnail: {
    width: 96,
    height: 64, // smaller 16:9
    borderRadius: 10,
    backgroundColor: '#eee',
  },

  thumbnailPlaceholder: {
    width: 96,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
});

export default ListCard;
