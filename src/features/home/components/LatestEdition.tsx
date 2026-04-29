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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../../theme/colors';

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

type RootStackParamList = {
  ArticleDetail: { slug: string; category: string };
  MagazineDetail: { slug: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* ---------- CONSTANTS ---------- */

const MagimgUrl = Config.MAGAZINES_BASE_URL;
const PostimgUrl = Config.POSTS_BASE_URL;

/* ---------- COMPONENT ---------- */

const LatestEdition = ({ onData }: { onData: (data: any) => void }) => {
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp>();

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
        color={COLORS.primary}
        style={{ marginTop: 24 }}
      />
    );
  }

  if (!data) return null;

  const goToArticle = (item: Post) => {
    navigation.navigate('ArticleDetail', {
      slug: item.slug,
      category: item.category?.slug ?? 'general',
    });
  };

  const goToMagazine = () => {
      navigation.navigate('Magazines', {
                screen: 'MagazineDetail',
                params: {
                  slug: data.magazine?.slug ?? String(data.magazine.id),
                },
              })
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Text style={styles.heading}>Latest Edition</Text>
      <View style={styles.redLine} />

      {/* Magazine Card */}
      <TouchableOpacity style={styles.magCard} onPress={goToMagazine}>
        <Image
          source={{ uri: `${MagimgUrl}/${data.magazine?.image}` }}
          style={styles.magImage}
          resizeMode='contain'
        />

        <View style={styles.magContent}>
          <Text style={styles.magTitle} numberOfLines={1}>
            {data.magazine?.title}
          </Text>
          <Text style={styles.magSubtitle} numberOfLines={1}>
            {data.magazine?.magazine_name}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Subscribe – always visible but safe */}
      <TouchableOpacity
        style={[styles.subscribeBtn, !data.magazine?.link && styles.disabledBtn]}
        onPress={() => {
          if (data.magazine?.link) {
            Linking.openURL(data.magazine.link);
          }
        }}
        disabled={!data.magazine?.link}
      >
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>

      {/* Articles – as cards */}
      <View style={styles.articleList}>
        {data.posts.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.articleCard}
            onPress={() => goToArticle(item)}
          >
            <Image
              source={{ uri: `${PostimgUrl}/${item.image}` }}
              style={styles.articleImage}
            />

            <View style={styles.articleContent}>
              <Text numberOfLines={2} style={styles.articleTitle}>
                {item.title}
              </Text>

              <Text numberOfLines={2} style={styles.articleDesc}>
                {item.short_description}
              </Text>

              {item.category?.slug && (
                <Text style={styles.categoryBadge}>{item.category.slug}</Text>
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
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  redLine: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.primary,
    marginBottom: 12,
  },

  /* Magazine Card */
  magCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

magImage: {
  width: '100%',
  aspectRatio: 4 / 3,
  // aspectRatio: 16 / 9,
  backgroundColor: '#f5f5f5',
},
  magContent: {
    padding: 12,
  },

  magTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  magSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  /* Subscribe */
  subscribeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  disabledBtn: {
    // opacity: 0.6,
    elevation: 0,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Articles – cards */
  articleList: {
    gap: 12,
  },

articleCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  flexDirection: 'row',
  overflow: 'hidden',
  marginBottom: 10,

  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
    alignItems: 'center',
},

articleImage: {
  width: 110,
  aspectRatio: 16 / 9,   // ✅ MAIN FIX
  borderRadius: 10,
  margin: 10,
  backgroundColor: '#eee',
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
    color: '#111',
    marginBottom: 4,
  },

  articleDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },

  categoryBadge: {
    fontSize: 10,
    color: '#c9060a',
    fontWeight: '500',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(201, 6, 10, 0.1)',
  },
});