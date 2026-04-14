import React, { useEffect, useRef, useState } from 'react';
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

const MagazinesScreen = ({ onScrollDown, onScrollUp }: any) => {
  const navigation = useNavigation<NavigationProp>();

  // 2. Add a ref to track the last scroll position
  const scrollOffset = useRef(0);

  // 3. Create the handleScroll function
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    // Check if user scrolled down or up
    const dif = currentOffset - scrollOffset.current;

    if (currentOffset <= 0) {
      // At the very top
      onScrollUp?.();
    } else if (dif > 10) {
      // Scrolling Down
      onScrollDown?.();
    } else if (dif < -10) {
      // Scrolling Up
      onScrollUp?.();
    }

    scrollOffset.current = currentOffset;
  };

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
      activeOpacity={0.9}
      onPress={() => navigation.navigate('MagazineDetail', { slug: item?.slug })}
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
        {/* Subtle overlay for realism */}
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || item.magazine_name}
        </Text>
        {/* <Text style={styles.editionText}>
          {item.month?.name || ''} {item.year || ''} Edition
        </Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <MainLayout
      title="Magazines" // Changed to Library for a more "App" feel
      routeName="Magazines" 
      renderFilter={close => (
        <YearFilter
          years={years}
          selectedYear={tempSelectedYear}
          onSelect={setTempSelectedYear}
          onApply={() => {
            setSelectedYear(tempSelectedYear);
            setCurrentPage(1);
            close();
          }}
          disabled={loading}
        />
      )}
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.centerLoader}>
             <ActivityIndicator size="large" color="#c9060a" />
          </View>
        ) : (
          <FlatList
            data={magazines}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={
              <View style={styles.headerArea}>
                <Text style={styles.heading}>ALL EDITIONS MAGAZINE</Text>
                <View style={styles.underline} />
              </View>
            }
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  headerArea: { paddingHorizontal: 16, paddingTop: 20, marginBottom: 10 },
  heading: { fontSize: 13, fontWeight: '800', color: '#888', letterSpacing: 1.2, textTransform: 'uppercase' },
  underline: {
    width: 30,
    height: 3,
    backgroundColor: '#c9060a',
    marginTop: 6,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  flatListContent: { paddingBottom: 40 },
  
  card: { 
    width: ITEM_WIDTH, 
    marginBottom: 24 
  },
  imageWrapper: { 
    width: '100%', 
    aspectRatio: 3 / 4, 
    borderRadius: 6,
    backgroundColor: '#eee',
    // Physical book shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
    overflow: 'hidden',
    borderLeftWidth: 1, // Mimics the "spine"
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)', // Soft overlay for texture
  },
  cardContent: { 
    paddingTop: 12, 
    paddingHorizontal: 2 
  },
  title: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1A1A1B', 
    textAlign: 'center' 
  },
  editionText: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 3, 
    textAlign: 'left',
    fontWeight: '500' 
  },
  footerWrapper: { marginTop: 10, paddingBottom: 20 },
});
