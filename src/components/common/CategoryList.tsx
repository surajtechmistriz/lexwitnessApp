import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { getMenu } from '../../services/api/category';

const { width } = Dimensions.get('window');

// Optimized design mapping for Lex Witness
const getDesign = (index: number) => {
  const designs = [
    { title: 'Arbitration', icon: 'gavel', color: '#1a5f7a', type: 'mci' },
    { title: 'Banking & Finance', icon: 'bank-outline', color: '#c9060a', type: 'mci' },
    { title: 'CSR', icon: 'handshake-outline', color: '#27ae60', type: 'mci' },
    { title: 'IPR', icon: 'shield-check-outline', color: '#f39c12', type: 'mci' },
    { title: 'Legal Updates', icon: 'newspaper-outline', color: '#2980b9', type: 'mci' },
    { title: 'Real Estate', icon: 'office-building-marker-outline', color: '#8e44ad', type: 'mci' },
    { title: 'Tete-a-Tete', icon: 'microphone-outline', color: '#d35400', type: 'mci' },
    { title: 'Expert Views', icon: 'scale-balance', color: '#2c3e50', type: 'mci' },
  ];
  return designs[index % designs.length];
};

const CategoryList = ({ navigation }: any) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

 
 

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getMenu();
      const data = res?.data || res || [];
      setCategories(data);
    } catch (err) {
      console.log('Category Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

const renderItem = ({ item, index }: any) => {
  const design = getDesign(index);
  const categoryName = item.name || item.title;
  const articleCount = item.articles_count || item.count;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('HomeTab', {
          screen: 'Category',
          params: { category: item.name, slug: item.slug },
        })
      }
    >
      {/* Top Accent Bar for visual distinction */}
      <View style={[styles.accentBar, { backgroundColor: design.color }]} />

      <View style={styles.cardContent}>
        {/* Category Name - Larger and bolder */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {categoryName}
        </Text>

        {/* Article Count - Clean pill design */}
        <View style={styles.badgeContainer}>
           <View style={[styles.dot, { backgroundColor: design.color }]} />
           <Text style={styles.cardCount}>
            {articleCount ? `${articleCount} Articles` : 'Explore'}
          </Text>
        </View>
      </View>
      
      {/* Subtle background hint of the color at the bottom corner */}
      <View style={[styles.bottomCorner, { backgroundColor: design.color + '08' }]} />
    </TouchableOpacity>
  );
};
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c9060a" />
        <Text style={{ marginTop: 10, color: '#777' }}>Loading Insights...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSub}>Lex Witness Insights</Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
     
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  
  header: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 16 },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#111', letterSpacing: -0.6 },
  headerSub: { fontSize: 13, color: '#c9060a', fontWeight: '700', textTransform: 'uppercase', marginTop: 4, letterSpacing: 1 },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },

  card: {
    backgroundColor: '#fff',
    width: (width / 2) - 24,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative', // for the corner accent
    // App-style soft shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  accentBar: {
    height: 4,
    width: '100%',
  },

  cardContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    minHeight: 120, // Uniform card height
    justifyContent: 'center',
    zIndex: 2, // Stay above the corner accent
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1B',
    lineHeight: 22,
    marginBottom: 10,
  },

  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  cardCount: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  bottomCorner: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
  },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CategoryList;