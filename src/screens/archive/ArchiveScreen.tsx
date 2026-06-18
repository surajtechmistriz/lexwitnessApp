import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import MainLayout from '../../MainLayout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArchiveScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

  //  SAFE PARAMS
  const routeParams = route.params || {};

  // --- API Data States ---
  const [posts, setPosts] = useState([]);
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // --- UI States ---
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(routeParams?.page || 1);
  const [localSearch, setLocalSearch] = useState(routeParams?.search || '');

  // --- Filter States ---
  const [selectedYear, setSelectedYear] = useState(
    routeParams?.year?.toString() || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    routeParams?.category_id?.toString() || '',
  );
  const [selectedAuthor, setSelectedAuthor] = useState(
    routeParams?.author_id?.toString() || '',
  );

  // --- Filter Modal State ---
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempAuthor, setTempAuthor] = useState(selectedAuthor);

  // Count active filters
  const activeFiltersCount = [
    selectedYear,
    selectedCategory,
    selectedAuthor,
    routeParams?.search,
  ].filter(Boolean).length;

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
    const params = route.params || {};
    setLocalSearch(params?.search || '');
    setSelectedYear(params?.year?.toString() || '');
    setSelectedCategory(params?.category_id?.toString() || '');
    setSelectedAuthor(params?.author_id?.toString() || '');
    setCurrentPage(params?.page || 1);
  }, [route.params]);

  const fetchArticles = useCallback(async () => {
    const params = route.params || {};
    setLoading(true);
    try {
      const response = await getPosts({
        search: params?.search || undefined,
        year: params?.year || undefined,
        category_id: params?.category_id || undefined,
        author_id: params?.author_id || undefined,
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
    setIsFilterModalVisible(false);
  };

  const handleSearchSubmit = () => {
    navigation.setParams({ 
      search: localSearch, 
      page: 1,
      year: '',
      category_id: '',
      author_id: '',
    });
  };

  const clearAllFilters = () => {
    setSelectedYear('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setLocalSearch('');
    navigation.setParams({
      search: '',
      year: '',
      category_id: '',
      author_id: '',
      page: 1,
    });
  };

  const openFilterModal = () => {
    setTempYear(selectedYear);
    setTempCategory(selectedCategory);
    setTempAuthor(selectedAuthor);
    setIsFilterModalVisible(true);
  };

  const applyModalFilters = () => {
    setSelectedYear(tempYear);
    setSelectedCategory(tempCategory);
    setSelectedAuthor(tempAuthor);
    navigation.setParams({
      year: tempYear,
      category_id: tempCategory,
      author_id: tempAuthor,
      search: '',
      page: 1,
    });
    setIsFilterModalVisible(false);
  };

  const isSearchMode = routeParams?.mode === 'search' || !!routeParams?.search;

    // BACK BUTTON HANDLER
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <MainLayout 
      title="Archive" 
      routeName="Archive"
      showHeader={true}        //  HEADER SHOW
      showTopMenu={false}      //  TOP MENU HIDE
      showBanner={true}        //  BANNER SHOW
      showFilter={false}       //  FILTER HIDE (we have custom filter)
        // showFilter={false}
         showBackButton={true}
      onBackPress={handleBack}
    >
      <View style={styles.safeArea}>
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Modern Filter Bar */}
          <View style={styles.filterBar}>
            {/* Search Input */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                value={localSearch}
                onChangeText={setLocalSearch}
                placeholder="Search articles..."
                placeholderTextColor="#999"
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
              {localSearch.length > 0 && (
                <TouchableOpacity onPress={() => setLocalSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button with Badge */}
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={openFilterModal}
            >
              <Ionicons name="filter-outline" size={20} color="#c9060a" />
              <Text style={styles.filterButtonText}>Filter</Text>
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <View style={styles.activeFiltersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipsWrapper}>
                  {selectedYear && (
                    <TouchableOpacity 
                      style={styles.filterChip}
                      onPress={() => {
                        setSelectedYear('');
                        navigation.setParams({ year: '', page: 1 });
                      }}
                    >
                      <Text style={styles.filterChipText}>Year: {selectedYear}</Text>
                      <Ionicons name="close" size={14} color="#c9060a" />
                    </TouchableOpacity>
                  )}
                  {selectedCategory && (
                    <TouchableOpacity 
                      style={styles.filterChip}
                      onPress={() => {
                        setSelectedCategory('');
                        navigation.setParams({ category_id: '', page: 1 });
                      }}
                    >
                      <Text style={styles.filterChipText}>
                        Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                      </Text>
                      <Ionicons name="close" size={14} color="#c9060a" />
                    </TouchableOpacity>
                  )}
                  {selectedAuthor && (
                    <TouchableOpacity 
                      style={styles.filterChip}
                      onPress={() => {
                        setSelectedAuthor('');
                        navigation.setParams({ author_id: '', page: 1 });
                      }}
                    >
                      <Text style={styles.filterChipText}>
                        Author: {authors.find(a => a.id.toString() === selectedAuthor)?.name}
                      </Text>
                      <Ionicons name="close" size={14} color="#c9060a" />
                    </TouchableOpacity>
                  )}
                  {routeParams?.search && (
                    <TouchableOpacity 
                      style={styles.filterChip}
                      onPress={() => {
                        setLocalSearch('');
                        navigation.setParams({ search: '', page: 1 });
                      }}
                    >
                      <Text style={styles.filterChipText}>
                        Search: {routeParams.search}
                      </Text>
                      <Ionicons name="close" size={14} color="#c9060a" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.filterChip, styles.clearAllChip]}
                    onPress={clearAllFilters}
                  >
                    <Text style={[styles.filterChipText, styles.clearAllText]}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}

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
            {/* Your existing footer components */}
          </View>
        </ScrollView>

        {/* Modern Filter Modal */}
        <Modal
          visible={isFilterModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsFilterModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter Articles</Text>
                  <TouchableOpacity 
                    onPress={() => setIsFilterModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Filter Options */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Year Filter */}
                  <View style={styles.modalFilterGroup}>
                    <Text style={styles.modalFilterLabel}>Year</Text>
                    <View style={styles.modalPickerContainer}>
                      <Picker
                        selectedValue={tempYear}
                        onValueChange={setTempYear}
                        style={styles.modalPicker}
                        dropdownIconColor="#c9060a"
                      >
                        <Picker.Item label="All Years" value="" />
                        {years.map(y => (
                          <Picker.Item
                            key={y}
                            label={y.toString()}
                            value={y.toString()}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* Category Filter */}
                  <View style={styles.modalFilterGroup}>
                    <Text style={styles.modalFilterLabel}>Category</Text>
                    <View style={styles.modalPickerContainer}>
                      <Picker
                        selectedValue={tempCategory}
                        onValueChange={setTempCategory}
                        style={styles.modalPicker}
                        dropdownIconColor="#c9060a"
                      >
                        <Picker.Item label="All Categories" value="" />
                        {categories.map(c => (
                          <Picker.Item
                            key={c.id}
                            label={c.name}
                            value={c.id.toString()}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* Author Filter */}
                  <View style={styles.modalFilterGroup}>
                    <Text style={styles.modalFilterLabel}>Author</Text>
                    <View style={styles.modalPickerContainer}>
                      <Picker
                        selectedValue={tempAuthor}
                        onValueChange={setTempAuthor}
                        style={styles.modalPicker}
                        dropdownIconColor="#c9060a"
                      >
                        <Picker.Item label="All Authors" value="" />
                        {authors.map(a => (
                          <Picker.Item
                            key={a.id}
                            label={a.name}
                            value={a.id.toString()}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalResetButton}
                    onPress={() => {
                      setTempYear('');
                      setTempCategory('');
                      setTempAuthor('');
                    }}
                  >
                    <Text style={styles.modalResetText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalApplyButton}
                    onPress={applyModalFilters}
                  >
                    <Text style={styles.modalApplyText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  container: { 
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Modern Filter Bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c9060a',
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
    color: '#c9060a',
    fontSize: 14,
    fontWeight: '600',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#c9060a',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Active Filters Chips
  activeFiltersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chipsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterChipText: {
    color: '#666',
    fontSize: 13,
  },
  clearAllChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearAllText: {
    color: '#c9060a',
  },
  
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  
  // Results Info
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  resultsText: {
    fontSize: 13,
    color: '#999',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFilterGroup: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalPickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  modalPicker: {
    height: 50,
    width: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  modalResetButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalResetText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalApplyButton: {
    flex: 1,
    backgroundColor: '#c9060a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalApplyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  footerContainer: { 
    marginTop: 20,
  },
});