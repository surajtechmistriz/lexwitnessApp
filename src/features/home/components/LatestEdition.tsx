import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../store/hooks/useTheme';
import {
  getMagazineImageUrl,
  getPostImageUrl,
} from '../../../utils/helpers/imageHelper';

import { latesteEdition } from '../../../services/home.service';
import type { EditionResponse, LatestEditionProps, Post } from '../../../types/home.types';

const LatestEdition = ({ onData }: LatestEditionProps) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEdition = useCallback(async () => {
    try {
      const result = await latesteEdition();
      const edition = result.data;

      setData(edition);
      onData(edition);
    } catch (error) {
      console.error('Failed to load latest edition:', error);
    } finally {
      setLoading(false);
    }
  }, [onData]);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  const handleArticlePress = useCallback(
    (item: Post) => {
      navigation.navigate('ArticleDetail', {
        slug: item.slug,
        category: item.category?.slug ?? 'general',
      });
    },
    [navigation],
  );

  const handleMagazinePress = useCallback(() => {
    if (!data?.magazine) {
      return;
    }

    navigation.navigate('MagazineDetail', {
      slug: data.magazine.slug ?? String(data.magazine.id),
    });
  }, [data, navigation]);

  const handleSubscribe = useCallback(() => {
    navigation.navigate('Subscription');
  }, [navigation]);

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={styles.loading}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.heading, { color: colors.text }]}>
        Latest Edition
      </Text>

      <View
        style={[
          styles.redLine,
          {
            backgroundColor: colors.primary,
          },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.magCard,
          {
            backgroundColor: colors.card,
            shadowColor: '#000',
          },
        ]}
        onPress={handleMagazinePress}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: getMagazineImageUrl(data.magazine.image),
          }}
          style={[
            styles.magImage,
            {
              backgroundColor: isDark ? colors.border : '#f5f5f5',
            },
          ]}
          resizeMode="contain"
        />

        <View style={styles.magContent}>
          <Text
            style={[styles.magTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {data.magazine.title}
          </Text>

          <Text
            style={[styles.magSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {data.magazine.magazine_name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.subscribeBtn,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={handleSubscribe}
        activeOpacity={0.8}
      >
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>

      <View style={styles.articleList}>
        {data.posts.slice(0, 3).map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.articleCard,
              {
                backgroundColor: colors.card,
                shadowColor: '#000',
              },
            ]}
            onPress={() => handleArticlePress(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: getPostImageUrl(item.image),
              }}
              style={[
                styles.articleImage,
                {
                  backgroundColor: isDark ? colors.border : '#eee',
                },
              ]}
            />

            <View style={styles.articleContent}>
              <Text
                numberOfLines={2}
                style={[styles.articleTitle, { color: colors.text }]}
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={2}
                style={[styles.articleDesc, { color: colors.textSecondary }]}
              >
                {item.short_description}
              </Text>

              {item.category?.slug && (
                <Text
                  style={[
                    styles.categoryBadge,
                    {
                      color: colors.primary,
                      backgroundColor: isDark
                        ? colors.primaryBackground
                        : 'rgba(201, 6, 10, 0.1)',
                    },
                  ]}
                >
                  {item.category.slug}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LatestEdition;

const styles = StyleSheet.create({
  loading: {
    marginTop: 24,
  },

  wrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: -12,
  },

  heading: {
    fontSize: 15,
    fontWeight: '600',
  },

  redLine: {
    width: 36,
    height: 3,
    marginBottom: 12,
  },

  magCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  magImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },

  magContent: {
    padding: 12,
  },

  magTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  magSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  subscribeBtn: {
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },

  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },

  articleList: {
    gap: 12,
  },

  articleCard: {
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },

  articleImage: {
    width: 110,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    margin: 10,
  },

  articleContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },

  articleTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 4,
  },

  articleDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },

  categoryBadge: {
    fontSize: 10,
    fontWeight: '500',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
