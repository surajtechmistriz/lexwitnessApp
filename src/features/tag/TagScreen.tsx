import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

// API
import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';

// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import Banner from '../../components/common/DynamicBanner';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';
import { useTheme } from '../../redux/hooks/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TagScreen() {
  const { colors, isDark } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

  const tagId = route.params?.id || null;
  const slug = route.params?.slug || '';

  const tagTitle = slug?.replace(/-/g, ' ') || 'Tag';

  const postBaseUrl = Config.POSTS_BASE_URL;

  /* ---------------- STATE ---------------- */

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [appliedYear, setAppliedYear] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  /* ---------------- BACK BUTTON HANDLER ---------------- */
  const handleBack = () => {
    navigation.goBack();
  };

  /* ---------------- FETCH POSTS ---------------- */

  const fetchTagPosts = useCallback(
    async (page: number = 1, year: number | null = null) => {
      if (!tagId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await getPosts({
          tag_id: tagId,
          year: year ?? undefined,
          page,
          per_page: 10,
        });

        setPosts(response?.data ?? []);
        setLastPage(response?.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (error) {
        console.log('Fetch tag posts error:', error);
        setPosts([]);
        setLastPage(1);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [tagId],
  );

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    const init = async () => {
      if (!tagId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const yearRes = await getYears();
        const yearList = yearRes?.data?.data || yearRes?.data || yearRes || [];
        setYears(yearList);
        await fetchTagPosts(1, null);
      } catch (error) {
        console.log('Initial load error:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [tagId, fetchTagPosts]);

  /* ---------------- FILTER CHANGE ---------------- */

  useEffect(() => {
    if (tagId) {
      fetchTagPosts(1, appliedYear);
    }
  }, [appliedYear, tagId, fetchTagPosts]);

  /* ---------------- REFRESH ---------------- */

  const onRefresh = () => {
    setRefreshing(true);
    fetchTagPosts(currentPage, appliedYear);
  };

  /* ---------------- APPLY FILTER ---------------- */

  const handleApplyFilter = () => {
    setAppliedYear(selectedYear);
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  /* ---------------- PAGINATION ---------------- */

  const handlePageChange = (page: number) => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
    fetchTagPosts(page, appliedYear);
  };

  return (
       <>
           <StatusBar
             translucent={false}
             backgroundColor={colors.primary}
             barStyle="light-content"
           />
         <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
             <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        stickyHeaderIndices={[0]} // Changed from [1] to [0] since Banner is now first
        showsVerticalScrollIndicator={false}
      >
        {/* BANNER WITH BACK BUTTON */}
        <Banner
          title={tagTitle}
          showBackButton={true}  // Enable back button
          onBackPress={handleBack}  // Handle back navigation
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

        {/* CONTENT */}
        <View style={styles.content}>
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
              fallbackAuthorName={tagTitle}
              emptyMessage={
                appliedYear
                  ? `No posts found for ${tagTitle} in ${appliedYear}`
                  : `No posts found for ${tagTitle}`
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


      </ScrollView>
      </View>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    // paddingTop: 10,
    // paddingBottom: 20,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  skeletonWrapper: {
    marginTop: 10,
  },
  footerContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  bannerContainer: {
    marginHorizontal: 15,
  },
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
});