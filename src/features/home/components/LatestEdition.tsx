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
  slug?: string; // safe slug
  link?: string; // subscribe link
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

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data); // set api data
        onData(result.data);  // pass parent
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!data) return null;

  /* ---------- NAVIGATION ---------- */

  // article navigation
  const goToArticle = (item: Post) => {
    navigation.navigate('ArticleDetail', {
      slug: item.slug,
      category: item.category?.slug ?? 'general',
    });
  };

  // magazine navigation
  const goToMagazine = () => {
    navigation.navigate('MagazineDetail', {
      slug: data.magazine?.slug ?? String(data.magazine.id),
    });
  };

  /* ---------- UI ---------- */

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
      />

      <View style={styles.magContent}>
        <Text style={styles.magTitle}>{data.magazine?.title}</Text>
        <Text style={styles.magSubtitle}>
          {data.magazine?.magazine_name}
        </Text>
      </View>
    </TouchableOpacity>

    {/* Subscribe */}
    <TouchableOpacity
      style={styles.subscribeBtn}
      onPress={() =>
        data.magazine?.link && Linking.openURL(data.magazine.link)
      }
    >
      <Text style={styles.subscribeText}>Subscribe Now</Text>
    </TouchableOpacity>

    {/* Articles */}
    <View style={styles.articleList}>
      {data.posts?.slice(0, 3).map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.articleRow}
          onPress={() => goToArticle(item)}
        >
          <Image
            source={{ uri: `${PostimgUrl}/${item.image}` }}
            style={styles.articleImage}
          />

          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={styles.articleTitle}>
              {item.title}
            </Text>

            <Text numberOfLines={2} style={styles.articleDesc}>
              {item.short_description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    marginTop: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
    redLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primary,
    marginTop: -10,
    marginLeft:1,
    marginBottom:10
  },

  /* Magazine Card */
  magCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  magImage: {
    width: '100%',
    height: 220, // reduced from 500 
  },

  magContent: {
    padding: 12,
  },

  magTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  magSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  /* Subscribe */
  subscribeBtn: {
     backgroundColor:COLORS.primary,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  subscribeText: {
    color: '#fff',
    fontWeight: '600',
  
  },

  /* Articles */
  articleList: {
    gap: 12,
  },

  articleRow: {
    flexDirection: 'row',
    gap: 10,
  },

  articleImage: {
    width: 90,
    height: 80,
    borderRadius: 6,
  },

  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },

  articleDesc: {
    fontSize: 12,
    color: '#777',
  },
});

export default LatestEdition;