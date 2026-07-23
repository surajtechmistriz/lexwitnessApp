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
  StatusBar,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Config from 'react-native-config';

import MainLayout from '../../MainLayout';
import YearFilter from '../../components/common/YearFilter';
import Pagination from '../../components/common/Pagination';

import { getMagazines } from './api/magazine';
import { getYears } from '../../services/api/years';
import { useTheme } from '../../redux/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';

type RootStackParamList = {
  MagazineDetail: { slug: string };
  // ... other screens
};

const { width, height } = Dimensions.get('window');

// Responsive utility functions
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const verticalScale = (size: number) => {
  const baseHeight = 667;
  const scaleFactor = height / baseHeight;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const isSmallDevice = width < 375;
const isTablet = width >= 768;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MagazinesScreen = ({ onScrollDown, onScrollUp }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const { spacing, font, sizes } = useResponsive();

  const scrollOffset = useRef(0);

  // Responsive values
  const horizontalPadding = isTablet ? 24 : 12;
  const cardGap = isTablet ? 16 : 12;
  const numColumns = isTablet ? 3 : 2;
  const itemWidth = (width - horizontalPadding * 2 - cardGap * (numColumns - 1)) / numColumns;
  const headingSize = isTablet ? font.lg : font.sm;
  const titleSize = isTablet ? font.md : font.sm;

  // Status bar color
  const statusBarColor = '#c9060a';
  const statusBarStyle = 'light-content';

  // Force status bar update when screen is focused
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (Platform.OS === 'android') {
  //       StatusBar.setBackgroundColor(statusBarColor);
  //       StatusBar.setTranslucent(false);
  //       StatusBar.setBarStyle(statusBarStyle);
  //     } else {
  //       StatusBar.setBarStyle(statusBarStyle);
  //     }
  //   }, [])
  // );

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
          res?.data?.map((y: any) => (typeof y === 'number' ? y : y.year)) ?? [];
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

  const handleMagazinePress = (item: any) => {
    navigation.navigate('MagazineDetail', {
      slug: item?.slug,
    });
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          width: itemWidth,
          marginBottom: verticalScale(isTablet ? 24 : 18),
          shadowColor: isDark ? '#000' : '#000',
          ...Platform.select({
            ios: {
              shadowOffset: { width: 0, height: verticalScale(3) },
              shadowOpacity: 0.12,
              shadowRadius: scale(6),
            },
            android: {
              elevation: isTablet ? 6 : 4,
            },
          }),
        }
      ]}
      onPress={() => handleMagazinePress(item)}
    >
      <View style={[
        styles.imageWrapper,
        {
          backgroundColor: isDark ? colors.border : '#eee',
          borderRadius: isTablet ? scale(12) : scale(8),
        }
      ]}>
        <Image
          source={{
            uri: item.image
              ? `${Config.MAGAZINES_BASE_URL}/${item.image}`
              : 'https://via.placeholder.com/300x400',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[
          styles.imageOverlay,
          {
            backgroundColor: isDark ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
          }
        ]} />
      </View>

      <View style={[
        styles.cardContent,
        { paddingTop: verticalScale(isTablet ? 12 : 10) }
      ]}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: titleSize,
              fontWeight: isTablet ? '700' : '700',
            }
          ]}
          numberOfLines={1}
        >
          {item.title || item.magazine_name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ---------------- BACK BUTTON HANDLER ---------------- */
  const handleBackPress = () => {
    navigation.goBack();
  };

  /* ---------------- UI ---------------- */
  return (
    <MainLayout
      title="Magazines"
      routeName="Magazines"
      statusBarColor={statusBarColor}
      statusBarStyle={statusBarStyle}
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {loading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={magazines}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={[
              styles.columnWrapper,
              {
                paddingHorizontal: horizontalPadding,
                gap: cardGap,
              }
            ]}
            contentContainerStyle={[
              styles.flatListContent,
              {
                paddingTop: isTablet ? verticalScale(16) : 0,
                paddingBottom: verticalScale(isTablet ? 30 : 20),
              }
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews
            initialNumToRender={isTablet ? 9 : 6}
            maxToRenderPerBatch={isTablet ? 12 : 8}
            windowSize={10}
            ListHeaderComponent={
              <View style={[
                styles.headerArea,
                {
                  paddingHorizontal: isTablet ? 24 : 16,
                  paddingTop: isTablet ? verticalScale(16) : verticalScale(12),
                  marginBottom: isTablet ? verticalScale(16) : verticalScale(12),
                  marginVertical: isTablet ? verticalScale(12) : verticalScale(10),
                }
              ]}>
                <Text style={[
                  styles.heading,
                  {
                    color: colors.textMuted,
                    fontSize: headingSize,
                    fontWeight: isTablet ? '800' : '800',
                    letterSpacing: isTablet ? 1.5 : 1.2,
                  }
                ]}>
                  {isTablet ? 'ALL EDITIONS' : 'ALL EDITIONS MAGAZINE'}
                </Text>
                <View style={[
                  styles.underline,
                  {
                    backgroundColor: colors.primary,
                    width: isTablet ? scale(40) : 30,
                    height: isTablet ? scale(4) : 3,
                    marginTop: isTablet ? verticalScale(8) : 6,
                    borderRadius: isTablet ? scale(12) : 10,
                  }
                ]} />
              </View>
            }
            ListFooterComponent={
              <View style={[
                styles.footerWrapper,
                {
                  marginTop: isTablet ? verticalScale(16) : verticalScale(10),
                  paddingBottom: isTablet ? verticalScale(20) : 20,
                }
              ]}>
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
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerArea: {
    width: '100%',
  },

  heading: {
    textTransform: 'uppercase',
  },

  underline: {
    borderRadius: 10,
  },

  flatListContent: {
    flexGrow: 1,
  },

  columnWrapper: {
    justifyContent: 'flex-start',
  },

  card: {
    overflow: 'hidden',
  },

  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  cardContent: {
    paddingHorizontal: 2,
  },

  title: {
    textAlign: 'center',
  },

  footerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});