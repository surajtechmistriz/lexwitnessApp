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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import Header from '../../components/common/Header';
import Banner from '../../components/common/DynamicBanner';
import YearFilter from '../../components/common/YearFilter';
import Footer from '../../components/common/Footer';
import { getMagazines } from './api/magazine';
import { getYears } from '../../services/api/years';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20;
const imgUrl = Config.MAGAZINES_BASE_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MagazinesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [tempSelectedYear, setTempSelectedYear] = useState<number | null>(null);
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await getYears();
        const fetchedYears = res?.data?.map((y: any) =>
          typeof y === 'number' ? y : y.year
        ) ?? [];
        setYears(fetchedYears.sort((a, b) => b - a));
      } catch (err) {
        console.error('Error fetching years', err);
      }
    };
    fetchYears();
  }, []);

  // Fetch magazines
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getMagazines({
          year: selectedYear ?? undefined,
          limit: 1000,
        });
        setMagazines(res?.data ?? []);
      } catch (err) {
        console.error('Error fetching magazines', err);
        setMagazines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MagazineDetail', { slug: item.slug })}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.image ? `${imgUrl}/${item.image}` : 'https://via.placeholder.com/300x400',
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title || item.magazine_name}</Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Banner title="Magazines" />

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

      {loading ? (
        <ActivityIndicator size="large" color="#c9060a" style={{ marginTop: 50 }} />
      ) : magazines.length === 0 ? (
        <Text style={styles.emptyText}>
          {selectedYear
            ? `No magazines found for ${selectedYear}`
            : 'No magazines found'}
        </Text>
      ) : (
        <FlatList
          data={magazines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            marginBottom: 15,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
          ListFooterComponent={<Footer />}
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
  title: { fontSize: 13, color: '#333', textAlign: 'center' },
  readMore: { color: '#c9060a', fontWeight: '500', marginTop: 4 },

  emptyText: { textAlign: 'center', color: '#333', paddingVertical: 50, fontSize: 14 },

  footerWrapper: { marginHorizontal: -15, marginTop: 20 },
});