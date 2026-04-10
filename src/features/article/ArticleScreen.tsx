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
import { RootStackParamList } from '../../navigation/AppNavigator';

import TestimonialCard from './components/Testimonial';
import Header from '../../components/common/Header';
import TopMenu from '../../components/common/Menubar';
import SocialShare from './components/SocialShare';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import Footer from '../../components/common/Footer';
import HomeBanner from '../home/components/HomeBanner';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import { useTabBar } from '../../BotttomTabs/TabBarContext';
import RenderHtml from 'react-native-render-html';

const postBaseUrl = Config.POSTS_BASE_URL;

type Route = RouteProp<RootStackParamList, 'ArticleDetail'>;

export default function ArticleDetailPage() {
  const { width } = useWindowDimensions();

   const { hideTabBar, showTabBar } = useTabBar();
  const scrollOffset = useRef(0);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;

    if (currentOffset <= 0) {
      showTabBar();
    } else if (diff > 10) {
      hideTabBar();
    } else if (diff < -10) {
      showTabBar();
    }
    scrollOffset.current = currentOffset;
  };

  const route = useRoute<Route>();
  const navigation = useNavigation<any>();
  const { slug } = route.params;

  // state
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed] = useState(true);
  const [authorImage, setAuthorImage] = useState('');

  /* ---------------- Article ---------------- */
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

  /* ---------------- Related ---------------- */
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

  /* ---------------- Author ---------------- */
  useEffect(() => {
    const author = article?.author;

    if (author && typeof author !== 'string' && author.image?.trim()) {
      setAuthorImage(`${Config.ADMIN_IMAGE_URL}${author.image}`);
    } else {
      setAuthorImage('');
    }
  }, [article]);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c9060a" />
      </View>
    );
  }

  /* ---------------- Empty ---------------- */
  if (!article) {
    return (
      <View style={styles.center}>
        <Text>Article not found</Text>
      </View>
    );
  }

  const openLink = (link: string) => {
    Linking.openURL(link);
  };


  const shareArticle = async () => {
  try {
    await Share.open({
      title: article.title,
      message: `${article.title}\nhttps://yourwebsite.com/articles/${article.slug}`,
    });
  } catch (err) {
    console.log(err);
  }
};

