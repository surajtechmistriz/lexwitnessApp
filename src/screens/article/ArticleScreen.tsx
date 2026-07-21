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
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useResponsive } from '../../hooks/useResponsive';

const postBaseUrl = Config.POSTS_BASE_URL;

type Route = RouteProp<{ ArticleDetail: { slug: string } }, 'ArticleDetail'>;

export default function ArticleDetailPage() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isTablet, isSmallDevice, spacing, font, sizes } = useResponsive();

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

  const isAndroid = Platform.OS === 'android';

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

  // Responsive values
  const heroHeight = isTablet ? width * 0.5 : width * 0.7;
  const titleSize = isTablet ? font.xxl : font.xl;
  const contentPadding = isTablet ? spacing.xl : spacing.lg;

  return (
    <>
      {/* Status Bar - Direct handling for consistency */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#c9060a"
        translucent={false}
      />

      {/* SafeAreaView for notch handling */}
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: '#c9060a' }]}
        edges={['top']}
      />

      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollWrap,
            // { paddingBottom: isAndroid ? spacing.xl : spacing.lg }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO SECTION */}
          <View style={[styles.heroContainer, { backgroundColor: colors.card }]}>
            {article.image && (
              <View
                style={[
                  styles.imageWrapper,
                  {
                    height: heroHeight,
                  },
                ]}
              >
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

                {/* BACK BUTTON - Fixed positioning using insets */}
                <TouchableOpacity
                  onPress={handleBack}
                  style={[
                    styles.backBtn,
                    {
                      backgroundColor: colors.card,
                      top: isAndroid ? insets.top + 10 : insets.top + 10,
                      left: isAndroid ? 15 : 15,
                      width: isAndroid ? 44 : 40,
                      height: isAndroid ? 44 : 40,
                      borderRadius: isAndroid ? 22 : 20,
                    }
                  ]}
                >
                  <IconBack
                    name="arrow-left"
                    size={isAndroid ? 24 : 22}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Category and Share Row */}
            <View style={[
              styles.topRow,
              {
                paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                marginTop: isAndroid ? spacing.sm : spacing.md,
                marginBottom: isAndroid ? spacing.xs : spacing.sm,
              }
            ]}>
              <TouchableOpacity
                onPress={() => handleCategoryPress(article.category)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.categoryPill,
                  {
                    backgroundColor: colors.primaryBackground,
                    paddingHorizontal: isAndroid ? spacing.sm : spacing.md,
                    paddingVertical: isAndroid ? spacing.xs : spacing.sm,
                    borderRadius: isAndroid ? 16 : 20,
                  }
                ]}>
                  <Text style={[
                    styles.categoryText,
                    {
                      color: colors.primary,
                      fontSize: isTablet ? font.sm : font.xs,
                    }
                  ]}>
                    {article.category?.name || 'UNCATEGORIZED'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={[
                  styles.shareButton,
                  {
                    backgroundColor: colors.background,
                    width: isAndroid ? 40 : 36,
                    height: isAndroid ? 40 : 36,
                    borderRadius: isAndroid ? 20 : 18,
                  }
                ]}
              >
                <Icon
                  name="share-social"
                  size={isAndroid ? 22 : 20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={[
              styles.title,
              {
                color: colors.text,
                fontSize: titleSize,
                paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                lineHeight: isTablet ? 38 : 30,
                marginBottom: isAndroid ? spacing.xs : spacing.sm,
              }
            ]}>
              {article.title}
            </Text>

            {/* Meta Info */}
            <View style={[
              styles.metaRow,
              {
                paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                gap: isAndroid ? spacing.xs : spacing.sm,
              }
            ]}>
              <View style={styles.authorsList}>
                <Icon
                  name="person-outline"
                  size={isAndroid ? 16 : 14}
                  color={colors.primary}
                />
                {article.authors?.map((author: any, index: number) => (
                  <TouchableOpacity
                    key={author.slug || index}
                    onPress={() => handleAuthorPress(author)}
                  >
                    <Text style={[
                      styles.authorName,
                      {
                        color: colors.primary,
                        fontSize: isTablet ? font.lg : font.md,
                      }
                    ]}>
                      {author?.name}
                      {index !== article.authors.length - 1 ? ', ' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.dateContainer}>
                <Icon
                  name="calendar-outline"
                  size={isAndroid ? 16 : 14}
                  color={colors.textMuted}
                />
                <Text style={[
                  styles.dateText,
                  {
                    color: colors.textMuted,
                    fontSize: isTablet ? font.sm : font.sm,
                  }
                ]}>
                  {article.magazine?.month?.name} {article.magazine?.year}
                </Text>
              </View>
            </View>
          </View>

          {/* CONTENT SECTION */}
          <View style={[
            styles.contentCard,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: isAndroid ? 20 : 24,
              borderTopRightRadius: isAndroid ? 20 : 24,
              paddingTop: isAndroid ? spacing.md : spacing.lg,
            }
          ]}>
            {/* Article Body */}
            <View style={[
              styles.articleBody,
              { paddingHorizontal: isAndroid ? spacing.md : spacing.lg }
            ]}>
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
                      contentWidth={width - (isAndroid ? 40 : 40)}
                      source={{ html: cleanedHtml }}
                      tagsStyles={{
                        ...tagsStyles,
                        p: {
                          ...tagsStyles.p,
                          fontSize: isTablet ? 16 : 15,
                          lineHeight: isTablet ? 28 : 22,
                        },
                      }}
                      baseStyle={{
                        color: colors.text,
                        fontSize: isTablet ? 16 : 14,
                        lineHeight: isTablet ? 28 : 24,
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
                  <View style={[
                    styles.previewContainer,
                    {
                      backgroundColor: colors.background,
                      borderRadius: isAndroid ? sizes.borderRadius : 16,
                      padding: isAndroid ? spacing.md : spacing.lg,
                      marginBottom: isAndroid ? spacing.md : spacing.lg,
                    }
                  ]}>
                    <Text style={[
                      styles.previewText,
                      {
                        color: colors.textSecondary,
                        fontSize: isTablet ? font.md : font.md,
                        lineHeight: isTablet ? 30 : 22,
                      }
                    ]}>
                      {previewText}...
                    </Text>
                  </View>

                  {/* Premium Lock Box */}
                  <View style={[
                    styles.lockBox,
                    {
                      backgroundColor: colors.primaryBackground,
                      borderColor: colors.border,
                      padding: isAndroid ? spacing.xl : spacing.xxl,
                      borderRadius: isAndroid ? 16 : 20,
                      borderWidth: isAndroid ? 0.5 : 1,
                      marginTop: isAndroid ? spacing.xs : spacing.sm,
                    }
                  ]}>
                    <View style={[
                      styles.lockIconContainer,
                      {
                        backgroundColor: colors.card,
                        shadowColor: colors.primary,
                        width: isAndroid ? 72 : 64,
                        height: isAndroid ? 72 : 64,
                        borderRadius: isAndroid ? 36 : 32,
                        marginBottom: isAndroid ? spacing.md : spacing.lg,
                        shadowOffset: { width: 0, height: isAndroid ? 4 : 2 },
                        shadowOpacity: isAndroid ? 0.15 : 0.1,
                        shadowRadius: isAndroid ? 12 : 8,
                        elevation: isAndroid ? 6 : 4,
                      }
                    ]}>
                      <Icon
                        name="lock-closed"
                        size={isAndroid ? 36 : 32}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={[
                      styles.lockTitle,
                      {
                        color: colors.text,
                        fontSize: isTablet ? font.xl : font.xl,
                        marginBottom: isAndroid ? spacing.xs : spacing.sm,
                      }
                    ]}>
                      Premium Content
                    </Text>
                    <Text style={[
                      styles.lockSubtext,
                      {
                        color: colors.textSecondary,
                        fontSize: isTablet ? font.lg : font.md,
                        marginBottom: isAndroid ? spacing.xl : spacing.xxl,
                        lineHeight: isTablet ? 26 : 22,
                        paddingHorizontal: isAndroid ? spacing.sm : spacing.md,
                      }
                    ]}>
                      Subscribe to unlock full access to this article and
                      thousands more
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.subscribeBtn,
                        {
                          backgroundColor: colors.primary,
                          shadowColor: colors.primary,
                          paddingHorizontal: isAndroid ? 36 : 32,
                          paddingVertical: isAndroid ? 16 : 14,
                          borderRadius: isAndroid ? 44 : 40,
                          gap: isAndroid ? spacing.xs : spacing.sm,
                          shadowOffset: { width: 0, height: isAndroid ? 6 : 4 },
                          shadowOpacity: isAndroid ? 0.35 : 0.3,
                          shadowRadius: isAndroid ? 12 : 8,
                          elevation: isAndroid ? 6 : 4,
                        }
                      ]}
                      onPress={handleSubscribe}
                      activeOpacity={0.9}
                    >
                      <Text style={[
                        styles.subscribeBtnText,
                        {
                          fontSize: isTablet ? font.md : font.md,
                        }
                      ]}>
                        Subscribe Now
                      </Text>
                      <Icon
                        name="arrow-forward"
                        size={isAndroid ? 20 : 18}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    <Text style={[
                      styles.lockFooter,
                      {
                        color: colors.textMuted,
                        marginTop: isAndroid ? spacing.lg : spacing.xl,
                        fontSize: isTablet ? font.sm : font.sm,
                      }
                    ]}>
                      Already have an account? Sign in
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Testimonials/Feedback */}
            {article.reader_feedbacks?.filter((i: any) => i.reader_feedback)
              .length > 0 && (
                <View style={[
                  styles.sectionBlock,
                  {
                    marginTop: isAndroid ? spacing.xl : spacing.xxl,
                    paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                  }
                ]}>
                  <View style={[
                    styles.sectionHeader,
                    { marginBottom: isAndroid ? spacing.sm : spacing.md }
                  ]}>
                    <Text style={[
                      styles.sectionTitle,
                      {
                        color: colors.text,
                        fontSize: isTablet ? font.xl : font.lg,
                      }
                    ]}>
                      Reader Feedback
                    </Text>
                    <View style={[
                      styles.sectionLine,
                      {
                        backgroundColor: colors.border,
                        height: isAndroid ? 0.5 : 1,
                        marginLeft: isAndroid ? spacing.sm : spacing.md,
                      }
                    ]} />
                  </View>
                  {article.reader_feedbacks
                    ?.filter((i: any) => i.reader_feedback)
                    .map((item: any, i: number) => (
                      <View key={item.id} style={{ marginBottom: isAndroid ? spacing.md : 16 }}>
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
              <View style={[
                styles.tagsSection,
                {
                  marginTop: isAndroid ? spacing.xl : spacing.xxl,
                  paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                }
              ]}>
                <View style={[
                  styles.sectionHeader,
                  { marginBottom: isAndroid ? spacing.sm : spacing.md }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: isTablet ? font.xl : font.lg,
                    }
                  ]}>
                    Topics
                  </Text>
                  <View style={[
                    styles.sectionLine,
                    {
                      backgroundColor: colors.border,
                      height: isAndroid ? 0.5 : 1,
                      marginLeft: isAndroid ? spacing.sm : spacing.md,
                    }
                  ]} />
                </View>
                <View style={[
                  styles.tagsWrap,
                  { gap: isAndroid ? spacing.xs : spacing.sm }
                ]}>
                  {article.tags.map((tag: any, index: number) => (
                    <TouchableOpacity
                      key={tag.id || index}
                      style={[
                        styles.tagPill,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          paddingHorizontal: isAndroid ? spacing.sm : spacing.md,
                          paddingVertical: isAndroid ? spacing.xs : spacing.sm,
                          borderRadius: isAndroid ? 20 : 24,
                          borderWidth: isAndroid ? 0.5 : 1,
                        }
                      ]}
                      onPress={() => handleTagPress(tag)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.tagText,
                        {
                          color: colors.primary,
                          fontSize: isTablet ? font.sm : font.xs,
                        }
                      ]}>
                        #{tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Authors Section */}
            {article.authors?.length > 0 && (
              <View style={[
                styles.authorSection,
                {
                  marginTop: isAndroid ? spacing.xl : spacing.xxl,
                  paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                }
              ]}>
                <View style={[
                  styles.sectionHeader,
                  { marginBottom: isAndroid ? spacing.sm : spacing.md }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: isTablet ? font.xl : font.lg,
                    }
                  ]}>
                    About {article.authors.length > 1 ? 'Authors' : 'Author'}
                  </Text>
                  <View style={[
                    styles.sectionLine,
                    {
                      backgroundColor: colors.border,
                      height: isAndroid ? 0.5 : 1,
                      marginLeft: isAndroid ? spacing.sm : spacing.md,
                    }
                  ]} />
                </View>

                {article.authors.map((author: any, index: number) => {
                  const authorKey = author.id || author.slug || index.toString();

                  if (!rotateAnim[authorKey]) {
                    rotateAnim[authorKey] = new Animated.Value(0);
                  }

                  return (
                    <View key={authorKey} style={[
                      styles.authorCard,
                      {
                        backgroundColor: colors.card,
                        shadowColor: isDark ? '#000' : '#000',
                        borderRadius: isAndroid ? 16 : 18,
                        padding: isAndroid ? spacing.md : 16,
                        marginBottom: isAndroid ? spacing.md : 18,
                        shadowOffset: { width: 0, height: isAndroid ? 2 : 4 },
                        shadowOpacity: isAndroid ? 0.08 : 0.06,
                        shadowRadius: isAndroid ? 6 : 10,
                        elevation: isAndroid ? 4 : 3,
                      }
                    ]}>
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
                          style={[
                            styles.avatar,
                            {
                              width: isAndroid ? 68 : 72,
                              height: isAndroid ? 68 : 72,
                              borderRadius: isAndroid ? 34 : 36,
                            }
                          ]}
                        />

                        <View style={[
                          styles.authorMeta,
                          { marginLeft: isAndroid ? spacing.sm : spacing.md }
                        ]}>
                          <Text style={[
                            styles.authorTitle,
                            {
                              color: colors.text,
                              fontSize: isTablet ? font.xl : font.lg,
                            }
                          ]}>
                            {author.name}
                          </Text>
                          <Text style={[
                            styles.authorRole,
                            {
                              color: colors.primary,
                              fontSize: isTablet ? font.md : font.sm,
                              marginTop: isAndroid ? 2 : 5,
                            }
                          ]}>
                            {author.email || 'Contributor'}
                          </Text>

                          {author.linkedin ? (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              style={[
                                styles.linkedinRow,
                                { marginTop: isAndroid ? 4 : 8 }
                              ]}
                              onPress={() => Linking.openURL(author.linkedin)}
                            >
                              <LinkedinIcon
                                name="linkedin-square"
                                size={isAndroid ? 20 : 18}
                                color="#0A66C2"
                              />
                              <Text style={[
                                styles.linkedinText,
                                {
                                  fontSize: isTablet ? font.sm : font.xs,
                                  marginLeft: isAndroid ? spacing.xs : 6,
                                }
                              ]}>
                                LinkedIn
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.bio,
                          {
                            color: colors.textSecondary,
                            fontSize: isTablet ? font.lg : font.md,
                            lineHeight: isTablet ? 26 : 24,
                            marginTop: isAndroid ? spacing.sm : 16,
                          }
                        ]}
                        numberOfLines={expandedAuthors[authorKey] ? undefined : 2}
                        ellipsizeMode="tail"
                      >
                        {author.description ||
                          `${author.name} is a contributor at Lex Witness.`}
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.readMoreBtn,
                          {
                            paddingVertical: isAndroid ? 2 : 4,
                            marginTop: isAndroid ? 2 : 6,
                          }
                        ]}
                        onPress={() => toggleAuthor(authorKey)}
                      >
                        <Text style={[
                          styles.readMoreText,
                          {
                            color: colors.primary,
                            fontSize: isTablet ? font.lg : font.sm,
                          }
                        ]}>
                          {expandedAuthors[authorKey] ? 'Show less' : 'View more'}
                        </Text>

                        <Animated.View
                          style={{
                            marginLeft: isAndroid ? 2 : 4,
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
                          <Icon
                            name="chevron-down"
                            size={isAndroid ? 18 : 16}
                            color={colors.textMuted}
                          />
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Related Stories */}
            {related.length > 0 && (
              <View style={[
                styles.relatedSection,
                {
                  marginTop: isAndroid ? spacing.xl : spacing.xxl,
                  paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                  marginBottom: isAndroid ? spacing.md : spacing.lg,
                }
              ]}>
                <View style={[
                  styles.sectionHeader,
                  { marginBottom: isAndroid ? spacing.sm : spacing.md }
                ]}>
                  <Text style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: isTablet ? font.xl : font.lg,
                    }
                  ]}>
                    Related Stories
                  </Text>
                  <View style={[
                    styles.sectionLine,
                    {
                      backgroundColor: colors.border,
                      height: isAndroid ? 0.5 : 1,
                      marginLeft: isAndroid ? spacing.sm : spacing.md,
                    }
                  ]} />
                </View>

                {related.map((post: any) => (
                  <TouchableOpacity
                    key={post.id}
                    style={[
                      styles.relatedCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderRadius: isAndroid ? 14 : 16,
                        borderWidth: isAndroid ? 0.5 : 1,
                        marginBottom: isAndroid ? spacing.xs : spacing.sm,
                      }
                    ]}
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
                      style={[
                        styles.relatedImage,
                        {
                          width: isAndroid ? 72 : 80,
                          height: isAndroid ? 72 : 80,
                        }
                      ]}
                      resizeMode="cover"
                      onError={e => {
                        e.currentTarget.setNativeProps({
                          source: require('../../assets/image.png'),
                        });
                      }}
                    />
                    <View style={[
                      styles.relatedText,
                      { padding: isAndroid ? spacing.xs : spacing.sm }
                    ]}>
                      <Text numberOfLines={2} style={[
                        styles.relatedTitle,
                        {
                          color: colors.text,
                          fontSize: isTablet ? font.lg : font.md,
                          lineHeight: isTablet ? 22 : 20,
                          marginBottom: isAndroid ? 2 : 6,
                        }
                      ]}>
                        {post.title}
                      </Text>
                      <View style={[
                        styles.relatedMeta,
                        { gap: isAndroid ? 2 : 4 }
                      ]}>
                        <Icon
                          name="person-outline"
                          size={isAndroid ? 14 : 12}
                          color={colors.primary}
                        />
                        <Text
                          style={[
                            styles.relatedAuthor,
                            {
                              color: colors.primary,
                              fontSize: isTablet ? font.lg : font.sm,
                            },
                          ]}
                        >
                          {post.authors?.length > 0
                            ? post.authors[0].name
                            : 'Lex Witness Bureau'}
                        </Text>
                      </View>
                    </View>
                    <Icon
                      name="chevron-forward"
                      size={isAndroid ? 22 : 20}
                      color={colors.textMuted}
                      style={[
                        styles.relatedArrow,
                        { marginRight: isAndroid ? spacing.sm : spacing.md }
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
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
  safeArea: {
    flex: 0,
  },
  screen: {
    flex: 1,
  },
  scrollWrap: {
    flexGrow: 1,
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
  },
  categoryPill: {},
  categoryText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shareButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    textAlign: 'justify',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  authorsList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: 2
  },
  authorName: {
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontWeight: '500',
  },
  contentCard: {
    marginTop: 16,
  },
  articleBody: {},
  previewContainer: {},
  previewText: {
    fontWeight: '400',
  },
  lockBox: {
    alignItems: 'center',
  },
  lockIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockTitle: {
    fontWeight: '800',
  },
  lockSubtext: {
    textAlign: 'center',
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  lockFooter: {
    fontWeight: '500',
  },
  sectionBlock: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionLine: {
    flex: 1,
  },
  tagsSection: {},
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {},
  tagText: {
    fontWeight: '600',
  },
  authorSection: {},
  authorCard: {},
  authorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#c9060a',
  },
  authorMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  linkedinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkedinText: {
    fontWeight: '600',
  },
  authorTitle: {
    fontWeight: '700',
  },
  authorRole: {
    fontWeight: '600',
  },
  bio: {
    fontWeight: '400',
  },
  relatedSection: {},
  relatedCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  relatedImage: {
    resizeMode: 'cover',
  },
  relatedText: {
    flex: 1,
  },
  relatedTitle: {
    fontWeight: '600',
  },
  relatedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedAuthor: {
    fontWeight: '500',
  },
  relatedArrow: {},
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  backBtn: {
    position: 'absolute',
    left: 15,
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