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
import { useTheme } from '../../redux/hooks/useTheme';
// import { useTheme } from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArchiveScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();

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
      showHeader={true}
      showTopMenu={false}
      showBanner={true}
      showFilter={false}
      showBackButton={true}
      onBackPress={handleBack}
    >
      <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView
          ref={scrollRef}
          style={[styles.container, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Modern Filter Bar */}
          <View style={[styles.filterBar, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border 
          }]}>
            {/* Search Input */}
            <View style={[styles.searchWrapper, { 
              backgroundColor: isDark ? colors.border : '#f5f5f5' 
            }]}>
              <Ionicons name="search-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={localSearch}
                onChangeText={setLocalSearch}
                placeholder="Search articles..."
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
              {localSearch.length > 0 && (
                <TouchableOpacity onPress={() => setLocalSearch('')}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button with Badge */}
            <TouchableOpacity 
              style={[styles.filterButton, { 
                borderColor: colors.primary,
                backgroundColor: colors.card 
              }]}
              onPress={openFilterModal}
            >
              <Ionicons name="filter-outline" size={20} color={colors.primary} />
              <Text style={[styles.filterButtonText, { color: colors.primary }]}>
                Filter
              </Text>
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <View style={[styles.activeFiltersContainer, { 
              backgroundColor: colors.card,
              borderBottomColor: colors.border 
            }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipsWrapper}>
                  {selectedYear && (
                    <TouchableOpacity 
                      style={[styles.filterChip, { backgroundColor: colors.background }]}
                      onPress={() => {
                        setSelectedYear('');
                        navigation.setParams({ year: '', page: 1 });
                      }}
                    >
                      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>
                        Year: {selectedYear}
                      </Text>
                      <Ionicons name="close" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  {selectedCategory && (
                    <TouchableOpacity 
                      style={[styles.filterChip, { backgroundColor: colors.background }]}
                      onPress={() => {
                        setSelectedCategory('');
                        navigation.setParams({ category_id: '', page: 1 });
                      }}
                    >
                      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>
                        Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                      </Text>
                      <Ionicons name="close" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  {selectedAuthor && (
                    <TouchableOpacity 
                      style={[styles.filterChip, { backgroundColor: colors.background }]}
                      onPress={() => {
                        setSelectedAuthor('');
                        navigation.setParams({ author_id: '', page: 1 });
                      }}
                    >
                      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>
                        Author: {authors.find(a => a.id.toString() === selectedAuthor)?.name}
                      </Text>
                      <Ionicons name="close" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  {routeParams?.search && (
                    <TouchableOpacity 
                      style={[styles.filterChip, { backgroundColor: colors.background }]}
                      onPress={() => {
                        setLocalSearch('');
                        navigation.setParams({ search: '', page: 1 });
                      }}
                    >
                      <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>
                        Search: {routeParams.search}
                      </Text>
                      <Ionicons name="close" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.filterChip, styles.clearAllChip, { 
                      backgroundColor: colors.card,
                      borderColor: colors.border 
                    }]}
                    onPress={clearAllFilters}
                  >
                    <Text style={[styles.filterChipText, styles.clearAllText, { color: colors.primary }]}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

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
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                {/* Modal Header */}
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Filter Articles
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setIsFilterModalVisible(false)}
                    style={[styles.modalCloseButton, { backgroundColor: colors.background }]}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Filter Options */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Year Filter */}
                  <View style={[styles.modalFilterGroup, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalFilterLabel, { color: colors.text }]}>Year</Text>
                    <View style={[styles.modalPickerContainer, { 
                      borderColor: colors.border,
                      backgroundColor: colors.background 
                    }]}>
                      <Picker
                        selectedValue={tempYear}
                        onValueChange={setTempYear}
                        style={[styles.modalPicker, { color: colors.text }]}
                        dropdownIconColor={colors.primary}
                        itemStyle={{ color: colors.text }}
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
                  <View style={[styles.modalFilterGroup, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalFilterLabel, { color: colors.text }]}>Category</Text>
                    <View style={[styles.modalPickerContainer, { 
                      borderColor: colors.border,
                      backgroundColor: colors.background 
                    }]}>
                      <Picker
                        selectedValue={tempCategory}
                        onValueChange={setTempCategory}
                        style={[styles.modalPicker, { color: colors.text }]}
                        dropdownIconColor={colors.primary}
                        itemStyle={{ color: colors.text }}
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
                  <View style={[styles.modalFilterGroup, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalFilterLabel, { color: colors.text }]}>Author</Text>
                    <View style={[styles.modalPickerContainer, { 
                      borderColor: colors.border,
                      backgroundColor: colors.background 
                    }]}>
                      <Picker
                        selectedValue={tempAuthor}
                        onValueChange={setTempAuthor}
                        style={[styles.modalPicker, { color: colors.text }]}
                        dropdownIconColor={colors.primary}
                        itemStyle={{ color: colors.text }}
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
                <View style={[styles.modalActions, { 
                  borderTopColor: colors.border,
                  backgroundColor: colors.card 
                }]}>
                  <TouchableOpacity 
                    style={[styles.modalResetButton, { backgroundColor: colors.background }]}
                    onPress={() => {
                      setTempYear('');
                      setTempCategory('');
                      setTempAuthor('');
                    }}
                  >
                    <Text style={[styles.modalResetText, { color: colors.textSecondary }]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalApplyButton, { backgroundColor: colors.primary }]}
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
    flex: 1
  },
  container: { 
    flex: 1,
  },
  
  // Modern Filter Bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
    borderBottomWidth: 1,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    position: 'relative',
  },
  filterButtonText: {
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  chipsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
  },
  clearAllChip: {
    borderWidth: 1,
  },
  clearAllText: {
    fontWeight: '600',
  },
  
  divider: {
    height: 8,
  },
  
  // Results Info
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 13,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFilterGroup: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalPickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
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
  },
  modalResetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalResetText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
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