import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '../components/Header';
import Menubar from '../components/Menubar';
import HeroCard from '../components/HeroCard';
import ListCard from '../components/ListCard/ListCard';
import EditorPicks from '../components/EditorPicks/EditorPicks';
import HomeAdvertisement from '../components/Advertisement/HomeAdvertisement';
import HomeBanner from '../components/subscrineBanner/HomeBanner';
import LatestEdition from '../components/HomeLatestEdition/LatestEdition';
import LatestEditions from '../components/HomeLatest5Edition/Latest5Edition';
import EditorialCard from '../components/Editorial/Editorial';
import Footer from '../components/Footer';

import { getHeroPost } from '../services/api/heroCard';
import { getEditorPick } from '../services/api/editorpicks';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const IMAGE_BASE_URL = 'https://admin.lexwitness.com/uploads/posts';

const Home = ({ navigation }: Props) => {
  /**
   * =========================
   * STATE MANAGEMENT
   * =========================
   */
  const [articles, setArticles] = useState<any[]>([]);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [latestEditionData, setLatestEditionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * API CALLS
   * =========================
   * Fetch hero posts and editor picks in parallel
   */
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

  /**
   * =========================
   * DATA DERIVATION
   * =========================
   * Split articles into sections for layout
   */
  const { firstCard, nextTwoCards, remainingCards } = useMemo(() => {
    return {
      firstCard: articles?.[0] || null,
      nextTwoCards: articles?.slice(1, 3) || [],
      remainingCards: articles?.slice(3) || [],
    };
  }, [articles]);

  /**
   * =========================
   * HELPERS
   * =========================
   */
  const formatDate = (item: any) => {
    const month = item?.magazine?.month?.name || '';
    const year = item?.magazine?.year || '';
    return `${month} ${year}`;
  };

  const getImage = (img: string) => `${IMAGE_BASE_URL}/${img}`;

  /**
   * =========================
   * LOADING STATE
   * =========================
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /**
   * =========================
   * MAIN UI
   * =========================
   */
  return (
    <View style={styles.container}>
      <Header />
      <Menubar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= HERO SECTION ================= */}
        {firstCard && (
          <HeroCard
            category={firstCard?.category?.name}
            title={firstCard.title}
            date={formatDate(firstCard)}
            image={getImage(firstCard.image)}
            height={450}
          />
        )}

        {/* ================= SECONDARY HERO CARDS ================= */}
        <View style={styles.columnContainer}>
          {nextTwoCards.map((item) => (
            <HeroCard
              key={item.id}
              category={item?.category?.name}
              title={item.title}
              date={formatDate(item)}
              image={getImage(item.image)}
              height={220}
              style={{ width: '100%' }}
            />
          ))}
        </View>

        {/* ================= LIST SECTION ================= */}
        <View style={styles.listContainer}>
          {remainingCards.map((item, index) => (
            <ListCard
              key={item.id}
              category={item?.category?.name}
              title={item.title}
              date={formatDate(item)}
              isLast={index === remainingCards.length - 1}
            />
          ))}
        </View>

        {/* ================= ADVERTISEMENT ================= */}
        <HomeAdvertisement />

        {/* ================= EDITOR PICKS ================= */}
        <View style={styles.sectionWrapper}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EDITOR PICKS</Text>
            <View style={styles.sectionUnderline} />
          </View>

          {editorPicks.map((item) => (
            <EditorPicks
              key={item.id}
              image={getImage(item.image)}
              title={item.title}
              author={item.author?.name}
            />
          ))}
        </View>

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

/**
 * =========================
 * STYLES
 * =========================
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
  },

  /**
   * Column layout for stacked hero cards
   */
  columnContainer: {
    marginVertical: 10,
    gap: 10,
  },

  /**
   * List container for remaining articles
   */
  listContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },

  /**
   * Section wrapper (Editor Picks)
   */
  sectionWrapper: {
    marginVertical: 10,
  },

  sectionHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  sectionUnderline: {
    height: 5,
    width: 60,
    marginTop: 5,
    backgroundColor: '#e60000',
  },

  /**
   * Used to break out of ScrollView padding
   * for full-width components like Footer & banners
   */
  fullWidth: {
    marginHorizontal: -12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});