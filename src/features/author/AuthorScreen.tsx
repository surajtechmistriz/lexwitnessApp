import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

// API Services
import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';
// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import Footer from '../../components/common/Footer';
import Banner from '../../components/common/DynamicBanner';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton'; // IMPORT SKELETON
import { getAuthorBySlug } from './api/authorarticle';
import { useTabBar } from '../../BotttomTabs/TabBarContext';
import TopMenu from '../../components/common/Menubar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AuthorScreen() {

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

  const route = useRoute<any>();
  const scrollRef = useRef<ScrollView>(null);

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
      if (!slug) return;
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopMenu/>
      <Banner
        title={author?.name || slug?.replace(/-/g, ' ')}
        renderFilter={(close) => (
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

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#c9060a']}
          />
        }
           onScroll={handleScroll}
            scrollEventThrottle={16} 
      >
        <View style={styles.content}>
          {loading && !refreshing ? (
            /* --- SKELETON LOADING STATE --- */
            <View style={styles.skeletonWrapper}>
              {[1, 2, 3, 4, 5].map((item) => (
                <ArticleSkeleton key={item} />
              ))}
            </View>
          ) : (
            <PostList
              posts={posts}
              loading={false} // Disable internal loader
              postBaseUrl={postBaseUrl}
              emptyMessage={
                appliedYear
                  ? `No posts by ${author?.name || 'this author'} for ${appliedYear}`
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

        <View style={styles.footerContainer}>
          <View style={styles.magazine}><LatestEditionImageOnly /></View>
          <View style={styles.BannerContainer}><HomeBanner /></View>
          <View style={styles.adContainer}><HomeAdvertisement /></View>
          {/* <Footer /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { 
    paddingTop: 10, 
    paddingBottom: 20, 
    minHeight: SCREEN_HEIGHT * 0.6 // Increased for stability
  },
  skeletonWrapper: {
    marginTop: 10,
  },
  footerContainer: { marginTop: 'auto', width: '100%' },
  BannerContainer: { marginHorizontal: 15 },
  adContainer: {
    height: 300,
    backgroundColor: '#fff',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#dddbdb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  magazine: { marginBottom: 20, marginHorizontal: 15 },
});