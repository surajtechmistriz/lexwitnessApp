import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Config from 'react-native-config';

import { getArticleBySlug, getRelatedPosts } from '../../services/api/posts';
import { RootStackParamList } from '../../navigation/AppNavigator';

import TestimonialCard from './components/Testimonial';
import SocialShare from './components/SocialShare';
import RenderHtml from 'react-native-render-html';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';

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

  const dispatch = useDispatch();

  const { user, token, subscription } = useSelector(
    (state: RootState) => state.auth,
  );

  const isSubscribed = Boolean(
    user &&
      subscription &&
      subscription.status === 'ACTIVE' &&
      subscription.end_date &&
      new Date(subscription.end_date) >= new Date(),
  );

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

  const plainText = article.description?.replace(/<[^>]+>/g, '') || '';

  const previewText = plainText.split(' ').slice(0, 60).join(' ');

  const handleSubscribe = () => {
    navigation.navigate('Subscription');
  };

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
                navigation.navigate('Category', {
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {article.authors?.map((author: any, index: number) => (
                <TouchableOpacity
                  key={author.slug || index}
                  onPress={() => {
                    if (author?.slug) {
                      navigation.navigate('Author', {
                        slug: author.slug,
                      });
                    }
                  }}
                >
                  <Text style={styles.authorName}>
                    {author?.name}
                    {index !== article.authors.length - 1 ? ', ' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
              <View>
                {/* PREVIEW TEXT */}
                <Text style={styles.previewText}>{previewText}...</Text>

                {/* CTA BOX */}
                <View style={styles.lockBox}>
                  <Text style={styles.lockTitle}>Continue Reading</Text>

                  <Text style={styles.lockSubtext}>
                    Subscribe to unlock full access to this article.
                  </Text>

                  <TouchableOpacity
                    style={styles.subscribeBtn}
                    onPress={handleSubscribe}
                  >
                    <Text style={styles.subscribeBtnText}>SUBSCRIBE NOW</Text>
                  </TouchableOpacity>
                </View>
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

          {/* TAGS */}
          {article.tags?.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>TAGS</Text>

              <View style={styles.tagsWrap}>
                {article.tags.map((tag: any, index: number) => (
                  <TouchableOpacity
                    key={tag.id || index}
                    style={styles.tagPill}
                    onPress={() =>
                      navigation.navigate('Tag', {
                        id: tag.id,
                        slug: tag.slug,
                      })
                    }
                  >
                    <Text style={styles.tagText}>#{tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* AUTHORS */}
          {article.authors?.length > 0 && (
            <View style={styles.authorSection}>
              <Text style={styles.sectionTitle}>
                ABOUT AUTHOR{article.authors.length > 1 ? 'S' : ''}
              </Text>

              {article.authors.map((author: any, index: number) => (
                <View key={author.id || index} style={styles.authorCard}>
                  <Image
                    source={
                      author.image
                        ? {
                            uri: `${Config.ADMIN_IMAGE_URL}${author.image}`,
                          }
                        : require('../../assets/avatar.jpg')
                    }
                    style={styles.avatar}
                  />

                  <View style={styles.authorInfo}>
                    <Text style={styles.authorTitle}>
                      {author.name?.toUpperCase()}
                    </Text>

                    <Text style={styles.bio}>
                      {author.bio ||
                        `${author.name} is a contributor at Lex Witness.`}
                    </Text>
                  </View>
                </View>
              ))}
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
          {/* <View style={styles.adContainer}>
            <HomeAdvertisement />
          </View> */}

          {/* <HomeBanner /> */}
          {/* <LatestEditionImageOnly /> */}
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
    // padding: 14,
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
    marginTop: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#eee',
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

  tagsSection: {
    marginTop: 24,
    paddingHorizontal: 14,
  },

  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tagPill: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  tagText: {
    color: '#c9060a',
    fontSize: 12,
    fontWeight: '600',
  },

  previewText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
    textAlign: 'justify',
  },

  lockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  lockSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 22,
  },

  subscribeBtn: {
    backgroundColor: '#c9060a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  subscribeBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
