import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

// API Services
import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';
import { getCategoryBySlug } from '../../services/api/category';

// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import TopMenu from '../../components/common/Menubar';
import Header from '../../components/common/Header';
import Banner from '../../components/common/DynamicBanner';
import Footer from '../../components/common/Footer';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CategoryScreen() {
  const route = useRoute<any>();
  const scrollRef = useRef<ScrollView>(null);
  const isInitialMount = useRef(true);

  const slug = route.params?.slug || '';
  const postBaseUrl = Config.POSTS_BASE_URL;

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // --- Data Fetcher ---
  const fetchData = useCallback(
    async (catId: number, year: number | null, page: number) => {
      setLoading(true);
      try {
        const response = await getPosts({
          category_id: catId,
          year: year ?? undefined,
          page,
          per_page: 10,
        });
        setPosts(response.data ?? []);
        setLastPage(response.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [catData, yearData] = await Promise.all([
          getCategoryBySlug(slug),
          getYears(),
        ]);
        setCategory(catData);
        setYears(yearData.data || []);
        if (catData?.id) await fetchData(catData.id, null, 1);
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug, fetchData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (category?.id) fetchData(category.id, appliedYear, 1);
  }, [appliedYear, category?.id, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    if (category?.id) fetchData(category.id, appliedYear, currentPage);
  };

  const handleApplyFilter = () => {
    if (selectedYear !== appliedYear) {
      setAppliedYear(selectedYear);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePageChange = (page: number) => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    if (category?.id) fetchData(category.id, appliedYear, page);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <TopMenu />
      <Banner title={slug?.replace(/-/g, ' ') || 'Category'} />

      {/* FIXED CONTAINER: High zIndex and nestedScrollEnabled */}
      {/* <View style={styles.filterContainer}> */}
      <View style={styles.filterButton} pointerEvents="box-none">
        <YearFilter
          years={years}
          selectedYear={selectedYear}
          onSelect={setSelectedYear}
          onApply={handleApplyFilter}
        />
        {/* </View> */}
      </View>

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
        keyboardShouldPersistTaps="always" // 🔥 change this
        nestedScrollEnabled={true} // 🔥 important
      >
        <View style={styles.content}>
          <PostList
            posts={posts}
            loading={loading && !refreshing}
            postBaseUrl={postBaseUrl}
            emptyMessage={
              appliedYear ? `No posts for ${appliedYear}` : 'No posts available'
            }
            renderCategory={post => post.category?.name || 'Uncategorized'}
          />

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
          <View style={styles.magazine}>
            <LatestEditionImageOnly />
          </View>
          <View style={styles.BannerContainer}>
            <HomeBanner />
          </View>
          <View style={styles.adContainer}>
            <HomeAdvertisement />
          </View>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  // This matches the logic of your Magazine screen's content area
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1000, // Keeps dropdown above the ScrollView
    elevation: Platform.OS === 'android' ? 10 : 0,
    overflow: 'visible',
  },
  filterButton: {
    marginHorizontal: 15,
    paddingVertical: 10,
    overflow: 'visible',
  },
  content: {
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: SCREEN_HEIGHT * 0.5,
    zIndex: 1, // Ensures content stays below the dropdown
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
  magazine: { marginBottom: 20 },
});
