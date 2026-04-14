import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Config from 'react-native-config';

import { getPosts } from '../../services/api/posts';
import { getAuthor } from '../../services/api/author';
import { getMenu } from '../../services/api/category';
import { getYears } from '../../services/api/years';

import PostList from '../../components/common/PostList';
import Pagination from '../../components/common/Pagination';
import Header from '../../components/common/Header';
import TopMenu from '../../components/common/Menubar';
import Footer from '../../components/common/Footer';
import LatestEditionImageOnly from '../home/components/LatestEditionImageOnly';
import HomeBanner from '../home/components/HomeBanner';
import HomeAdvertisement from '../home/components/HomeAdvertisement';
import MainLayout from '../../components/layout/MainLayout';

export default function ArchiveScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

  // --- API Data States ---
  const [posts, setPosts] = useState([]);
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // --- UI States ---
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(route.params?.page || 1);
  const [localSearch, setLocalSearch] = useState(route.params?.search || '');

  // --- Filter States (for the dropdown UI) ---
  const [selectedYear, setSelectedYear] = useState(
    route.params?.year?.toString() || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category_id?.toString() || '',
  );
  const [selectedAuthor, setSelectedAuthor] = useState(
    route.params?.author_id?.toString() || '',
  );

  // Load Dropdown Data
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [y, c, a] = await Promise.all([
          getYears(),
          getMenu(),
          getAuthor(),
        ]);
        setYears(y.data || []);
        setCategories(c || []);
        setAuthors(a.data || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFilters();
  }, []);

  // Sync state when params change
  useEffect(() => {
    setLocalSearch(route.params?.search || '');
    setSelectedYear(route.params?.year?.toString() || '');
    setSelectedCategory(route.params?.category_id?.toString() || '');
    setSelectedAuthor(route.params?.author_id?.toString() || '');
    setCurrentPage(route.params?.page || 1);
  }, [route.params]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPosts({
        search: route.params?.search || undefined,
        year: route.params?.year || undefined,
        category_id: route.params?.category_id || undefined,
        author_id: route.params?.author_id || undefined,
        page: currentPage,
      });
      setPosts(response.data || []);
      setLastPage(response.meta?.paging?.last_page ?? 1);
    } finally {
      setLoading(false);
    }
  }, [route.params, currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleApplyFilters = () => {
    navigation.setParams({
      mode: 'filter',
      year: selectedYear,
      category_id: selectedCategory,
      author_id: selectedAuthor,
      search: '',
      page: 1,
    });
  };

  const isSearchMode =
    route.params?.mode === 'search' || !!route.params?.search;

  return (
    <MainLayout title="Archive" showFilter={false} routeName="Archive">
      <SafeAreaView style={styles.safeArea}>
        {/* <Header /> */}
        {/* <TopMenu activeSlug="archive" /> */}
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          
        >
          <View style={styles.filterSection}>
            {isSearchMode ? (
              /* CONDITIONAL UI: FIRST SS (Search Input) */
              <View style={styles.searchBarWrapper}>
                <TextInput
                  style={styles.searchInput}
                  value={localSearch}
                  onChangeText={setLocalSearch}
                  placeholder="Search..."
                  onSubmitEditing={() =>
                    navigation.setParams({ search: localSearch, page: 1 })
                  }
                />
                <Ionicons name="search" size={20} color="#333" />
              </View>
            ) : (
              /* CONDITIONAL UI: SECOND SS (Dropdown Filters) */
              <View style={styles.dropdownContainer}>
                <View style={styles.pickerBorder}>
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={setSelectedYear}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Year" value="" />
                    {years.map(y => (
                      <Picker.Item
                        key={y}
                        label={y.toString()}
                        value={y.toString()}
                      />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerBorder}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {categories.map(c => (
                      <Picker.Item
                        key={c.id}
                        label={c.name}
                        value={c.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerBorder}>
                  <Picker
                    selectedValue={selectedAuthor}
                    onValueChange={setSelectedAuthor}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Author" value="" />
                    {authors.map(a => (
                      <Picker.Item
                        key={a.id}
                        label={a.name}
                        value={a.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <PostList
            posts={posts}
            loading={loading}
            postBaseUrl={Config.POSTS_BASE_URL}
            emptyMessage="No posts found."
          />

          {posts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={p => {
                setCurrentPage(p);
                navigation.setParams({ page: p });
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            />
          )}

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
            {/* <Footer /> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  filterSection: {
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 30,
  },
  /* Styling for SS 1 */
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  /* Styling for SS 2 */
  dropdownContainer: {
    gap: 10,
  },
  pickerBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
  },
  searchBtn: {
    backgroundColor: '#c9060a',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 5,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  // divider: {
  //   height: 1,
  //   backgroundColor: '#eee',
  //   marginVertical: 15,
  //   marginHorizontal: 15,
  //   borderStyle: 'dashed',
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  // },
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
  BannerContainer: { marginHorizontal: 15 },
  magazine: { marginBottom: 20, marginHorizontal: 15 },

  footerContainer: { marginTop: 'auto', width: '100%' },
});
