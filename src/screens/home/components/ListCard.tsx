import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Config from 'react-native-config';
import { useTheme } from '../../../redux/useTheme';

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
  const { colors, isDark } = useTheme();

  const categoryName = typeof category === 'string' ? category : category?.name;

  const categorySlug = category?.slug ?? 'general';

  const fullImageUrl = image ? `${imgUrl}/${image}` : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: isDark ? '#000' : '#000',
      }]}
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
              <Text numberOfLines={1} style={[styles.categoryText, { color: colors.primary }]}>
                {categoryName.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>

          {date && <Text style={[styles.date, { color: colors.textMuted }]}>{date}</Text>}
        </View>

        {/* IMAGE */}
        {fullImageUrl ? (
          <Image
            source={{ uri: fullImageUrl }}
            style={[styles.thumbnail, { backgroundColor: isDark ? colors.border : '#eee' }]}
            resizeMode="cover"
            fadeDuration={300}
          />
        ) : (
          <View style={[styles.thumbnailPlaceholder, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
  },

  categoryText: {
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
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },

  date: {
    fontSize: 12,
  },

  thumbnail: {
    width: 96,
    height: 64,
    borderRadius: 10,
  },

  thumbnailPlaceholder: {
    width: 96,
    height: 64,
    borderRadius: 10,
  },
});

export default ListCard;