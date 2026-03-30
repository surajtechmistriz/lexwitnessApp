import React, { useEffect, useState, useMemo } from 'react';
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

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const IMAGE_BASE_URL = Config.POSTS_BASE_URL;

const Home = ({ navigation }: Props) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  const { firstCard, nextTwoCards, remainingCards } = useMemo(
    () => ({
      firstCard: articles?.[0] || null,
      nextTwoCards: articles?.slice(1, 3) || [],
      remainingCards: articles?.slice(3) || [],
    }),
    [articles],
  );

  // ========================= HELPERS =========================
  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  // ========================= LOADING STATE =========================
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
      {/* <Header /> */}
      {/* <Menubar /> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= HERO SECTION ================= */}
        <HeroSection
          firstCard={firstCard}
          nextTwoCards={nextTwoCards}
          formatDate={formatDate}
          getImage={getImage}
        />

        {/* ================= LIST SECTION ================= */}
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

        {/* ================= ADVERTISEMENT ================= */}
        <View style={styles.graySectionWrapper}>
          <HomeAdvertisement />
        </View>
        {/* ================= EDITOR PICKS ================= */}
        <EditorPicksSection data={editorPicks} getImage={getImage} />

        {/* ================= SUBSCRIPTION BANNER ================= */}
        <HomeBanner />

        {/* ================= LATEST EDITION ================= */}
        <View style={styles.fullWidth}>
          <LatestEdition onData={setLatestEditionData} />
        </View>

        {/* ================= EDITORIAL ================= */}
        <EditorialCard />

        {/* ================= LATEST 5 EDITIONS ================= */}
        <View style={styles.fullWidth}>
          <LatestEditions skipId={latestEditionData?.magazine?.id} />
        </View>

        {/* ================= FOOTER ================= */}
        <View style={styles.fullWidth}>
          <Footer />
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
