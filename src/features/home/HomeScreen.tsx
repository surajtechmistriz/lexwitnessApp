import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import this
import Carousel from 'react-native-reanimated-carousel';
import Config from 'react-native-config';
import NetInfo from '@react-native-community/netinfo';

// Components
import HeroCard from './components/HeroCard';
import ListCard from './components/ListCard';
import EditorPicksSection from './sections/EditorPickSection';
import HomeAdvertisement from './components/HomeAdvertisement';
import HomeBanner from './components/HomeBanner';
import LatestEdition from './components/LatestEdition';
import LatestEditions from './components/Latest5Edition';
import EditorialCard from './components/Editorial';
import { useTabBar } from '../../BotttomTabs/TabBarContext';
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

  const { hideTabBar, showTabBar } = useTabBar();
  const scrollOffset = useRef(0);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;

    if (currentOffset <= 0) {
      showTabBar();
    } else if (diff > 10) {
      hideTabBar();
    } else if (diff < -10) {
      showTabBar();
    }

    scrollOffset.current = currentOffset;
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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
  }, [isConnected]);

  const sliderData = useMemo(() => articles?.slice(0, 3) || [], [articles]);
  const remainingCards = useMemo(() => articles?.slice(3) || [], [articles]);

  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  if (loading || isConnected === false) {
    return <HomeSkeleton />;
  }

  return (
    // SafeAreaView with 'top' edge prevents notch overlap
    // 'bottom' is usually handled by TabBar, so we focus on the top.
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />
      
      <TopMenu />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
              <View style={{ paddingHorizontal: 2 }}>
                <HeroCard
                  category={item.category}
                  title={item.title}
                  slug={item.slug}
                  date={formatDate(item)}
                  image={getImage(item.image)}
                  height={280}
                />
              </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f7' 
  },
  scrollContent: { 
    paddingHorizontal: 12, 
    paddingTop: 10, 
    paddingBottom: 40 // Extra padding for bottom stability
  },
  carouselWrapper: { 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  fullWidth: { 
    marginHorizontal: -12 
  },
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
    fontWeight: '700', // String recommended for weight
    marginBottom: 10,
    color: '#333',
  },
});

export default Home;