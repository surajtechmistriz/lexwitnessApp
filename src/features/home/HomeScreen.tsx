import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';

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
import TopMenu from '../../components/common/Menubar';

import { getCache, setCache, isCacheExpired } from '../../utils/cache';
import { useRefresh } from '../../hooks/useRefresh';

import HeroSkeleton from '../../skeleton/HeroSkeleton';
import ListSkeleton from '../../skeleton/ListSkeleton';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);

  const [heroLoading, setHeroLoading] = useState(true);
  const [restLoading, setRestLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // monitor network
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  // fetch data (hero first, then rest)
  const fetchHomeData = useCallback(
    async (force = false) => {
      try {
        const cached = await getCache('HOME_DATA');

        // use cache immediately
        if (cached?.data && !force) {
          setArticles(cached.data.articles || []);
          setEditorPicks(cached.data.editorPicks || []);
          setHeroLoading(false);
          setRestLoading(false);

          if (!isCacheExpired(cached.timestamp)) return;
        }

        if (!isConnected) return;

        // fetch hero first
        const heroRes = await getHeroPost();
        setArticles(heroRes || []);
        setHeroLoading(false);

        // fetch remaining data
        const editorRes = await getEditorPick();
        setEditorPicks(editorRes || []);
        setRestLoading(false);

        // cache data
        await setCache('HOME_DATA', {
          articles: heroRes || [],
          editorPicks: editorRes || [],
        });
      } catch (e) {
        console.log('Home error:', e);
      } finally {
        setHeroLoading(false);
        setRestLoading(false);
      }
    },
    [isConnected],
  );

  // initial load
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // pull-to-refresh
  const { refreshing, onRefresh } = useRefresh(() =>
    fetchHomeData(true),
  );

  // prefetch next page
  useEffect(() => {
    if (articles.length > 0) {
      getHeroPost({ page: 2 }).catch(() => {});
    }
  }, [articles]);

  // memoized data
  const sliderData = useMemo(() => articles.slice(0, 3), [articles]);
  const remainingCards = useMemo(() => articles.slice(3), [articles]);

  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  const HERO_HEIGHT = ((width - 24) * 9) / 16;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#c9060a']}
            tintColor="#c9060a"
          />
        }
      >
        <TopMenu />

        {/* Hero section */}
        {heroLoading ? (
          <HeroSkeleton />
        ) : (
          <View style={styles.carouselWrapper}>
            <Carousel
              loop
              width={width - 24}
              height={HERO_HEIGHT}
              autoPlay
              data={sliderData}
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
                />
              )}
            />
          </View>
        )}

        {/* List section */}
        {!heroReady ? (
          <ListSkeleton />
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.heading}>Latest Articles</Text>

            {remainingCards.slice(0, 4).map(item => (
              <ListCard
                key={item.id}
                category={item?.category}
                title={item.title}
                date={formatDate(item)}
                slug={item.slug}
                image={item.image}
              />
            ))}
          </View>
        )}

        {/* Advertisement */}
        <View style={styles.graySectionWrapper}>
          <HomeAdvertisement />
        </View>

        {/* Editor picks */}
        {restLoading ? (
          <View style={styles.loadingBlock}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <EditorPicksSection
            data={editorPicks}
            getImage={getImage}
          />
        )}

        <HomeBanner />

        <View style={styles.fullWidth}>
          <LatestEdition onData={setLatestEditionData} />
        </View>

        <EditorialCard />

        <View style={styles.fullWidth}>
          <LatestEditions
            skipId={latestEditionData?.magazine?.id}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingHorizontal: 12,
    // paddingTop: 10,
    paddingBottom: 40,
  },
  carouselWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  fullWidth: {
    marginHorizontal: -12,
  },
  listContainer: {},
  graySectionWrapper: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: -12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  loadingBlock: {
    padding: 20,
    alignItems: 'center',
  },
});

export default Home;