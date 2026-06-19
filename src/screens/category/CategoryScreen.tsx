import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
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
import { useTheme } from '../../redux/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Category() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();

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
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'light-content'} 
        backgroundColor={colors.primary} 
      />

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
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

          {loading ? (
            <View>
              {[1, 2, 3].map(i => (
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
              onPageChange={page => {
                fetchData(category.id, appliedYear, page);
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            />
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
  scrollContent: {},
  content: {
    paddingTop: 10,
    minHeight: SCREEN_HEIGHT * 0.6,
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