const articleUrl = `https://lwsubscription.vercel.app/${article.slug}`;

  return (
    <View style={{ flex: 1 }}>
      {/* <Header /> */}
      {/* <TopMenu /> */}

      <ScrollView style={styles.container} contentContainerStyle={styles.pad}    onScroll={handleScroll}
            scrollEventThrottle={16} >
        {/* Category */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryScreen', {
              slug: article.category?.slug,
            })
          }
        >
          <Text style={styles.category}>
            {article.category?.name || 'UNCATEGORIZED'}
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.divider} />

        {/* Meta */}
        <View style={styles.meta}>
          <TouchableOpacity
            onPress={() => {
              if (article.author?.slug) {
                navigation.navigate('AuthorScreen', {
                  slug: article.author.slug,
                });
              }
            }}
          >
            <Text style={styles.author}>
              {typeof article.author === 'string'
                ? article.author
                : article.author?.name || 'Unknown'}
            </Text>
          </TouchableOpacity>

          {/* <Text style={styles.author}>
            {typeof article.author === 'string'
              ? article.author
              : article.author?.name || 'Lex Witness Bureau'}
          </Text> */}

          <Text style={styles.sep}>|</Text>

          <Text style={styles.date}>
            {article.magazine?.month?.name} {article.magazine?.year}
          </Text>
        </View>

        {/* Share */}
        <View style={{}}>
          <SocialShare title={article.title} url={articleUrl} />
        </View>

        {/* Image */}
        {article.image && (
          <Image
            source={{
              uri: article.image.startsWith('http')
                ? article.image
                : `${postBaseUrl}/${article.image}`,
            }}
            style={styles.image}
          />
        )}

        {/* Content */}
      <View style={styles.content}>
          {isSubscribed ? (
            <RenderHtml
              contentWidth={width - 32} // Account for padding (16*2)
              source={{ html: article.description || '' }}
              tagsStyles={tagsStyles} // Apply custom styles for HTML tags
            />
          ) : (
            <View style={styles.lock}>
              <Text style={styles.lockText}>
                Subscribe to Read Full Article
              </Text>
            </View>
          )}
        </View>

        {/* Testimonials */}
        <View>
          {article.reader_feedbacks
            ?.filter((i: any) => i.reader_feedback)
            .map((item: any, i: number) => (
              <View
                key={item.id}
                style={{
                  marginBottom:
                    i === article.reader_feedbacks.length - 1 ? 0 : 16,
                }}
              >
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

        {article.description ? (
          <View style={styles.shareContainer}>
            <SocialShare title={article.title} url={''} />
          </View>
        ) : null}

        {/* Author */}
        {article.author && typeof article.author !== 'string' && (
          <View style={styles.authorBox}>
            <Text style={styles.section}>ABOUT AUTHOR</Text>
            <View style={styles.divider} />

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

              <View style={styles.info}>
                <Text style={styles.name}>
                  {article.author.name?.toUpperCase()}
                </Text>
                <Text style={styles.bio}>
                  {article.author.bio ||
                    `${article.author.name} is a contributor at Lex Witness.`}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.btn, styles.linkedin]}
                  onPress={() =>
                    openLink(
                      `https://www.linkedin.com/
                             )}`,
                    )
                  }
                >
                  <Icon name="linkedin-in" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Related */}
        {related.length > 0 && (
          <View style={styles.related}>
            <Text style={styles.section}>RELATED ARTICLES</Text>
            <View style={styles.divider} />

            {related.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                style={styles.card}
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
                  style={styles.rImage}
                />

                <View style={styles.rText}>
                  <Text numberOfLines={2} style={styles.rTitle}>
                    {post.title}
                  </Text>
                  <Text style={styles.rAuthor}>
                    {typeof post.author === 'string'
                      ? post.author
                      : post.author?.name || 'Lex Witness Bureau'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View>
          <LatestEditionImageOnly />
        </View>
        <View style={styles.BannerContainer}>
          <HomeBanner />
        </View>

        <View style={styles.adContainer}>
          <HomeAdvertisement />
        </View>

        {/* <View style={styles.}>
          <Footer />
        </View> */}
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
  container: { flex: 1, backgroundColor: '#fff' },
  pad: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  category: {
    color: '#c9060a',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  title: { fontSize: 22, fontWeight: '600', color: '#333' },

  divider: {
    width: 40,
    height: 4,
    backgroundColor: '#c9060a',
    // marginVertical: 4,
    marginBottom: 8,
  },

  meta: { flexDirection: 'row', marginBottom: 12 },
  author: { color: '#c9060a' },
  sep: { marginHorizontal: 8 },
  date: { color: '#666' },

  image: { width: '100%', aspectRatio: 16 / 9, marginBottom: 20 },

  content: { marginVertical: 10, textAlign: 'justify' },
  text: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333333',
  },

  lock: { padding: 24, backgroundColor: '#f9f9f9', alignItems: 'center' },
  lockText: { fontSize: 20, fontWeight: '600' },

  section: { fontSize: 18, fontWeight: '700' },

  authorBox: { marginTop: 40 },
  authorCard: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 60, height: 60 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '600' },
  bio: { fontSize: 12 },

  related: { marginVertical: 30 },
  card: { marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  rImage: { width: '100%', height: 180 },
  rText: { padding: 12 },
  rTitle: { fontSize: 16, fontWeight: '500' },
  rAuthor: { color: '#c9060a', marginTop: 4 },

  btn: {
    width: 26,
    height: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  linkedin: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },

  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  adContainer: {
    height: 300,
    backgroundColor: '#fff',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#dddbdb',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 15,
  },
  BannerContainer: { marginHorizontal: 0 },
  footer: {
    marginHorizontal: -18,
  },
});
