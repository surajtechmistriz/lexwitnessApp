import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../../components/common/Header';
import Banner from '../../components/common/DynamicBanner';
import YearFilter from '../../components/common/YearFilter';
import { getMagazines } from './api/magazine';
import { getYears } from '../../services/api/years';
import Config from 'react-native-config';
import Footer from '../../components/common/Footer';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20;
const imgUrl = Config.MAGAZINES_BASE_URL;

const MagazinesScreen = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // applied filter
  const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(null); // temporary selection
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearRes = await getYears();
        // if API returns objects, map to number
        const fetchedYears = yearRes?.data?.map((y: any) =>
          typeof y === 'number' ? y : y.year
        ) ?? [];
        // sort newest first
        setYears(fetchedYears.sort((a, b) => b - a));
      } catch (error) {
        console.error('Error fetching years', error);
      }
    };
    fetchYears();
  }, []);

  // Fetch magazines whenever selectedYear changes (after Apply)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Call API with selectedYear as param
        const magRes = await getMagazines({
          year: selectedYear ?? undefined,
          limit: 1000, // optional: large limit to fetch all for that year
        });

        setMagazines(magRes?.data ?? []);
      } catch (error) {
        console.error('Error fetching magazines', error);
        setMagazines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const filteredMagazines = magazines; // already filtered via API

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log('Pressed magazine', item)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `${imgUrl}/${item.image}` || 'https://via.placeholder.com/300x400' }}
          style={styles.image}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
  <Header />
  <Banner title="Magazines" />

  {/* TOP CONTENT (WITH PADDING) */}
  <View style={styles.content}>
    <Text style={styles.heading}>ALL EDITIONS MAGAZINE</Text>
    <View style={styles.underline} />

    <YearFilter
      years={years}
      selectedYear={tempSelectedYear}
      onSelect={setTempSelectedYear}
      onApply={() => setSelectedYear(tempSelectedYear)}
      disabled={loading}
    />
  </View>

  {/* FULL WIDTH LIST */}
  {loading ? (
    <ActivityIndicator size="large" color="#c9060a" style={{ marginTop: 50 }} />
  ) : filteredMagazines.length === 0 ? (
    <Text style={styles.emptyText}>
      {selectedYear
        ? `No magazines found for ${selectedYear}`
        : 'No magazines found'}
    </Text>
  ) : (
    <FlatList
      data={filteredMagazines}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 15, // 👈 apply padding HERE instead
        marginBottom: 15,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 10,
        paddingBottom: 20,
      }}
      ListFooterComponent={<Footer />} // ✅ now full width
    />
  )}
</View>
  );
};

export default MagazinesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 15, paddingTop: 15 },
  heading: { fontSize: 20, fontWeight: '600', color: '#333' },
  underline: { width: 50, height: 5, backgroundColor: '#c9060a', marginTop: 5, marginBottom: 15 },
  card: { width: ITEM_WIDTH },
  imageWrapper: { width: '100%', aspectRatio: 3 / 4, marginBottom: 5 },
  image: { width: '100%', height: '100%' },
  cardContent: { alignItems: 'center', paddingVertical: 5 },
  title: { fontSize: 13, color: '#333' },
  readMore: { color: '#c9060a', fontWeight: '500', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#333', paddingVertical: 50, fontSize: 14 },  footerWrapper: {
  marginHorizontal: -15, // cancel parent padding
  marginTop: 20,
}
});