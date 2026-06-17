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
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Config from 'react-native-config';

import MainLayout from '../../MainLayout';
import YearFilter from '../../components/common/YearFilter';
import Pagination from '../../components/common/Pagination';

import { getMagazines } from './api/magazine';
import { getYears } from '../../services/api/years';

import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');

const HORIZONTAL_PADDING = 12;
const CARD_GAP = 12;

//  Better responsive width
const ITEM_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const imgUrl = Config.MAGAZINES_BASE_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MagazinesScreen = ({ onScrollDown, onScrollUp }: any) => {
  const navigation = useNavigation<NavigationProp>();

  const scrollOffset = useRef(0);

  /* ---------------- SCROLL HANDLER ---------------- */
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    const diff = currentOffset - scrollOffset.current;

    if (currentOffset <= 0) {
      onScrollUp?.();
    } else if (diff > 10) {
      onScrollDown?.();
    } else if (diff < -10) {
      onScrollUp?.();
    }

    scrollOffset.current = currentOffset;
  };

  /* ---------------- STATES ---------------- */
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(null);

  const [magazines, setMagazines] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  /* ---------------- FETCH YEARS ---------------- */
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

  /* ---------------- FETCH MAGAZINES ---------------- */
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
    }
  };

  useEffect(() => {
    fetchMagazines(1, selectedYear);
  }, [selectedYear]);

  /* ---------------- PAGINATION ---------------- */
  const handlePageChange = (page: number) => {
    fetchMagazines(page, selectedYear);
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate('MagazineDetail', {
          slug: item?.slug,
        })
      }
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

        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || item.magazine_name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ---------------- UI ---------------- */
  return (
    <MainLayout
      title="Magazines"
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
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.flatListContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={10}
            ListHeaderComponent={
              <View style={styles.headerArea}>
                <Text style={styles.heading}>ALL EDITIONS MAGAZINE</Text>

                <View style={styles.underline} />
              </View>
            }
            ListFooterComponent={
              <View style={styles.footerWrapper}>
                {magazines.length > 0 && (
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
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 12, //  reduced extra top space
    marginBottom: 12,
    marginVertical:10
  },

  heading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  underline: {
    width: 30,
    height: 3,
    backgroundColor: '#c9060a',
    marginTop: 6,
    borderRadius: 10,
  },

  flatListContent: {
    paddingTop: 0, //  removed top gap
    paddingBottom: 20,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 6,
  },

  card: {
    width: ITEM_WIDTH,
    marginBottom: 18,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },

      android: {
        elevation: 4,
      },
    }),
  },

  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },

  cardContent: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1B',
    textAlign: 'center',
  },

  footerWrapper: {
    marginTop: 10,
    paddingBottom: 0,
  },
});
