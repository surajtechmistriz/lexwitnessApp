// src/screens/Home/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import TopMenu from '../../components/common/Menubar';
import HeroCard from './components/HeroCard';
import ListCard from './components/ListCard';
import EditorPicksSection from './sections/EditorPickSection';
import HomeAdvertisement from './components/HomeAdvertisement';
import HomeBanner from './components/HomeBanner';
import LatestEdition from './components/LatestEdition';
import LatestEditions from './components/Latest5Edition';
import EditorialCard from './components/Editorial';

import { getHeroPost } from '../../services/api/heroCard';
import { getEditorPick } from '../../services/api/editorpicks';
import { getCache, setCache, isCacheExpired } from '../../utils/cache';
import { useRefresh } from '../../hooks/useRefresh';
import HeroSkeleton from '../../skeleton/HeroSkeleton';
import ListSkeleton from '../../skeleton/ListSkeleton';
import MainLayout from '../../MainLayout';
import { useTheme } from '../../redux/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();



  const insets = useSafeAreaInsets();

  const {
    spacing, font,
    isTablet, isSmallDevice,
    moderateScale
  } = useResponsive();

  const tabBarHeight = useTabBarHeight();
  const { width } = useWindowDimensions();

  // ------ ALL HOOKS AT TOP ------
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [restLoading, setRestLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // ------ useMemo HOOKS ------
  const sliderData = articles.slice(0, 3);
  const remainingCards = articles.slice(3);

  // ------ Responsive calculations ------
  const horizontalPadding = isTablet ? spacing.lg : spacing.md;
  const carouselWidth = width - (horizontalPadding * 2);
  const HERO_HEIGHT = carouselWidth * (9 / 16);

  //  Calculate bottom padding for ScrollView
  // Add extra spacing so content doesn't hide behind tab bar
  const bottomPadding = tabBarHeight - spacing.lg;

  // Format magazine date
  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  // Generate image URL
  const getImage = (image: string) => {
    return `${IMAGE_BASE_URL}/${image}`;
  };

  // ------ Navigation handlers ------
  const handleArticlePress = useCallback(
    (item: any) => {
      navigation.navigate('ArticleDetail', {
        slug: item.slug,
        id: item.id,
      });
    },
    [navigation],
  );

  const handleMagazinePress = useCallback(
    (item: any) => {
      navigation.navigate('MagazineDetail', {
        slug: item.slug,
      });
    },
    [navigation],
  );

  const handleViewAllMagazines = useCallback(() => {
    navigation.navigate('MagazinesTab');
  }, [navigation]);

  const handleEditorialPress = useCallback(
    (item: any) => {
      navigation.navigate('EditorialDetail', {
        editorialId: item.id,
      });
    },
    [navigation],
  );

  // ----- Fetch Home Data -----
  const fetchHomeData = useCallback(
    async (force = false) => {
      try {
        const cached = await getCache('HOME_DATA');

        if (cached?.data && !force) {
          setArticles(cached.data.articles || []);
          setEditorPicks(cached.data.editorPicks || []);
          setHeroLoading(false);
          setRestLoading(false);

          if (!isCacheExpired(cached.timestamp)) {
            return;
          }
        }

        if (!isConnected && !cached?.data) {
          setHeroLoading(false);
          setRestLoading(false);
          return;
        }

        const heroRes = await getHeroPost();
        setArticles(heroRes || []);
        setHeroLoading(false);

        const editorRes = await getEditorPick();
        setEditorPicks(editorRes || []);
        setRestLoading(false);

        await setCache('HOME_DATA', {
          articles: heroRes || [],
          editorPicks: editorRes || [],
        });
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setHeroLoading(false);
        setRestLoading(false);
      }
    },
    [isConnected],
  );

  // ------ Internet Listener ------
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return unsubscribe;
  }, []);

  // Initial Load
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // ------ CUSTOM HOOK ------
  const { refreshing, onRefresh } = useRefresh(() => fetchHomeData(true));

  //  Render Latest Articles with Grid for Tablet
  const renderLatestArticles = () => {
    if (heroLoading) return <HeroSkeleton />;

    return (
      <View style={{ marginTop: spacing.md }}>
        <Text
          style={[
            styles.heading,
            {
              fontSize: isTablet ? font.lg : 15,
              color: colors.text,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Latest Articles
        </Text>
         <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />

        {isTablet ? (
          <View style={styles.gridContainer}>
            {remainingCards.slice(0, 4).map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.gridItem,
                  {
                    width: '50%',
                    paddingRight: index % 2 === 0 ? spacing.sm : 0,
                    paddingLeft: index % 2 !== 0 ? spacing.sm : 0,
                    marginBottom: spacing.md,
                  }
                ]}
              >
                <ListCard
                  {...item}
                  date={formatDate(item)}
                  onPress={() => handleArticlePress(item)}
                />
              </View>
            ))}
          </View>
        ) : (
          <>
            {remainingCards.slice(0, 4).map(item => (
              <ListCard
                key={item.id}
                {...item}
                date={formatDate(item)}
                onPress={() => handleArticlePress(item)}
              />
            ))}
          </>
        )}
      </View>
    );
  };


  const statusBarColor = '#c9060a';
  const statusBarStyle = 'light-content';

  return (
    <MainLayout
      title="Home"
      routeName="Home"
      showHeader={true}
      showTopMenu={false}
      showBanner={false}
      scrollable={false}
      contentPadding={false}
      statusBarColor={statusBarColor}
      statusBarStyle={statusBarStyle}
    >
      {/*  Remove SafeAreaView wrapper - MainLayout already handles it */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: 0,
            paddingBottom: bottomPadding,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <TopMenu />

        {/* HERO SECTION */}
        {heroLoading ? (
          <HeroSkeleton />
        ) : (
          <View style={[styles.carouselWrapper, { marginBottom: spacing.md }]}>
            <Carousel
              loop
              autoPlay
              width={carouselWidth}
              height={HERO_HEIGHT}
              data={sliderData}
              autoPlayInterval={isTablet ? 3000 : 4000}
              scrollAnimationDuration={1200}
              renderItem={({ item, index }) => (
                <HeroCard
                  category={item.category}
                  title={item.title}
                  slug={item.slug}
                  date={formatDate(item)}
                  image={getImage(item.image)}
                  onLoadEnd={
                    index === 0 ? () => setHeroReady(true) : undefined
                  }
                  onPress={() => handleArticlePress(item)}
                />
              )}
              onSnapToItem={(index) => setActiveIndex(index)}
            />

          </View>
        )}

        {/* LATEST ARTICLES */}
        {!heroLoading && renderLatestArticles()}

        {/* ADVERTISEMENT */}
        <View
          style={[
            styles.graySectionWrapper,
            {
              paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
              paddingVertical: isTablet ? spacing.xl : spacing.lg,
              marginHorizontal: -horizontalPadding,
              marginVertical: spacing.md,
              backgroundColor: isDark ? colors.border : '#f8f8f8',
            },
          ]}
        >
          <HomeAdvertisement />
        </View>

        {/* EDITOR PICKS */}
        {restLoading ? (
          <View
            style={[
              styles.loadingBlock,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={{ color: colors.textSecondary }}>Loading...</Text>
          </View>
        ) : (
          <EditorPicksSection
            data={editorPicks}
            getImage={getImage}
            onPressItem={handleArticlePress}
          />
        )}

        {/* HOME BANNER */}
        <View style={{ marginVertical: spacing.md }}>
          <HomeBanner />
        </View>

        {/* LATEST EDITION */}
        <LatestEdition onData={setLatestEditionData} />

        {/* EDITORIAL */}
        <View style={{ marginVertical: spacing.sm }}>
          <EditorialCard onPressItem={handleEditorialPress} />
        </View>

        {/* MAGAZINES */}
        <View style={{ marginBottom: spacing.lg }}>
          <LatestEditions
            skipId={latestEditionData?.magazine?.id}
            onPressItem={handleMagazinePress}
            onPressViewAll={handleViewAllMagazines}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  carouselWrapper: {
    alignItems: 'center',
  },
  graySectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: '700',
  },
  loadingBlock: {
    padding: 20,
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {},
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    borderRadius: 4,
    marginHorizontal: 4,
  },
   accentBar: {
    width: 30,
    height: 3,
    marginTop: -8,
    marginBottom: 8,
    // marginLeft: 12,
  },

});