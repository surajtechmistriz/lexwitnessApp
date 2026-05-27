import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';
import { getCategoryBySlug } from '../../services/api/category';

import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';

import TopMenu from '../../components/common/Menubar';
import Banner from '../../components/common/DynamicBanner';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Category() {
  const route = useRoute<any>();
  const scrollRef = useRef<ScrollView>(null);

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

  // ---------------- FETCH ----------------
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

  // ---------------- INIT ----------------
  useEffect(() => {
    const init = async () => {
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

  // ---------------- FILTER ----------------
  useEffect(() => {
    if (category?.id) {
      fetchData(category.id, appliedYear, 1);
    }
  }, [appliedYear, category?.id, fetchData]);

  // ---------------- REFRESH ----------------
  const onRefresh = () => {
    if (!category?.id) return;

    setRefreshing(true);
    fetchData(category.id, appliedYear, currentPage);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[1]}
      >
        {/* Top Menu */}
        <TopMenu />

        {/* Sticky Banner */}
        <Banner
          title={slug.replace(/-/g, ' ')}
          renderFilter={(close) => (
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

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View>
              {[1, 2, 3].map((i) => (
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
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={(page) =>
                fetchData(category.id, appliedYear, page)
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: SCREEN_HEIGHT * 0.6,
  },
});