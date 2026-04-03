import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Config from 'react-native-config';

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
import Footer from '../../components/common/Footer';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = ({ onScrollDown, onScrollUp }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lastOffset = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
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
  }, []);

  const sliderData = useMemo(() => articles?.slice(0, 3) || [], [articles]);
  const remainingCards = useMemo(() => articles?.slice(3) || [], [articles]);

  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        {/* ================= HERO CAROUSEL ================= */}
        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            width={width - 24}
            height={280}
            autoPlay={true}
            autoPlayInterval={3000} // Set to 3s for better UX
            data={sliderData}
            // FIX: Prevents vertical scroll interference
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

        {/* ================= LIST SECTION ================= */}
        {/* <View style={styles.listContainer}>
          {remainingCards.map((item, index) => (
            <ListCard
              key={item.id || index}
              category={item?.category}
              title={item.title}
              date={formatDate(item)}
              isLast={index === remainingCards.length - 1}
              slug={item.slug}
            />
          ))}
        </View> */}

 {/* 2x2 Grid Container */}
<View style={styles.gridContainer}>
  {remainingCards.map((item) => (
    <ListCard
      key={item.id}
      category={item?.category}
      title={item.title}
      date={formatDate(item)}
      image={getImage(item.image)}
      slug={item.slug}
    />
  ))}
</View>





        {/* ================= ADVERTISEMENT ================= */}
        <View style={styles.graySectionWrapper}>
          <HomeAdvertisement />
        </View>

        {/* ================= EDITOR PICKS (Horizontal) ================= */}
        <EditorPicksSection data={editorPicks} getImage={getImage} />

        <HomeBanner />

        {/* ================= LATEST EDITION ================= */}
        <View style={styles.fullWidth}>
          <LatestEdition onData={setLatestEditionData} />
        </View>

        <EditorialCard />

        {/* ================= LATEST 5 EDITIONS (Horizontal) ================= */}
        <View style={styles.fullWidth}>
          <LatestEditions skipId={latestEditionData?.magazine?.id} />
        </View>
        
        {/* <Footer /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 20 },
  carouselWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  fullWidth: { marginHorizontal: -12 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
gridContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  // Remove paddingHorizontal here because scrollContent already has it
  paddingTop: 20,
  backgroundColor: '#fff',
},
  graySectionWrapper: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: -12, // Stretch to edges
  },
});

export default Home;