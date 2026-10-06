import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBack from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { getSingleMagazine } from './api/magazine';
import Config from 'react-native-config';
import MainLayout from '../../MainLayout';
import { useTheme } from '../../store/hooks/useTheme';

const imgUrl = Config.MAGAZINES_BASE_URL;
const imgUrl2 = Config.POSTS_BASE_URL;

export default function MagazineDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const { slug } = route.params || {};
  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Breakpoints / Responsive Adjustments
  const isTablet = width >= 768;
  const contentWidthMax = isTablet ? 650 : width;
  const heroHeight = isTablet ? 400 : width * 0.75;

  const statusBarColor = '#c9060a';
  const statusBarStyle = 'light-content';

  const fetchMagazine = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSingleMagazine(slug);
      setMagazine(data);
    } catch (err) {
      console.error('Detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchMagazine();
    }
  }, [slug, fetchMagazine]);

  const getImage = (img: string, base: string) => {
    if (!img) return 'https://via.placeholder.com/300x200';
    return img.startsWith('http') ? img : `${base}/${img}`;
  };

  if (loading) {
    return (
      <MainLayout
        title="Magazine Detail"
        routeName="MagazineDetail"
        statusBarColor={statusBarColor}
        statusBarStyle={statusBarStyle}
        showBackButton
        onBackPress={() => navigation.goBack()}
      >
        <View style={[styles.loader, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </MainLayout>
    );
  }

  if (!magazine) {
    return (
      <MainLayout
        title="Magazine Detail"
        routeName="MagazineDetail"
        statusBarColor={statusBarColor}
        statusBarStyle={statusBarStyle}
        showBackButton
        onBackPress={() => navigation.goBack()}
      >
        <View style={[styles.loader, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.textSecondary }}>No Data</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={magazine.title || 'Magazine Detail'}
      routeName="MagazineDetail"
      statusBarColor={statusBarColor}
      statusBarStyle={statusBarStyle}
      showBackButton
      onBackPress={() => navigation.goBack()}
    >
      <ScrollView
        contentContainerStyle={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={[styles.heroContainer, { backgroundColor: colors.card }]}>
          {magazine.image && (
            <View style={[styles.imageWrapper, { height: heroHeight }]}>
              <Image
                source={{ uri: getImage(magazine.image, imgUrl) }}
                style={styles.heroImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={['transparent', 'rgba(51,51,51,0.4)']}
                style={styles.imageGradient}
              />

              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  styles.backBtn,
                  {
                    backgroundColor: colors.card,
                    top: 5,
                  },
                ]}
              >
                <IconBack name="arrow-left" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Centered container wrapper for tablet readability */}
          <View
            style={[
              styles.responsiveContentBlock,
              { maxWidth: contentWidthMax },
            ]}
          >
            {/* Magazine Info Row */}
            <View style={styles.topRow}>
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.text, fontSize: isTablet ? 20 : 16 },
                ]}
              >
                {magazine.magazine_name?.toUpperCase() || 'MAGAZINE'}
              </Text>
            </View>

            {/* Title */}
            <View style={styles.titleRow}>
              <Icon
                name="calendar-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text
                style={[
                  styles.magazineTitle,
                  { color: colors.text, fontSize: isTablet ? 27 : 13 },
                ]}
              >
                {magazine.title}
              </Text>
            </View>

            {/* Meta Info */}
            <View style={styles.metaRow}>
              <Text
                style={[
                  styles.dateText,
                  { color: colors.primary, fontSize: isTablet ? 17 : 15 },
                ]}
              >
                Magazine Details
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
          ]}
        >
          <View
            style={[
              styles.responsiveContentBlock,
              { maxWidth: contentWidthMax },
            ]}
          >
            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text
                style={[
                  styles.description,
                  { color: colors.textSecondary, fontSize: isTablet ? 15 : 13 },
                ]}
              >
                {magazine.description
                  ?.replace(/<[^>]+>/g, '')
                  .replace(/&amp;/g, '&')}
              </Text>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
              onPress={() => navigation.navigate('Subscription')}
              activeOpacity={0.9}
            >
              <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
              <Icon name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            {/* Articles Section */}
            {magazine.posts?.length > 0 && (
              <View style={styles.articlesSection}>
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.text, fontSize: isTablet ? 20 : 18 },
                    ]}
                  >
                    Articles
                  </Text>
                  <View
                    style={[
                      styles.sectionLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                </View>

                <View style={isTablet ? styles.tabletGrid : null}>
                  {magazine.posts.map((post: any) => (
                    <TouchableOpacity
                      key={post.id}
                      style={[
                        styles.articleCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                        isTablet && styles.articleCardTablet,
                      ]}
                      onPress={() =>
                        navigation.navigate('ArticleDetail', {
                          slug: post.slug,
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: getImage(post.image, imgUrl2) }}
                        style={styles.articleImage}
                        resizeMode="cover"
                      />
                      <View style={styles.articleText}>
                        <Text
                          numberOfLines={2}
                          style={[styles.articleTitle, { color: colors.text }]}
                        >
                          {post.title}
                        </Text>
                        <View style={styles.articleMeta}>
                          <Icon
                            name="pricetag-outline"
                            size={12}
                            color={colors.primary}
                          />
                          <Text
                            style={[
                              styles.articleCategory,
                              { color: colors.primary },
                            ]}
                          >
                            {post.category?.name || 'General'}
                          </Text>
                        </View>
                      </View>
                      <Icon
                        name="chevron-forward"
                        size={20}
                        color={colors.textMuted}
                        style={styles.articleArrow}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollWrap: {},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responsiveContentBlock: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  heroContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  categoryText: {
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  magazineTitle: {
    flex: 1,
    fontWeight: '500',
    lineHeight: 28,
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontWeight: '600',
  },
  contentCard: {
    marginTop: -14,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    lineHeight: 24,
    opacity: 0.9,
  },
  subscribeBtn: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  subscribeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.8,
  },
  articlesSection: {
    marginTop: 8,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    marginLeft: 12,
  },
  tabletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    width: '100%',
  },
  articleCardTablet: {
    width: '49%',
  },
  articleImage: {
    width: 80,
    height: 80,
  },
  articleText: {
    flex: 1,
    padding: 12,
  },
  articleTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleCategory: {
    fontSize: 11,
    fontWeight: '500',
  },
  articleArrow: {
    marginRight: 12,
  },
});