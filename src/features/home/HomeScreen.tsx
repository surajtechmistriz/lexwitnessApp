import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

// Components
import HeroCard from './components/HeroCard';
import ListCard from './components/ListCard';
import EditorPicksSection from './sections/EditorPickSection';
import HomeAdvertisement from './components/HomeAdvertisement';
import HomeBanner from './components/HomeBanner';
import LatestEdition from './components/LatestEdition';
import LatestEditions from './components/Latest5Edition';
import EditorialCard from './components/Editorial';

// API
import { getHeroPost } from '../../services/api/heroCard';
import { getEditorPick } from '../../services/api/editorpicks';
import HomeSkeleton from '../../skeleton/HomeSkeleton';
import TopMenu from '../../components/common/Menubar';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = ({ onScrollDown, onScrollUp }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const lastOffset = useRef(0);

  // 1. Listen for Network Changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data (Triggers on mount AND when isConnected changes to true)
  useEffect(() => {
    const fetchData = async () => {
      // If we know we are offline, show skeleton and don't even try the API
      if (isConnected === false) {
        setLoading(true);
        return;
      }

      setLoading(true);
      try {
        const [heroRes, editorRes] = await Promise.all([
          getHeroPost(),
          getEditorPick(),
        ]);
        setArticles(heroRes || []);
        setEditorPicks(editorRes || []);
      } catch (error) {
        console.log('Home API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected]); // Re-run when connection status changes

  const sliderData = useMemo(() => articles?.slice(0, 3) || [], [articles]);
  const remainingCards = useMemo(() => articles?.slice(3) || [], [articles]);

  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  // 3. Show Skeleton if loading OR if there's no internet
  if (loading || isConnected === false) {
    return <HomeSkeleton />;
  }

  return (
    <View style={styles.container}>
      <TopMenu/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={e => {
          const currentOffset = e.nativeEvent.contentOffset.y;
          if (currentOffset <= 0) {
            onScrollUp?.();
            lastOffset.current = 0;
            return;
          }
          const diff = currentOffset - lastOffset.current;
          if (Math.abs(diff) < 5) return;
          if (diff > 0) onScrollDown?.();
          else onScrollUp?.();
          lastOffset.current = currentOffset;
        }}
      >
        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            width={width - 24}
            height={280}
            autoPlay={true}
            autoPlayInterval={2000}
            data={sliderData}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            renderItem={({ item }) => (
              <HeroCard
                category={item.category}
                title={item.title}
                slug={item.slug}
                date={formatDate(item)}
                image={getImage(item.image)}
                height={280}
              />
            )}
          />
        </View>

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

        <View style={styles.graySectionWrapper}>
          <HomeAdvertisement />
        </View>

        <EditorPicksSection data={editorPicks} getImage={getImage} />

        <HomeBanner />

        <View style={styles.fullWidth}>
          <LatestEdition onData={setLatestEditionData} />
        </View>

        <EditorialCard />

        <View style={styles.fullWidth}>
          <LatestEditions skipId={latestEditionData?.magazine?.id} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 40 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 20 },
  carouselWrapper: { marginBottom: 20, alignItems: 'center' },
  fullWidth: { marginHorizontal: -12 },
  // gridContainer: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  //   paddingTop: 20,
  //   backgroundColor: '#fff',
  // },
  listContainer: {
    marginTop: 10,
  },
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
    fontWeight: 700,
    marginBottom: 10,
  },
});

export default Home;
