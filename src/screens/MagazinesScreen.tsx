import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';
import Banner from '../components/DynamicBanner/DynamicBanner';



const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20;

const magazines = [
  { id: 1, title: 'Jan 2024', image: 'https://via.placeholder.com/300x400' },
  { id: 2, title: 'Feb 2024', image: 'https://via.placeholder.com/300x400' },
  { id: 3, title: 'Mar 2024', image: 'https://via.placeholder.com/300x400' },
  { id: 4, title: 'Apr 2024', image: 'https://via.placeholder.com/300x400' },
];

const MagazinesScreen = () => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= BANNER ================= */}
      <Banner title="Magazines" />

      {/* ================= CONTENT ================= */}
      <View style={styles.content}>
        <Text style={styles.heading}>ALL EDITIONS MAGAZINE</Text>
        <View style={styles.underline} />

        {/* Filter UI (same position as web) */}
        <View style={styles.filterBox}>
          <Text style={styles.filterText}>Select Year</Text>
        </View>

        {/* Grid */}
        <FlatList
          data={magazines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default MagazinesScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  underline: {
    width: 50,
    height: 5,
    backgroundColor: '#c9060a',
    marginTop: 5,
    marginBottom: 15,
  },

  filterBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
  },

  filterText: {
    color: '#333',
  },

  card: {
    width: ITEM_WIDTH,
    marginBottom: 20,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },

  cardContent: {
    paddingVertical: 8,
    alignItems: 'center',
  },

  title: {
    fontSize: 13,
    color: '#333',
  },

  readMore: {
    color: '#c9060a',
    fontWeight: '500',
    marginTop: 4,
  },
});