import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Config from 'react-native-config';

// API
import { getPosts } from '../../services/api/posts';
import { getYears } from '../../services/api/years';
import { getCategoryBySlug } from '../../services/api/category';

// Components
import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import YearFilter from '../../components/common/YearFilter';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import MainLayout from '../../components/layout/MainLayout';
import ArticleSkeleton from '../../skeleton/ArticleSkeleton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Category() {
  const route = useRoute<any>();
  const slug = route.params?.slug || '';
  const postBaseUrl = Config.POSTS_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [appliedYear, setAppliedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const init = async () => {
      const [catData, yearData] = await Promise.all([
        getCategoryBySlug(slug),
        getYears(),
      ]);
      setCategory(catData);
      setYears(yearData.data || []);
      if (catData?.id) fetchData(catData.id, null, 1);
    };
    init();
  }, [slug, fetchData]);

  useEffect(() => {
    if (category?.id) {
      fetchData(category.id, appliedYear, 1);
    }
  }, [appliedYear]);

  return (
    <MainLayout
      activeSlug={slug}
      title={slug?.replace(/-/g, ' ')}
      routeName="Category"
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
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {loading ? (
            <View>
              {[1, 2, 3, 4, 5].map((item) => (
                <ArticleSkeleton key={item} />
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

          {!loading && posts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={(page) =>
                fetchData(category.id, appliedYear, page)
              }
            />
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <LatestEditionImageOnly />
          <HomeBanner />
          <HomeAdvertisement />
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
});