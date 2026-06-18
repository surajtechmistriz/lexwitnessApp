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
import { useNavigation } from '@react-navigation/native';

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

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = () => {
  const navigation = useNavigation<any>();
  
  // ===== ALL HOOKS AT TOP (SAME ORDER EVERY RENDER) =====
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [restLoading, setRestLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // ===== useMemo HOOKS =====
  const sliderData = useMemo(() => articles.slice(0, 3), [articles]);
  const remainingCards = useMemo(() => articles.slice(3), [articles]);

  // ===== useCallback HOOKS (SAB SE PEHLE) =====
  
  // 1. Format Date
  const formatDate = useCallback((item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  }, []);

  // 2. Get Image
  const getImage = useCallback((img: string) => {
    return `${IMAGE_BASE_URL}/${img}`;
  }, []);

  // 3. Get Hero Height
  const HERO_HEIGHT = useMemo(() => ((width - 24) * 9) / 16, []);

  // 4. Open Article Detail
  const handleArticlePress = useCallback((item: any) => {
    navigation.navigate('ArticleDetail', {
      slug: item.slug,
      id: item.id,
    });
  }, [navigation]);

  // 5. Open Magazine Detail
  const handleMagazinePress = useCallback((item: any) => {
    navigation.navigate('MagazineDetail', {
      slug: item.slug,
    });
  }, [navigation]);

  // 6. View All Magazines - FIXED: Navigate to tab instead of screen
  const handleViewAllMagazines = useCallback(() => {
    // Navigate to the Magazines tab (keeps bottom tabs visible)
    navigation.navigate('MagazinesTab');
  }, [navigation]);

  // 7. Open Category
  const handleCategoryPress = useCallback((category: any) => {
    navigation.navigate('Category', {
      categoryId: category.id,
      categoryName: category.name,
    });
  }, [navigation]);

  // 8. Open Author
  const handleAuthorPress = useCallback((author: any) => {
    navigation.navigate('Author', {
      authorId: author.id,
      authorName: author.name,
    });
  }, [navigation]);

  // 9. Open Archive
  const handleArchivePress = useCallback(() => {
    navigation.navigate('Archive');
  }, [navigation]);

  // 10. Open Editorial
  const handleEditorialPress = useCallback((item: any) => {
    navigation.navigate('EditorialDetail', {
      editorialId: item.id,
    });
  }, [navigation]);

  // 11. Fetch Home Data
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
      } catch (e) {
        console.log('Home error:', e);
      } finally {
        setHeroLoading(false);
        setRestLoading(false);
      }
    },
    [isConnected],
  );

  // ===== useEffect HOOKS =====
  
  // Internet Listener
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

  // ===== CUSTOM HOOK =====
  const { refreshing, onRefresh } = useRefresh(() => fetchHomeData(true));

  // ===== RENDER =====
  return (
    <MainLayout 
      title="Home" 
      routeName="Home"
      showHeader={true}
      showTopMenu={false}
      showBanner={false}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
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

          {/* HERO SECTION */}
          {heroLoading ? (
            <HeroSkeleton />
          ) : (
            <View style={styles.carouselWrapper}>
              <Carousel
                loop
                autoPlay
                width={width - 24}
                height={HERO_HEIGHT}
                data={sliderData}
                renderItem={({ item, index }) => (
                  <HeroCard
                    category={item.category}
                    title={item.title}
                    slug={item.slug}
                    date={formatDate(item)}
                    image={getImage(item.image)}
                    onLoadEnd={index === 0 ? () => setHeroReady(true) : undefined}
                    onPress={() => handleArticlePress(item)}
                  />
                )}
              />
            </View>
          )}

          {/* LATEST ARTICLES */}
          {!heroReady ? (
            <ListSkeleton />
          ) : (
            <View>
              <Text style={styles.heading}>Latest Articles</Text>
              {remainingCards.slice(0, 4).map(item => (
                <ListCard
                  key={item.id}
                  {...item}
                  date={formatDate(item)}
                  onPress={() => handleArticlePress(item)}
                />
              ))}
            </View>
          )}

          {/* ADVERTISEMENT */}
          <View style={styles.graySectionWrapper}>
            <HomeAdvertisement />
          </View>

          {/* EDITOR PICKS */}
          {restLoading ? (
            <View style={styles.loadingBlock}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <EditorPicksSection
              data={editorPicks}
              getImage={getImage}
              onPressItem={handleArticlePress}
            />
          )}

          {/* HOME BANNER */}
          <HomeBanner />

          {/* LATEST EDITION */}
          <LatestEdition onData={setLatestEditionData} />

          {/* EDITORIAL */}
          <EditorialCard onPressItem={handleEditorialPress} />

          {/* MAGAZINES */}
          <LatestEditions
            skipId={latestEditionData?.magazine?.id}
            onPressItem={handleMagazinePress}
            onPressViewAll={handleViewAllMagazines}
          />
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 0,
  },
  carouselWrapper: {
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
    marginTop: 20,
    color: '#333',
  },
  loadingBlock: {
    padding: 20,
    alignItems: 'center',
  },
});