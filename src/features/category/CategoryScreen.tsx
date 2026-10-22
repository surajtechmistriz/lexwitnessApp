import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';

import Banner from '../../components/common/DynamicBanner';
import { useTheme } from '../../store/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { getCategoryBySlug } from '../../services/category.service';
import { getPosts } from '../../services/article.service';
import TopMenu from '../../components/layout/Menubar';
import { getYears } from '../../services/magazine.service';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Category() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();
  const { isTablet, isSmallDevice, spacing } = useResponsive();

  const slug = route.params?.slug ?? '';
  const postBaseUrl = Config.POSTS_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Android detection
  const isAndroid = Platform.OS === 'android';

  const handleBack = () => {
    navigation.goBack();
  };

  const fetchData = useCallback(
    async (catId: number, year: number | null, page: number) => {
      setLoading(true);
      try {
        const res = await getPosts({
          category_id: catId,
          year: year ?? undefined,
          page,
          per_page: 10,
        });

        setPosts(res?.data ?? []);
        setLastPage(res?.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const init = async () => {
      setSelectedYear(null);
      setAppliedYear(null);
      setCurrentPage(1);

      try {
        const [catData, yearData] = await Promise.all([
          getCategoryBySlug(slug),
          getYears(),
        ]);

        setCategory(catData);
        setYears(yearData?.data || []);

        if (catData?.id) {
          fetchData(catData.id, null, 1);
        }
      } catch (e) {
        console.error('Init error:', e);
      }
    };

    init();
  }, [slug, fetchData]);

  useEffect(() => {
    if (category?.id) {
      fetchData(category.id, appliedYear, 1);
    }
  }, [appliedYear, category?.id, fetchData]);

  const onRefresh = () => {
    if (!category?.id) return;
    setRefreshing(true);
    fetchData(category.id, appliedYear, currentPage);
  };

  const getCategoryTitle = () => {
    if (category?.name) return category.name;
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  // Responsive values
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
  const skeletonCount = isTablet ? 4 : isSmallDevice ? 2 : 3;

  return (
    <>
      {/* Status Bar - Separate from SafeAreaView */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      {/* SafeAreaView for notch handling */}
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: colors.primary,
          },
        ]}
        edges={['top']}
      />

      {/* Main Container */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* BANNER WITH BACK BUTTON INTEGRATED */}
        <Banner
          title={getCategoryTitle()}
          showBackButton={true}
          onBackPress={handleBack}
          renderFilter={close => (
            <YearFilter
              years={years}
              selectedYear={selectedYear}
              onSelect={setSelectedYear}
              onApply={() => {
                setAppliedYear(selectedYear);
                close();
              }}
            />
          )}
        />

        {/* TOP MENU */}
        <TopMenu activeSlug={slug} />

        <ScrollView
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={isDark ? colors.card : colors.background}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: isAndroid ? spacing.lg : spacing.md,
              paddingTop: isAndroid ? spacing.xs : 0,
            },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor: colors.background,
                paddingTop: contentPaddingTop,
                minHeight: minHeight,
              },
            ]}
          >
            {loading ? (
              <View>
                {[...Array(skeletonCount)].map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </View>
            ) : (
              <PostList
                posts={posts}
                postBaseUrl={postBaseUrl}
                emptyMessage={
                  appliedYear
                    ? `No posts for ${appliedYear}`
                    : 'No posts available'
                }
              />
            )}

            {!loading && posts.length > 0 && category?.id && (
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
                  onPageChange={page => {
                    fetchData(category.id, appliedYear, page);
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeFilterText: {
    fontWeight: '500',
  },
  paginationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
