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

  // Construct the full URL
  const fullImageUrl = `${imgUrl}/${image}`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug,
          category: categorySlug,
        })
      }
    >
      <View style={styles.row}>
        {/* TEXT CONTENT */}
        
        <View style={styles.textContainer}>
          <Text style={styles.category}>{categoryName?.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {date && <Text style={styles.date}>{date}</Text>}
        </View>

        {/* IMAGE CONTENT */}
        {image ? (
          <Image
            source={{ uri: fullImageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
      </View>
    </TouchableOpacity>
  );
}
/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  category: {
    color: '#c9060a',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    lineHeight: 20,
    marginBottom: 6,
  },

  date: {
    fontSize: 12,
    color: '#938c8c',
  },
   thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#eee', // Fallback color while loading
  },

  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
});

export default ListCard;