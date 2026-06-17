import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Share,
  Platform,
} from 'react-native';
import LinkedinIcon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBack from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { getArticleBySlug, getRelatedPosts } from '../../services/api/posts';
import { RootStackParamList } from '../../navigation/AppNavigator';

import TestimonialCard from './components/Testimonial';
import RenderHtml from 'react-native-render-html';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { Linking } from 'react-native';
import { Animated } from 'react-native';

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

  const [expandedAuthors, setExpandedAuthors] = useState<{
    [key: string]: boolean;
  }>({});
  const rotateAnim = useRef<{ [key: string]: Animated.Value }>({}).current;

  const { user, subscription } = useSelector((state: RootState) => state.auth);

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
          headerBackTitle: 'Back',
          headerTintColor: '#c9060a',
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

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\nRead this article on Lex Witness\n\nhttps://lwsubscription.vercel.app/${article.slug}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

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
        <Icon name="document-text-outline" size={48} color="#999" />
        <Text style={styles.notFoundText}>Article not found</Text>
      </View>
    );
  }

  const plainText = article.description?.replace(/<[^>]+>/g, '') || '';
  const previewText = plainText.split(' ').slice(0, 60).join(' ');

  const handleSubscribe = () => {
    navigation.navigate('Subscription');
  };

  const toggleAuthor = (authorKey: string) => {
    setExpandedAuthors(prev => {
      const isOpen = !prev[authorKey];

      // Animate the chevron
      if (rotateAnim[authorKey]) {
        Animated.timing(rotateAnim[authorKey], {
          toValue: isOpen ? 1 : 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }

      return {
        ...prev,
        [authorKey]: isOpen,
      };
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          {article.image && (
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: article.image.startsWith('http')
                    ? article.image
                    : `${postBaseUrl}/${article.image}`,
                }}
                style={styles.heroImage}
              />

              <LinearGradient
                colors={['transparent', 'rgba(51,51,51,0.8)']}
                style={styles.imageGradient}
              />

              {/*  BACK BUTTON OVER IMAGE */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <IconBack name="arrow-left" size={22} color="#c9060a" />
              </TouchableOpacity>
            </View>
          )}

          {/* Category and Share Row */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Category', {
                  slug: article.category?.slug,
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>
                  {article.category?.name || 'UNCATEGORIZED'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              {/* <Icon name="share-outline" size={20} color="#666" /> */}
              <Icon name="share-social" size={20} color="#c9060a" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.authorsList}>
              <Icon name="person-outline" size={14} color="#c9060a" />
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

            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={14} color="#999" />
              <Text style={styles.dateText}>
                {article.magazine?.month?.name} {article.magazine?.year}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.contentCard}>
          {/* Article Body */}
          <View style={styles.articleBody}>
            {isSubscribed ? (
              (() => {
                const cleanedHtml =
                  article.description
                    ?.replace(/&nbsp;/g, ' ')
                    ?.replace(/\s+/g, ' ')
                    ?.replace(
                      /list-style-type:\s*numeric/g,
                      'list-style-type: decimal',
                    ) || '';

                return (
                  <RenderHtml
                    contentWidth={width - 40}
                    source={{ html: cleanedHtml }}
                    tagsStyles={tagsStyles}
                    baseStyle={{
                      color: '#222',
                      fontSize: 14,
                      lineHeight: 24,
                    }}
                    defaultTextProps={{
                      selectable: true,
                      allowFontScaling: true,
                    }}
                    enableExperimentalMarginCollapsing={true}
                    enableCSSInlineProcessing={true}
                  />
                );
              })()
            ) : (
              <View>
                {/* Preview Text */}
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText}>{previewText}...</Text>
                </View>

                {/* Premium Lock Box */}
                <View style={styles.lockBox}>
                  <View style={styles.lockIconContainer}>
                    <Icon name="lock-closed" size={32} color="#c9060a" />
                  </View>
                  <Text style={styles.lockTitle}>Premium Content</Text>
                  <Text style={styles.lockSubtext}>
                    Subscribe to unlock full access to this article and
                    thousands more
                  </Text>

                  <TouchableOpacity
                    style={styles.subscribeBtn}
                    onPress={handleSubscribe}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
                    <Icon name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>

                  <Text style={styles.lockFooter}>
                    Already have an account? Sign in
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Testimonials/Feedback */}
          {article.reader_feedbacks?.filter((i: any) => i.reader_feedback)
            .length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reader Feedback</Text>
                <View style={styles.sectionLine} />
              </View>
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
          )}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <View style={styles.tagsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Topics</Text>
                <View style={styles.sectionLine} />
              </View>
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tagText}>#{tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Authors Section */}
          {/* Authors Section */}
          {article.authors?.length > 0 && (
            <View style={styles.authorSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  About {article.authors.length > 1 ? 'Authors' : 'Author'}
                </Text>
                <View style={styles.sectionLine} />
              </View>

              {article.authors.map((author: any, index: number) => {
                //  Create unique key INSIDE the map for each author
                const authorKey = author.id || author.slug || index.toString();

                //  Initialize animation value if not exists (move inside map)
                if (!rotateAnim[authorKey]) {
                  rotateAnim[authorKey] = new Animated.Value(0);
                }

                return (
                  <View key={authorKey} style={styles.authorCard}>
                    {/* Top Row */}
                    <View style={styles.authorTopRow}>
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

                      <View style={styles.authorMeta}>
                        <Text style={styles.authorTitle}>{author.name}</Text>
                        <Text style={styles.authorRole}>
                          {author.email || 'Contributor'}
                        </Text>

                        {author.linkedin ? (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.linkedinRow}
                            onPress={() => Linking.openURL(author.linkedin)}
                          >
                            <LinkedinIcon
                              name="linkedin-square"
                              size={18}
                              color="#0A66C2"
                            />
                            <Text style={styles.linkedinText}>LinkedIn</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>

                    {/* Description - uses expandedAuthors with correct key */}
                    <Text
                      style={styles.bio}
                      numberOfLines={expandedAuthors[authorKey] ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      {author.description ||
                        `${author.name} is a contributor at Lex Witness.`}
                    </Text>

                    {/* Read More Button */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.readMoreBtn}
                      onPress={() => toggleAuthor(authorKey)}
                    >
                      <Text style={styles.readMoreText}>
                        {expandedAuthors[authorKey] ? 'Show less' : 'View more'}
                      </Text>

                      <Animated.View
                        style={{
                          marginLeft: 4,
                          transform: [
                            {
                              rotate: rotateAnim[authorKey]
                                ? rotateAnim[authorKey].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                  })
                                : '0deg',
                            },
                          ],
                        }}
                      >
                        <Icon name="chevron-down" size={16} color="#6b7280" />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Related Stories */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Related Stories</Text>
                <View style={styles.sectionLine} />
              </View>

              {related.map((post: any) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.relatedCard}
                  onPress={() =>
                    navigation.push('ArticleDetail', { slug: post.slug })
                  }
                  activeOpacity={0.8}
                >
                  <Image
                    source={
                      post.image
                        ? {
                            uri: post.image.startsWith('http')
                              ? post.image
                              : `${postBaseUrl}/${post.image}`,
                          }
                        : require('../../assets/image.png')
                    }
                    style={styles.relatedImage}
                    resizeMode="cover"
                    onError={e => {
                      e.currentTarget.setNativeProps({
                        source: require('../../assets/image.png'),
                      });
                    }}
                  />
                  <View style={styles.relatedText}>
                    <Text numberOfLines={2} style={styles.relatedTitle}>
                      {post.title}
                    </Text>
                    <View style={styles.relatedMeta}>
                      <Icon name="person-outline" size={12} color="#c9060a" />
                      <Text style={styles.relatedAuthor}>
                        {typeof post.author === 'string'
                          ? post.author
                          : post.author?.name || 'Lex Witness Bureau'}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#ccc"
                    style={styles.relatedArrow}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const tagsStyles = {
  body: {
    color: '#222',
    fontSize: 15,
    lineHeight: 24,
  },

  p: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2d2d2d',
    marginBottom: 18,
    textAlign: 'justify',
  },

  h1: {
    fontSize: 25,
    lineHeight: 35,
    fontWeight: '800',
    color: '#111',
    marginTop: 26,
    marginBottom: 18,
  },

  h2: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '700',
    color: '#111',
    marginTop: 24,
    marginBottom: 16,
  },

  h3: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700',
    color: '#111',
    marginTop: 20,
    marginBottom: 14,
  },

  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111',
    marginTop: 18,
    marginBottom: 12,
  },

  h5: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: '#111',
    marginTop: 16,
    marginBottom: 10,
  },

  h6: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#111',
    marginTop: 14,
    marginBottom: 8,
  },

  strong: {
    fontWeight: '700',
    color: '#111',
  },

  b: {
    fontWeight: '700',
    color: '#111',
  },

  em: {
    fontStyle: 'italic',
  },

  i: {
    fontStyle: 'italic',
  },

  u: {
    textDecorationLine: 'underline',
  },

  a: {
    color: '#c9060a',
    textDecorationLine: 'underline',
  },

  ul: {
    marginVertical: 12,
    paddingLeft: 20,
  },

  ol: {
    marginVertical: 12,
    paddingLeft: 20,
  },

  li: {
    fontSize: 16,
    lineHeight: 28,
    color: '#2d2d2d',
    marginBottom: 8,
  },

  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#c9060a',
    backgroundColor: '#fafafa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 20,
    borderRadius: 12,
  },

  img: {
    width: '100%',
    height: 'auto',
    borderRadius: 18,
    marginVertical: 20,
  },

  table: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginVertical: 20,
  },

  th: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    fontWeight: '700',
  },

  td: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  tr: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  code: {
    backgroundColor: '#f4f4f4',
    color: '#c9060a',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 14,
  },

  pre: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 14,
    marginVertical: 20,
  },

  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 24,
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollWrap: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  notFoundText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  heroContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: '#fff0f0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#c9060a',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    paddingHorizontal: 20,
    lineHeight: 30,
    marginBottom: 12,
    textAlign: 'justify',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  authorsList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  authorName: {
    color: '#c9060a',
    fontWeight: '600',
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#999',
    fontSize: 13,
  },
  contentCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  articleBody: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  previewContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#666',
  },
  lockBox: {
    marginTop: 8,
    padding: 28,
    backgroundColor: '#fff5f5',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  lockSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  subscribeBtn: {
    backgroundColor: '#c9060a',
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.8,
  },
  lockFooter: {
    marginTop: 20,
    fontSize: 13,
    color: '#999',
  },
  sectionBlock: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    letterSpacing: -0.3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 12,
  },
  tagsSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagPill: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  tagText: {
    color: '#c9060a',
    fontSize: 13,
    fontWeight: '600',
  },

  authorSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },

  authorCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  authorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f1f1f1',
  },

  authorMeta: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },

  linkedinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  linkedinText: {
    marginLeft: 6,
    color: '#0A66C2',
    fontSize: 13,
    fontWeight: '600',
  },

  authorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  authorRole: {
    fontSize: 13,
    color: '#c9060a',
    marginTop: 5,
    fontWeight: '600',
  },

  bio: {
    fontSize: 14,
    lineHeight: 24,
    color: '#555',
    marginTop: 16,
  },

  authorContent: {
    flex: 1,
  },

  relatedSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
    alignItems: 'center',
  },
  relatedImage: {
    width: 80,
    height: 80,
  },
  relatedText: {
    flex: 1,
    padding: 12,
  },
  relatedTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  relatedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedAuthor: {
    color: '#c9060a',
    fontSize: 11,
    fontWeight: '500',
  },
  relatedArrow: {
    marginRight: 12,
  },

  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginTop: 6,
  },

  readMoreText: {
    fontSize: 13,
    color: '#c9060a', // soft gray (professional UI tone)
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  backBtn: {
    position: 'absolute',
    top: 10, // adjust for status bar
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3', // optional for visibility
    zIndex: 10,
    color: '#c9060a',
  },
});
