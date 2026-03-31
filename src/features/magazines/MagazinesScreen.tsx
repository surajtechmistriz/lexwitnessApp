import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import YearFilter from '../../components/common/YearFilter';
import { getMagazines } from './api/magazine';
import { getYears } from '../../services/api/years';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Pagination from '../../components/common/Pagination';
import MainLayout from '../../components/layout/MainLayout';
import Footer from '../../components/common/Footer';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20;
const imgUrl = Config.MAGAZINES_BASE_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MagazinesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(null);
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await getYears();
        const fetchedYears =
          res?.data?.map((y: any) => (typeof y === 'number' ? y : y.year)) ??
          [];
        setYears(fetchedYears.sort((a, b) => b - a));
      } catch (err) {
        console.error('Error fetching years', err);
      }
    };
    fetchYears();
  }, []);

  // Fetch magazines
  const fetchMagazines = async (page = 1, year = selectedYear) => {
    setLoading(true);
    try {
      const res = await getMagazines({
        year: year ?? undefined,
        page,
        per_page: 10,
      });

      setMagazines(res?.data ?? []);
      setLastPage(res?.meta?.paging?.last_page ?? 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching magazines', err);
      setMagazines([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMagazines(1, selectedYear);
  }, [selectedYear]);

  const handlePageChange = (page: number) => {
    fetchMagazines(page, selectedYear);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MagazineDetail', { slug: item.slug })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.image
              ? `${imgUrl}/${item.image}`
              : 'https://via.placeholder.com/300x400',
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title || item.magazine_name}</Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <MainLayout 
      title="Magazines"
      // 1. Move YearFilter here to put it in the Banner
     renderFilter={(close) => (
  <YearFilter
    years={years}
    selectedYear={tempSelectedYear}
    onSelect={setTempSelectedYear}
    onApply={() => {
      setSelectedYear(tempSelectedYear);
      setCurrentPage(1);
      close(); // ✅ CLOSE MODAL (same as CategoryScreen)
    }}
    disabled={loading}
  />
)}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>ALL EDITIONS MAGAZINE</Text>
          <View style={styles.underline} />
          {/* 2. Extra Filter removed from here */}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#c9060a"
            style={{ marginTop: 50 }}
          />
        ) : magazines.length === 0 ? (
          <Text style={styles.emptyText}>
            {selectedYear
              ? `No magazines found for ${selectedYear}`
              : 'No magazines found'}
          </Text>
        ) : (
          <FlatList
            data={magazines}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            ListFooterComponent={
              <View style={styles.footerWrapper}>
                {!loading && magazines.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                )}
                <Footer />
              </View>
            }
          />
        )}
      </View>
    </MainLayout>
  );
};

export default MagazinesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 15, paddingTop: 15 },
  heading: { fontSize: 20, fontWeight: '600', color: '#333' },
  underline: {
    width: 50,
    height: 5,
    backgroundColor: '#c9060a',
    marginTop: 5,
    marginBottom: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  flatListContent: { paddingTop: 10 },
  card: { width: ITEM_WIDTH },
  imageWrapper: { width: '100%', aspectRatio: 3 / 4, marginBottom: 5 },
  image: { width: '100%', height: '100%' },
  cardContent: { alignItems: 'center', paddingVertical: 5 },
  title: { fontSize: 13, color: '#333', textAlign: 'center' },
  readMore: { color: '#c9060a', fontWeight: '500', marginTop: 4 },
  emptyText: {
    textAlign: 'center',
    color: '#333',
    paddingVertical: 50,
    fontSize: 14,
  },
  footerWrapper: { marginTop: 20 },
});