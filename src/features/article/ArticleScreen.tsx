import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Share,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Config from 'react-native-config';

import { getArticleBySlug, getRelatedPosts } from '../../services/api/posts';
import {
  navigationRef,
  RootStackParamList,
} from '../../navigation/AppNavigator';

import TestimonialCard from './components/Testimonial';
import Header from '../../components/common/Header';
import TopMenu from '../../components/common/Menubar';
import SocialShare from './components/SocialShare';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import Footer from '../../components/common/Footer';
import HomeBanner from '../home/components/HomeBanner';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import RenderHtml from 'react-native-render-html';
import { navigateToAuthor } from '../../utils/helper/navigationHelper';

const postBaseUrl = Config.POSTS_BASE_URL;

type Route = RouteProp<RootStackParamList, 'ArticleDetail'>;

export default function ArticleDetailPage() {
  const { width } = useWindowDimensions();

  const route = useRoute<Route>();
  const navigation = useNavigation<any>();
  const { slug } = route.params;

  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed] = useState(true);
  const [authorImage, setAuthorImage] = useState('');

  useEffect(() => {
    let alive = true;

    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setArticle(null);
        setRelated([]);

        const res = await getArticleBySlug(slug.toString());
        if (!alive) return;

        if (!res || res.status === false) {
          setArticle(null);
          return;
        }

        setArticle(res);

        navigation.setOptions?.({
          title: res.title,
        });
      } catch (e) {
        console.error('Article error:', e);
        if (alive) setArticle(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchArticle();
    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    let alive = true;

    const fetchRelated = async () => {
      if (!article) return;

      try {
        const calls: Promise<any>[] = [];

        if (article.category_id)
          calls.push(getRelatedPosts({ category_id: article.category_id }));

        if (article.author_id)
          calls.push(getRelatedPosts({ author_id: article.author_id }));

        if (article.magazine_id)
          calls.push(getRelatedPosts({ magazine_id: article.magazine_id }));

        const results = await Promise.all(calls);
        if (!alive) return;

        const merged = Array.from(
          new Map(
            results
              .flat()
              .filter((p: any) => p.slug !== article.slug)
              .map((p: any) => [p.id, p]),
          ).values(),
        ).slice(0, 3);

        setRelated(merged);
      } catch (e) {
        console.error('Related error:', e);
        if (alive) setRelated([]);
      }
    };

    fetchRelated();
    return () => {
      alive = false;
    };
  }, [article]);

  useEffect(() => {
    const author = article?.author;

    if (author && typeof author !== 'string' && author.image?.trim()) {
      setAuthorImage(`${Config.ADMIN_IMAGE_URL}${author.image}`);
    } else {
      setAuthorImage('');
    }
  }, [article]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c9060a" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <Text>Article not found</Text>
      </View>
    );
  }

  const articleUrl = `https://lwsubscription.vercel.app/${article.slug}`;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollWrap}>

        {/* 📰 Magazine Container */}
        <View style={styles.magazineCard}>

          {/* HERO IMAGE */}
          {article.image && (
            <Image
              source={{
                uri: article.image.startsWith('http')
                  ? article.image
                  : `${postBaseUrl}/${article.image}`,
              }}
              style={styles.heroImage}
            />
          )}

          {/* CATEGORY + SHARE */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryScreen', {
                  slug: article.category?.slug,
                })
              }
            >
              <Text style={styles.categoryPill}>
                {article.category?.name || 'UNCATEGORIZED'}
              </Text>
            </TouchableOpacity>

            <SocialShare title={article.title} url={articleUrl} />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>{article.title}</Text>

          {/* META */}
          <View style={styles.metaRow}>
            <TouchableOpacity
              onPress={() => {
                if (article.author?.slug && navigationRef.isReady()) {
                  navigationRef.navigate('AuthorScreen', {
                    slug: article.author.slug,
                  });
                }
              }}
            >
              <Text style={styles.authorName}>
                {typeof article.author === 'string'
                  ? article.author
                  : article.author?.name || 'Unknown'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.dateText}>
              {article.magazine?.month?.name} {article.magazine?.year}
            </Text>
          </View>

          {/* ARTICLE BODY */}
          <View style={styles.articleBody}>
            {isSubscribed ? (
              <RenderHtml
                contentWidth={width - 48}
                source={{ html: article.description || '' }}
                tagsStyles={tagsStyles}
              />
            ) : (
              <View style={styles.lockBox}>
                <Text style={styles.lockText}>
                  Subscribe to Read Full Article
                </Text>
              </View>
            )}
          </View>

          {/* TESTIMONIALS */}
          <View style={styles.sectionBlock}>
            {article.reader_feedbacks
              ?.filter((i: any) => i.reader_feedback)
              .map((item: any, i: number) => (
                <View key={item.id} style={{ marginBottom: 16 }}>
                  <TestimonialCard
                    data={{
                      reader_feedback: item.reader_feedback,
                      reader_name: item.reader_name,
                      reader_designation: item.reader_designation,
                      text_alignment:
                        (item.text_aligment?.replace('text-', '') as any) ||
                        'left',
                    }}
                  />
                </View>
              ))}
          </View>

          {/* AUTHOR */}
          {article.author && typeof article.author !== 'string' && (
            <View style={styles.authorSection}>
              <Text style={styles.sectionTitle}>ABOUT AUTHOR</Text>

              <View style={styles.authorCard}>
                <Image
                  source={
                    authorImage
                      ? { uri: authorImage }
                      : require('../../assets/avatar.jpg')
                  }
                  style={styles.avatar}
                  onError={() => setAuthorImage('')}
                />

                <View style={styles.authorInfo}>
                  <Text style={styles.authorTitle}>
                    {article.author.name?.toUpperCase()}
                  </Text>
                  <Text style={styles.bio}>
                    {article.author.bio ||
                      `${article.author.name} is a contributor at Lex Witness.`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* RELATED */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>RELATED STORIES</Text>

              {related.map((post: any) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.relatedCard}
                  onPress={() =>
                    navigation.push('ArticleDetail', { slug: post.slug })
                  }
                >
                  <Image
                    source={{
                      uri: post.image?.startsWith('http')
                        ? post.image
                        : `${postBaseUrl}/${post.image}`,
                    }}
                    style={styles.relatedImage}
                  />

                  <View style={styles.relatedText}>
                    <Text numberOfLines={2} style={styles.relatedTitle}>
                      {post.title}
                    </Text>
                    <Text style={styles.relatedAuthor}>
                      {typeof post.author === 'string'
                        ? post.author
                        : post.author?.name || 'Lex Witness Bureau'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ADS */}
          <View style={styles.adContainer}>
            <HomeAdvertisement />
          </View>

          <HomeBanner />
          <LatestEditionImageOnly />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const tagsStyles = {
  body: {
    whiteSpace: 'normal',
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
  p: {
    marginBottom: 15,
    textAlign: 'justify',
  },
  strong: {
    fontWeight: '700',
    color: '#000',
  },
  li: {
    color: '#333',
    marginBottom: 5,
  },
  a: {
    color: '#c9060a',
    textDecorationLine: 'none',
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  scrollWrap: {
    padding: 14,
  },

  magazineCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    paddingBottom: 20,
  },

  heroImage: {
    width: '100%',
    height: 240,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    alignItems: 'center',
  },

  categoryPill: {
    color: '#c9060a',
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    backgroundColor: '#fff0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    paddingHorizontal: 14,
    lineHeight: 30,
  },

  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginTop: 8,
    alignItems: 'center',
  },

  authorName: {
    color: '#c9060a',
    fontWeight: '600',
  },

  dot: {
    marginHorizontal: 8,
    color: '#999',
  },

  dateText: {
    color: '#777',
  },

  articleBody: {
    paddingHorizontal: 14,
    marginTop: 12,
  },

  lockBox: {
    padding: 20,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    borderRadius: 10,
  },

  lockText: {
    fontSize: 16,
    fontWeight: '600',
  },

  sectionBlock: {
    marginTop: 20,
    paddingHorizontal: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  authorSection: {
    marginTop: 20,
    paddingHorizontal: 14,
  },

  authorCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },

  authorTitle: {
    fontWeight: '700',
  },

  bio: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  relatedSection: {
    marginTop: 25,
    paddingHorizontal: 14,
  },

  relatedCard: {
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },

  relatedImage: {
    width: 90,
    height: 90,
  },

  relatedText: {
    flex: 1,
    padding: 10,
  },

  relatedTitle: {
    fontWeight: '600',
  },

  relatedAuthor: {
    color: '#c9060a',
    marginTop: 4,
    fontSize: 12,
  },

  adContainer: {
    marginTop: 20,
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
