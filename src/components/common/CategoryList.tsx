import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
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

const CategoryList = () => {
  const navigation = useNavigation<any>();
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

  // Back button handler
  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategoryPress = (item: any) => {
    navigation.navigate('Category', {
      slug: item.slug,
    });
  };

  const renderItem = ({ item, index }: any) => {
    const design = getDesign(index);
    const categoryName = item.name || item.title;
    const articleCount = item.articles_count || item.count;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(item)}
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#1A1A1B" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSub}>Lex Witness Insights</Text>
        </View>
        
        <View style={styles.headerRight} />
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
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
        marginTop:-8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#111', 
marginLeft:6,
marginTop:6,
    letterSpacing: -0.6 
  },
  
  headerSub: { 
    fontSize: 12, 
    color: '#c9060a', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    marginTop: 2, 
    letterSpacing: 0.8 
  },
  
  headerRight: {
    width: 40,
  },
  
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 20 
  },
  
  row: { 
    justifyContent: 'space-between' 
  },

  card: {
    backgroundColor: '#fff',
    width: (width / 2) - 24,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
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
    minHeight: 120,
    justifyContent: 'center',
    zIndex: 2,
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

  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default CategoryList;