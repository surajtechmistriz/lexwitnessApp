import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
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
import Footer from '../../components/common/Footer';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';
import { getAuthorBySlug } from './api/authorarticle';

// Import MainLayout instead of individual components
import MainLayout from '../../MainLayout';
import { useTheme } from '../../redux/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Author() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();

  // SAFE PARAMS
  const slug = route.params?.slug || '';
  const postBaseUrl = Config.POSTS_BASE_URL;

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [author, setAuthor] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // BACK BUTTON HANDLER
  const handleBack = () => {
    navigation.goBack();
  };

  // --- FETCH POSTS ---
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

  // --- INITIAL LOAD ---
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

  // --- FILTER CHANGE ---
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

  return (
    <MainLayout
      title={getAuthorTitle()}
      routeName="Author"
      showBackButton={true}
      onBackPress={handleBack}
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
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {appliedYear && (
            <View style={[styles.activeFilterContainer, { 
              backgroundColor: colors.primaryBackground,
              borderLeftColor: colors.primary,
            }]}>
              <Text style={[styles.activeFilterText, { color: colors.text }]}>
                Showing posts from {appliedYear}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setSelectedYear(null);
                  setAppliedYear(null);
                }}
              >
                <Icon name="close-circle" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {loading && !refreshing ? (
            <View style={styles.skeletonWrapper}>
              {[1, 2, 3, 4, 5].map(item => (
                <ArticleSkeleton key={item} />
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
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <View style={styles.BannerContainer}>
            <HomeBanner />
          </View>

          <View style={[styles.adContainer, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}>
            <HomeAdvertisement />
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  content: {
    paddingTop: 10,
    minHeight: SCREEN_HEIGHT * 0.6,
  },

  skeletonWrapper: {
    marginTop: 10,
  },

  footerContainer: {
    width: '100%',
    paddingBottom: 20,
  },

  BannerContainer: {
    marginHorizontal: 15,
  },

  adContainer: {
    height: 300,
    marginVertical: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },

  magazine: {
    marginBottom: 20,
    marginHorizontal: 15,
  },

  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  activeFilterText: {
    fontSize: 14,
  },
});