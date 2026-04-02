import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '../../components/common/Header';
import Menubar from '../../components/common/Menubar';
import HeroSection from './sections/HeroSection';
import ListCard from './components/ListCard';
import EditorPicksSection from './sections/EditorPickSection';
import HomeAdvertisement from './components/HomeAdvertisement';
import HomeBanner from './components/HomeBanner';
import LatestEdition from './components/LatestEdition';
import LatestEditions from './components/Latest5Edition';
import EditorialCard from './components/Editorial';
import Footer from '../../components/common/Footer';

import { getHeroPost } from '../../services/api/heroCard';
import { getEditorPick } from '../../services/api/editorpicks';
import Config from 'react-native-config';
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions } from "react-native";
import HeroCard from './components/HeroCard';
const { width } = Dimensions.get("window");

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = ({ navigation, onScrollDown, onScrollUp }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //  ADD THIS
  const lastOffset = useRef(0);

  // ========================= API CALLS =========================
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

  // ========================= DATA DERIVATION =========================
  const sliderData = useMemo(() => articles?.slice(0, 3) || [], [articles]);
  const remainingCards = useMemo(() => articles?.slice(3) || [], [articles]);

  // ========================= HELPERS =========================
  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  // ========================= LOADING =========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // ========================= MAIN UI =========================
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}

        // 🔥 ADDED LOGIC (NO UI CHANGE)
       onScroll={(e) => {
  const currentOffset = e.nativeEvent.contentOffset.y;

  //  Always show when near top
  if (currentOffset <= 0) {
    onScrollUp && onScrollUp();
    lastOffset.current = 0;
    return;
  }

  const diff = currentOffset - lastOffset.current;

  //  Add threshold to avoid jitter
  if (Math.abs(diff) < 5) return;

  if (diff > 0) {
    // ⬇️ scrolling down → hide
    onScrollDown && onScrollDown();
  } else {
    // ⬆️ scrolling up → show
    onScrollUp && onScrollUp();
  }

  lastOffset.current = currentOffset;
}}
      >

        {/* ================= HERO SECTION ================= */}
        <Carousel
          loop
          width={width - 24}
          height={280}
          autoPlay={true}
          autoPlayInterval={1000}
          data={sliderData}
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

        {/* ================= LIST ================= */}
        <View style={styles.listContainer}>
          {remainingCards.map((item, index) => (
            <ListCard
              key={item.id}
              category={item?.category}
              title={item.title}
              date={formatDate(item)}
              isLast={index === remainingCards.length - 1}
              slug={item.slug}
            />
          ))}
        </View>

        {/* ================= AD ================= */}
        <View style={styles.graySectionWrapper}>
          <HomeAdvertisement />
        </View>

        {/* ================= EDITOR PICKS ================= */}
        <EditorPicksSection data={editorPicks} getImage={getImage} />

        {/* ================= BANNER ================= */}
        <HomeBanner />

        {/* ================= LATEST ================= */}
        <View style={styles.fullWidth}>
          <LatestEdition onData={setLatestEditionData} />
        </View>

        {/* ================= EDITORIAL ================= */}
        <EditorialCard />

        {/* ================= MORE EDITIONS ================= */}
        <View style={styles.fullWidth}>
          <LatestEditions skipId={latestEditionData?.magazine?.id} />
        </View>

      </ScrollView>
    </View>
  );
};

export default Home;

// ========================= STYLES =========================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 0 },

  listContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },

  fullWidth: { marginHorizontal: -12 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  graySectionWrapper: {
    backgroundColor: '#f5f5f5', // The gray background from your image
    // marginHorizontal: 0,     // This cancels out the ScrollView padding (12)
    paddingVertical: 40, // Adjusts the height of the gray area
    paddingHorizontal: 25, // Adds space inside the gray so the white box isn't touching the edges
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});
