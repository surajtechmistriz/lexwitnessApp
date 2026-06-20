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
import TestimonialCard from './components/Testimonial';
import RenderHtml from 'react-native-render-html';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { Linking } from 'react-native';
import { Animated } from 'react-native';
import { useTheme } from '../../redux/hooks/useTheme';

const postBaseUrl = Config.POSTS_BASE_URL;

type Route = RouteProp<{ ArticleDetail: { slug: string } }, 'ArticleDetail'>;

export default function ArticleDetailPage() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  const route = useRoute<Route>();
  const navigation = useNavigation<any>();
  const { slug } = route.params || {};

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

  // ============================================================
  //  FIXED NAVIGATION FUNCTIONS
  // ============================================================

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategoryPress = (category: any) => {
    if (category?.slug) {
      navigation.navigate('Category', {
        slug: category.slug,
      });
    }
  };

  const handleAuthorPress = (author: any) => {
    if (author?.slug) {
      navigation.navigate('Author', {
        slug: author.slug,
      });
    }
  };

  const handleTagPress = (tag: any) => {
    if (tag?.id && tag?.slug) {
      navigation.navigate('Tag', {
        id: tag.id,
        slug: tag.slug,
      });
    }
  };

  const handleRelatedPress = (post: any) => {
    navigation.navigate('ArticleDetail', { slug: post.slug });
  };

  const handleSubscribe = () => {
    navigation.navigate('Subscription');
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Icon name="document-text-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
          Article not found
        </Text>
      </View>
    );
  }

  const plainText = article.description?.replace(/<[^>]+>/g, '') || '';
  const previewText = plainText.split(' ').slice(0, 60).join(' ');

  const toggleAuthor = (authorKey: string) => {
    setExpandedAuthors(prev => {
      const isOpen = !prev[authorKey];

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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={[styles.heroContainer, { backgroundColor: colors.card }]}>
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

              <TouchableOpacity
                onPress={handleBack}
                style={[styles.backBtn, { backgroundColor: colors.card }]}
              >
                <IconBack name="arrow-left" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Category and Share Row */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => handleCategoryPress(article.category)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryPill, { backgroundColor: colors.primaryBackground }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {article.category?.name || 'UNCATEGORIZED'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleShare} 
              style={[styles.shareButton, { backgroundColor: colors.background }]}
            >
              <Icon name="share-social" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {article.title}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.authorsList}>
              <Icon name="person-outline" size={14} color={colors.primary} />
              {article.authors?.map((author: any, index: number) => (
                <TouchableOpacity
                  key={author.slug || index}
                  onPress={() => handleAuthorPress(author)}
                >
                  <Text style={[styles.authorName, { color: colors.primary }]}>
                    {author?.name}
                    {index !== article.authors.length - 1 ? ', ' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.dateText, { color: colors.textMuted }]}>
                {article.magazine?.month?.name} {article.magazine?.year}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={[styles.contentCard, { 
          backgroundColor: colors.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }]}>
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
                      color: colors.text,
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
                <View style={[styles.previewContainer, { 
                  backgroundColor: colors.background,
                }]}>
                  <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                    {previewText}...
                  </Text>
                </View>

                {/* Premium Lock Box */}
                <View style={[styles.lockBox, { 
                  backgroundColor: colors.primaryBackground,
                  borderColor: colors.border,
                }]}>
                  <View style={[styles.lockIconContainer, { 
                    backgroundColor: colors.card,
                    shadowColor: colors.primary,
                  }]}>
                    <Icon name="lock-closed" size={32} color={colors.primary} />
                  </View>
                  <Text style={[styles.lockTitle, { color: colors.text }]}>
                    Premium Content
                  </Text>
                  <Text style={[styles.lockSubtext, { color: colors.textSecondary }]}>
                    Subscribe to unlock full access to this article and
                    thousands more
                  </Text>

                  <TouchableOpacity
                    style={[styles.subscribeBtn, { 
                      backgroundColor: colors.primary,
                      shadowColor: colors.primary,
                    }]}
                    onPress={handleSubscribe}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
                    <Icon name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>

                  <Text style={[styles.lockFooter, { color: colors.textMuted }]}>
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
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Reader Feedback
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
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
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Topics
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
              </View>
              <View style={styles.tagsWrap}>
                {article.tags.map((tag: any, index: number) => (
                  <TouchableOpacity
                    key={tag.id || index}
                    style={[styles.tagPill, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }]}
                    onPress={() => handleTagPress(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      #{tag.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Authors Section */}
          {article.authors?.length > 0 && (
            <View style={styles.authorSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  About {article.authors.length > 1 ? 'Authors' : 'Author'}
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
              </View>

              {article.authors.map((author: any, index: number) => {
                const authorKey = author.id || author.slug || index.toString();

                if (!rotateAnim[authorKey]) {
                  rotateAnim[authorKey] = new Animated.Value(0);
                }

                return (
                  <View key={authorKey} style={[styles.authorCard, {
                    backgroundColor: colors.card,
                    shadowColor: isDark ? '#000' : '#000',
                  }]}>
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
                        <Text style={[styles.authorTitle, { color: colors.text }]}>
                          {author.name}
                        </Text>
                        <Text style={[styles.authorRole, { color: colors.primary }]}>
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

                    <Text
                      style={[styles.bio, { color: colors.textSecondary }]}
                      numberOfLines={expandedAuthors[authorKey] ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      {author.description ||
                        `${author.name} is a contributor at Lex Witness.`}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.readMoreBtn}
                      onPress={() => toggleAuthor(authorKey)}
                    >
                      <Text style={[styles.readMoreText, { color: colors.primary }]}>
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
                        <Icon name="chevron-down" size={16} color={colors.textMuted} />
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
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Related Stories
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: colors.border }]} />
              </View>

              {related.map((post: any) => (
                <TouchableOpacity
                  key={post.id}
                  style={[styles.relatedCard, {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }]}
                  onPress={() => handleRelatedPress(post)}
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
                    <Text numberOfLines={2} style={[styles.relatedTitle, { color: colors.text }]}>
                      {post.title}
                    </Text>
                    <View style={styles.relatedMeta}>
                      <Icon name="person-outline" size={12} color={colors.primary} />
                      <Text style={[styles.relatedAuthor, { color: colors.primary }]}>
                        {typeof post.author === 'string'
                          ? post.author
                          : post.author?.name || 'Lex Witness Bureau'}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color={colors.textMuted}
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
    fontSize: 15,
    lineHeight: 24,
  },
  p: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 18,
    textAlign: 'justify',
  },
  h1: {
    fontSize: 25,
    lineHeight: 35,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 18,
  },
  h2: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
  h3: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 14,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 12,
  },
  h5: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
  },
  h6: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
  },
  strong: {
    fontWeight: '700',
  },
  b: {
    fontWeight: '700',
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
    marginBottom: 8,
  },
  blockquote: {
    borderLeftWidth: 4,
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
    marginVertical: 20,
  },
  th: {
    padding: 10,
    borderWidth: 1,
    fontWeight: '700',
  },
  td: {
    padding: 10,
    borderWidth: 1,
  },
  tr: {
    borderBottomWidth: 1,
  },
  code: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 14,
  },
  pre: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 20,
  },
  hr: {
    borderBottomWidth: 1,
    marginVertical: 24,
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollWrap: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    marginTop: 12,
    fontSize: 16,
  },
  heroContainer: {
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
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
    fontWeight: '600',
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
  },
  contentCard: {
    marginTop: 16,
    paddingTop: 20,
  },
  articleBody: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  previewContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 28,
  },
  lockBox: {
    marginTop: 8,
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  lockSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  subscribeBtn: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    gap: 8,
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
    letterSpacing: -0.3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  authorSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  authorCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
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
    backgroundColor: '#DA2127',
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
    fontSize: 13,
    fontWeight: '600',
    color:"#b0b0b0"
  },
  authorTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  authorRole: {
    fontSize: 13,
    marginTop: 5,
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    lineHeight: 24,
    marginTop: 16,
  },
  relatedSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  relatedCard: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
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
    marginBottom: 6,
    lineHeight: 20,
  },
  relatedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedAuthor: {
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
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});