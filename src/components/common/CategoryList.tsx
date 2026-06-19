import React, { useEffect, useState } from 'react';
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
import { useTheme } from '../../redux/useTheme';

const { width } = Dimensions.get('window');

// ------ Optimized design mapping for Lex Witness ------
const getDesign = (index: number) => {
  const designs = [
    { title: 'Arbitration', icon: 'gavel', color: '#1a5f7a', type: 'mci' },
    {
      title: 'Banking & Finance',
      icon: 'bank-outline',
      color: '#c9060a',
      type: 'mci',
    },
    { title: 'CSR', icon: 'handshake-outline', color: '#27ae60', type: 'mci' },
    {
      title: 'IPR',
      icon: 'shield-check-outline',
      color: '#f39c12',
      type: 'mci',
    },
    {
      title: 'Legal Updates',
      icon: 'newspaper-outline',
      color: '#2980b9',
      type: 'mci',
    },
    {
      title: 'Real Estate',
      icon: 'office-building-marker-outline',
      color: '#8e44ad',
      type: 'mci',
    },
    {
      title: 'Tete-a-Tete',
      icon: 'microphone-outline',
      color: '#d35400',
      type: 'mci',
    },
    {
      title: 'Expert Views',
      icon: 'scale-balance',
      color: '#2c3e50',
      type: 'mci',
    },
  ];
  return designs[index % designs.length];
};

const CategoryList = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
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

  // ------Back button handler------
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
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: isDark ? '#000' : '#000',
          },
        ]}
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(item)}
      >
        {/* Top Accent Bar for visual distinction */}
        <View style={[styles.accentBar, { backgroundColor: design.color }]} />

        <View style={styles.cardContent}>
          {/* Category Name - Larger and bolder */}
          <Text
            style={[styles.cardTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {categoryName}
          </Text>

          {/* Article Count - Clean pill design */}
          <View
            style={[
              styles.badgeContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: design.color }]} />
            <Text style={[styles.cardCount, { color: colors.textMuted }]}>
              {articleCount ? `${articleCount} Articles` : 'Explore'}
            </Text>
          </View>
        </View>

        {/* Subtle background hint of the color at the bottom corner */}
        <View
          style={[
            styles.bottomCorner,
            { backgroundColor: design.color + '08' },
          ]}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.textMuted }}>
          Loading Insights...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#F9FAFB'}
      />

      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' },
          ]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Categories
          </Text>
          <Text style={[styles.headerSub, { color: colors.primary }]}>
            Lex Witness Insights
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: colors.background },
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },

  headerContent: {
    flex: 1,
    marginLeft: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 6,
    marginTop: 6,
    letterSpacing: -0.6,
  },

  headerSub: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.8,
  },

  headerRight: {
    width: 40,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: width / 2 - 24,
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
    lineHeight: 22,
    marginBottom: 10,
  },

  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
  },
});

export default CategoryList;
