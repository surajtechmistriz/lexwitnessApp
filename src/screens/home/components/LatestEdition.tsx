'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { latesteEdition } from '../../../services/api/latestedition';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../redux/useTheme';

/* ---------- TYPES ---------- */

type Post = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  short_description: string;
  slug: string;
  category?: {
    slug: string;
    name?: string;
  };
};

type Magazine = {
  magazine_name: ReactNode;
  id: number;
  title: string;
  image: string;
  year: number;
  slug?: string;
  link?: string;
};

type EditionResponse = {
  magazine: Magazine;
  posts: Post[];
};

/* ---------- CONSTANTS ---------- */

const MagimgUrl = Config.MAGAZINES_BASE_URL;
const PostimgUrl = Config.POSTS_BASE_URL;

/* ---------- COMPONENT ---------- */

const LatestEdition = ({ onData }: { onData: (data: any) => void }) => {
  const { colors, isDark } = useTheme();
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data);
        onData(result.data);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onData]);

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginTop: 24 }}
      />
    );
  }

  if (!data) return null;

  //  FIXED - Direct navigation
  const goToArticle = (item: Post) => {
    navigation.navigate('ArticleDetail', {
      slug: item.slug,
      category: item.category?.slug ?? 'general',
    });
  };

  //  FIXED - Direct navigation
  const goToMagazine = () => {
    navigation.navigate('MagazineDetail', {
      slug: data.magazine?.slug ?? String(data.magazine.id),
    });
  };

  //  FIXED - Direct navigation
  const handleSubscribe = () => {
    navigation.navigate('Subscription');
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Text style={[styles.heading, { color: colors.text }]}>Latest Edition</Text>
      <View style={[styles.redLine, { backgroundColor: colors.primary }]} />

      {/* Magazine Card */}
      <TouchableOpacity 
        style={[styles.magCard, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
        }]} 
        onPress={goToMagazine}
      >
        <Image
          source={{ uri: `${MagimgUrl}/${data.magazine?.image}` }}
          style={[styles.magImage, { backgroundColor: isDark ? colors.border : '#f5f5f5' }]}
          resizeMode="contain"
        />

        <View style={styles.magContent}>
          <Text style={[styles.magTitle, { color: colors.text }]} numberOfLines={1}>
            {data.magazine?.title}
          </Text>
          <Text style={[styles.magSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {data.magazine?.magazine_name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Subscribe */}
      <TouchableOpacity
        style={[styles.subscribeBtn, { backgroundColor: colors.primary }]}
        onPress={handleSubscribe}
      >
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>

      {/* Articles – as cards */}
      <View style={styles.articleList}>
        {data.posts.slice(0, 3).map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.articleCard, { 
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
            }]}
            onPress={() => goToArticle(item)}
          >
            <Image
              source={{ uri: `${PostimgUrl}/${item.image}` }}
              style={[styles.articleImage, { backgroundColor: isDark ? colors.border : '#eee' }]}
            />

            <View style={styles.articleContent}>
              <Text numberOfLines={2} style={[styles.articleTitle, { color: colors.text }]}>
                {item.title}
              </Text>

              <Text numberOfLines={2} style={[styles.articleDesc, { color: colors.textSecondary }]}>
                {item.short_description}
              </Text>

              {item.category?.slug && (
                <Text style={[styles.categoryBadge, { 
                  color: colors.primary,
                  backgroundColor: isDark ? colors.primaryBackground : 'rgba(201, 6, 10, 0.1)',
                }]}>
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
  wrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: -12,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  redLine: {
    width: 36,
    height: 4,
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
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '600',
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
    fontWeight: '600',
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