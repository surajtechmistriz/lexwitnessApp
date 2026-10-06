import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';

import MainLayout from '../../MainLayout';
import TopMenu from '../../components/layout/Menubar';
import { useRefresh } from '../../hooks/useRefresh';
import { useResponsive } from '../../hooks/useResponsive';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';
import { useTheme } from '../../store/hooks/useTheme';
import HeroSkeleton from '../../skeleton/HeroSkeleton';
import { getCache, isCacheExpired, setCache } from '../../utils/cache';

import { getEditorPick, getHeroPost } from '../../services/home.service';
import EditorialCard from './components/Editorial';
import EditorPicksSection from './sections/EditorPickSection';
import HeroCard from './components/HeroCard';
import HomeAdvertisement from './components/HomeAdvertisement';
import HomeBanner from './components/HomeBanner';
import LatestEditions from './components/Latest5Edition';
import LatestEdition from './components/LatestEdition';
import ListCard from './components/ListCard';

const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { spacing, font, isTablet } = useResponsive();
  const tabBarHeight = useTabBarHeight();
  const { width } = useWindowDimensions();

  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [restLoading, setRestLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const sliderData = articles.slice(0, 3);
  const remainingCards = articles.slice(3);

  const horizontalPadding = isTablet ? spacing.lg : spacing.md;
  const carouselWidth = width - horizontalPadding * 2;
  const heroHeight = carouselWidth * (9 / 16);
  const bottomPadding = tabBarHeight - spacing.lg;

  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';

    return `${month} ${year}`;
  };

  const getImage = (image: string) => `${IMAGE_BASE_URL}/${image}`;

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

        const heroResponse = await getHeroPost();

        setArticles(heroResponse || []);
        setHeroLoading(false);

        const editorResponse = await getEditorPick();

        setEditorPicks(editorResponse || []);
        setRestLoading(false);

        await setCache('HOME_DATA', {
          articles: heroResponse || [],
          editorPicks: editorResponse || [],
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const { refreshing, onRefresh } = useRefresh(() => fetchHomeData(true));

  const renderLatestArticles = () => {
    if (heroLoading) {
      return <HeroSkeleton />;
    }

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
                  },
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

  return (
    <MainLayout
      title="Home"
      routeName="Home"
      showHeader
      showTopMenu={false}
      showBanner={false}
      scrollable={false}
      contentPadding={false}
      statusBarColor="#c9060a"
      statusBarStyle="light-content"
    >
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

        {heroLoading ? (
          <HeroSkeleton />
        ) : (
          <View style={[styles.carouselWrapper, { marginBottom: spacing.md }]}>
            <Carousel
              loop
              autoPlay
              width={carouselWidth}
              height={heroHeight}
              data={sliderData}
              autoPlayInterval={isTablet ? 3000 : 4000}
              scrollAnimationDuration={1200}
              renderItem={({ item }) => (
                <HeroCard
                  category={item.category}
                  title={item.title}
                  slug={item.slug}
                  date={formatDate(item)}
                  image={getImage(item.image)}
                  onPress={() => handleArticlePress(item)}
                />
              )}
            />
          </View>
        )}

        {!heroLoading && renderLatestArticles()}

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

        <View style={{ marginVertical: spacing.md }}>
          <HomeBanner />
        </View>

        <LatestEdition onData={setLatestEditionData} />

        <View style={{ marginVertical: spacing.sm }}>
          <EditorialCard onPressItem={handleEditorialPress} />
        </View>

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
    fontWeight: '600',
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

  accentBar: {
    width: 30,
    height: 3,
    marginTop: -8,
    marginBottom: 8,
  },
});
