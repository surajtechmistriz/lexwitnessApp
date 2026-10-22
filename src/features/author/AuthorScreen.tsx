import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';
import Banner from '../../components/common/DynamicBanner';

import { getPosts } from '../../services/article.service';

import { useTheme } from '../../store/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import TopMenu from '../../components/layout/Menubar';
import { getAuthorBySlug } from '../../services/author.service';
import { getYears } from '../../services/magazine.service';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Author() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();
  const { isTablet, isSmallDevice, spacing } = useResponsive();

  const slug = route.params?.slug || '';
  const postBaseUrl = Config.POSTS_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [author, setAuthor] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const isAndroid = Platform.OS === 'android';

  /* ---------------- FETCH POSTS ---------------- */

  const fetchAuthorPosts = useCallback(
    async (authorId: number, year: number | null, page: number) => {
      setLoading(true);
      try {
        const response = await getPosts({
          author_id: authorId,
          year: year ?? undefined,
          page,
          per_page: 10,
        });

        setPosts(response.data ?? []);
        setLastPage(response.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (err) {
        console.error('Fetch posts error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [authorRes, yearRes] = await Promise.all([
          getAuthorBySlug(slug),
          getYears(),
        ]);

        if (!alive) return;

        const authorData = authorRes?.data || authorRes;
        setAuthor(authorData);

        const yearList = yearRes?.data?.data || yearRes?.data || yearRes || [];
        setYears(yearList);

        if (authorData?.id) {
          await fetchAuthorPosts(authorData.id, null, 1);
        }
      } catch (err) {
        console.error('Initial Load Error:', err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    init();
    return () => {
      alive = false;
    };
  }, [slug, fetchAuthorPosts]);

  /* ---------------- REFETCH ON YEAR CHANGE ---------------- */

  useEffect(() => {
    if (author?.id) {
      fetchAuthorPosts(author.id, appliedYear, 1);
    }
  }, [appliedYear, author?.id, fetchAuthorPosts]);

  /* ---------------- HANDLERS ---------------- */

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (author?.id) {
      fetchAuthorPosts(author.id, appliedYear, currentPage);
    }
  }, [author?.id, appliedYear, currentPage, fetchAuthorPosts]);

  /**
   * Called by Banner's `onFilterApply` when the user taps Apply.
   * Banner handles modal close internally.
   */
  const handleFilterApply = useCallback(
    (filters: { [key: string]: any }) => {
      const year = (filters?.year as number | null | undefined) ?? null;
      setAppliedYear(year);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    },
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      if (author?.id) {
        fetchAuthorPosts(author.id, appliedYear, page);
      }
    },
    [author?.id, appliedYear, fetchAuthorPosts],
  );

  const getAuthorTitle = useCallback(() => {
    if (author?.name) return author.name;
    return (
      slug
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Author'
    );
  }, [author?.name, slug]);

  /* ---------------- LAYOUT VALUES ---------------- */

  const contentPaddingTop = isAndroid
    ? isSmallDevice
      ? 6
      : isTablet
      ? 16
      : 10
    : isTablet
    ? 16
    : 10;
  const minHeight = isAndroid ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.6;
  const skeletonCount = isTablet ? 5 : isSmallDevice ? 3 : 4;

  /* ---------------- RENDER ---------------- */

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#c9060a"
        translucent={false}
      />

      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: '#c9060a' }]}
        edges={['top']}
      />

      {/* Banner owns the filter modal */}
      <Banner
        title={getAuthorTitle()}
        showBackButton
        onBackPress={handleBack}
        showFilter
        initialFilters={appliedYear ? { year: appliedYear } : {}}
        onFilterApply={handleFilterApply}
        renderFilter={(close, onApply) => (
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onSelect={(year) => setSelectedYear(year)}
            onApply={() => {
              onApply({ year: selectedYear });
              close();
            }}
            inModal
          />
        )}
      />

      <TopMenu activeSlug={slug} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isAndroid ? spacing.lg : spacing.md,
            paddingTop: isAndroid ? spacing.xs : 0,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={isDark ? colors.card : colors.background}
          />
        }
      >
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.background,
              paddingTop: contentPaddingTop,
              minHeight,
            },
          ]}
        >
          {loading && !refreshing ? (
            <View
              style={[
                styles.skeletonWrapper,
                { marginTop: isAndroid ? spacing.xs : spacing.sm },
              ]}
            >
              {[...Array(skeletonCount)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </View>
          ) : (
            <PostList
              posts={posts}
              loading={false}
              postBaseUrl={postBaseUrl}
              emptyMessage={
                appliedYear
                  ? `No posts by ${
                      author?.name || 'this author'
                    } for ${appliedYear}`
                  : 'No posts available'
              }
            />
          )}

          {!loading && posts.length > 0 && (
            <View
              style={[
                styles.paginationWrapper,
                {
                  paddingVertical: isAndroid ? spacing.md : spacing.lg,
                  paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                  marginTop: isAndroid ? spacing.xs : 0,
                },
              ]}
            >
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 0 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1 },
  skeletonWrapper: {},
  paginationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});