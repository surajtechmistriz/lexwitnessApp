import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';

// API Services
import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';
// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';
import Banner from '../../components/common/DynamicBanner';
import TopMenu from '../../components/common/Menubar';
import { getAuthorBySlug } from './api/authorarticle';

import { useTheme } from '../../redux/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Author() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();
  const { 
    isTablet, 
    isSmallDevice, 
    spacing, 
    font, 
    sizes, 
    moderateScale,
    wp,
    hp,
    pixelRatio 
  } = useResponsive();

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
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const isAndroid = Platform.OS === 'android';

  const handleBack = () => {
    navigation.goBack();
  };

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

  useEffect(() => {
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
        setLoading(false);
      }
    };

    init();
  }, [slug, fetchAuthorPosts]);

  useEffect(() => {
    if (author?.id) {
      fetchAuthorPosts(author.id, appliedYear, 1);
    }
  }, [appliedYear, author?.id, fetchAuthorPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    if (author?.id) {
      fetchAuthorPosts(author.id, appliedYear, currentPage);
    }
  };

  const handleApplyFilter = () => {
    setAppliedYear(selectedYear);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setIsFilterVisible(false);
  };

  const handlePageChange = (page: number) => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    if (author?.id) {
      fetchAuthorPosts(author.id, appliedYear, page);
    }
  };

  const getAuthorTitle = () => {
    if (author?.name) return author.name;
    return slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const contentPaddingTop = isAndroid ? (isSmallDevice ? 6 : isTablet ? 16 : 10) : (isTablet ? 16 : 10);
  const minHeight = isAndroid ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.6;
  const skeletonCount = isTablet ? 5 : isSmallDevice ? 3 : 4;

  // Handle filter toggle
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Status Bar */}
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

      {/* Banner with Back Button */}
      <Banner
        title={getAuthorTitle()}
        showBackButton={true}
        onBackPress={handleBack}
        showFilter={true}
        onFilterPress={toggleFilter}
        renderFilter={close => (
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
            onApply={() => {
              handleApplyFilter();
              close();
            }}
          />
        )}
      />

      {/* Filter Modal - Direct render when visible */}
      {isFilterVisible && (
        <View style={styles.filterModalOverlay}>
          <View style={[styles.filterModalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.filterModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>
                Filter by Year
              </Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <YearFilter
              years={years}
              selectedYear={selectedYear}
              onSelect={setSelectedYear}
              onApply={() => {
                handleApplyFilter();
              }}
              inModal={true}
            />
          </View>
        </View>
      )}

      {/* Top Menu */}
      <TopMenu activeSlug={slug} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingBottom: isAndroid ? spacing.lg : spacing.md,
            paddingTop: isAndroid ? spacing.xs : 0,
          }
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
        <View style={[
          styles.content, 
          { 
            backgroundColor: colors.background,
            paddingTop: contentPaddingTop,
            minHeight: minHeight,
          }
        ]}>
      

          {loading && !refreshing ? (
            <View style={[
              styles.skeletonWrapper,
              { marginTop: isAndroid ? spacing.xs : spacing.sm }
            ]}>
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
            <View style={[
              styles.paginationWrapper,
              {
                paddingVertical: isAndroid ? spacing.md : spacing.lg,
                paddingHorizontal: isAndroid ? spacing.md : spacing.lg,
                marginTop: isAndroid ? spacing.xs : 0,
              }
            ]}>
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  skeletonWrapper: {},
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
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  filterModalContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});