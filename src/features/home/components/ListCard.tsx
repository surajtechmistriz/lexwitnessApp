import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Fallback from '../../../assets/images/fallback.png';
import { useTheme } from '../../../store/hooks/useTheme';
import { getPostImageUrl } from '../../../utils/helpers/imageHelper';
import type { ListCardProps } from '../types';

type RootStackParamList = {
  ArticleDetail: {
    slug: string;
    category: string;
  };
  Category: {
    slug: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ListCard = ({ category, title, slug, date, image }: ListCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const [imageError, setImageError] = useState(false);

  const categoryName = typeof category === 'string' ? category : category?.name;

  const categorySlug =
    typeof category === 'string' ? 'general' : category?.slug ?? 'general';

  const imageUrl = getPostImageUrl(image);

  const handleArticlePress = () => {
    navigation.navigate('ArticleDetail', {
      slug,
      category: categorySlug,
    });
  };

  const handleCategoryPress = () => {
    navigation.navigate('Category', {
      slug: categorySlug,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
        },
      ]}
      onPress={handleArticlePress}
    >
      <View style={styles.row}>
        <View style={styles.textContainer}>
          {!!categoryName && (
            <TouchableOpacity
              style={styles.category}
              onPress={handleCategoryPress}
              activeOpacity={0.7}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {categoryName.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {date && (
            <Text
              style={[
                styles.date,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              {date}
            </Text>
          )}
        </View>

        <Image
          source={imageUrl && !imageError ? { uri: imageUrl } : Fallback}
          style={[
            styles.thumbnail,
            {
              backgroundColor: isDark ? colors.border : '#eee',
            },
          ]}
          resizeMode="cover"
          fadeDuration={300}
          onError={() => setImageError(true)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ListCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
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
    marginBottom: 4,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 13,
    fontWeight: '600' as const,
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
});
