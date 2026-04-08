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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMenu } from '../../services/api/category';
import { useTabBar } from '../../BotttomTabs/TabBarContext';

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
  const countDisplay = articleCount
    ? `${articleCount} Articles`
    : 'Explore';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
      navigation.navigate('HomeTab', {
  screen: 'CategoryScreen',
  params: {
    category: item.name,
    slug: item.slug,
  },
})
      }
    >
      <View style={[styles.accentBar, { backgroundColor: design.color }]} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {categoryName}
        </Text>

        <Text style={styles.cardCount}>{countDisplay}</Text>
      </View>
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
           onScroll={handleScroll}
            scrollEventThrottle={16} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fcfcfc' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1B' },
  headerSub: { fontSize: 16, color: '#c9060a', fontWeight: '500', marginTop: 2 },
  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  // card: {
  //   backgroundColor: '#fff',
  //   width: (width / 2) - 22,
  //   marginVertical: 10,
  //   paddingVertical: 25,
  //   borderRadius: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   // High-end Shadow
  //   elevation: 5,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
  //   borderWidth: 1,
  //   borderColor: '#f0f0f0',
  // },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18, // Squircle look
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  // cardTitle: {
  //   fontSize: 14,
  //   fontWeight: '700',
  //   color: '#1A1A1B',
  //   textAlign: 'center',
  //   paddingHorizontal: 10,
  //   lineHeight: 18,
  //   height: 36, // Ensure 2 lines look consistent
  // },
  // cardCount: {
  //   fontSize: 11,
  //   color: '#999',
  //   marginTop: 6,
  //   textTransform: 'uppercase',
  //   letterSpacing: 0.5,
  // },
  

card: {
  backgroundColor: '#fff',
  width: (width / 2) - 20,
  marginVertical: 10,
  borderRadius: 16,
  overflow: 'hidden',

  // Softer shadow (premium)
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,

  borderWidth: 1,
  borderColor: '#f3f3f3',
},

accentBar: {
  height: 3,
  width: '100%',
},

cardContent: {
  paddingVertical: 18,
  paddingHorizontal: 14,
  alignItems: 'center', //  center alignment looks cleaner
  justifyContent: 'center',
  minHeight: 90, //  equal height cards
},

cardTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#111',
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 6,
},

cardCount: {
  fontSize: 11,
  color: '#999',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
});

export default CategoryList;