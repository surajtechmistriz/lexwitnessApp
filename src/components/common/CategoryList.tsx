import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../store/hooks/useTheme';
import { getMenu } from '../../services/category.service';

interface Category {
  id?: number | string;
  slug?: string;
  name?: string;
  title?: string;
  articles_count?: number;
  count?: number;
}

type ThemeColors = ReturnType<typeof useTheme>['colors'];

const categoryColors = [
  '#1a5f7a',
  '#c9060a',
  '#27ae60',
  '#f39c12',
  '#2980b9',
  '#8e44ad',
  '#d35400',
  '#2c3e50',
];

const categoryStyles = categoryColors.map(color =>
  StyleSheet.create({
    accentBar: {
      backgroundColor: color,
    },
    dot: {
      backgroundColor: color,
    },
    bottomCorner: {
      backgroundColor: `${color}08`,
    },
  }),
);

const CategoryList = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark],
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await getMenu();
        const data = res?.data ?? res ?? [];

        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log('Category Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (item: Category) => {
    navigation.navigate('Category', {
      slug: item.slug,
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: Category;
    index: number;
  }) => {
    const design = categoryStyles[index % categoryStyles.length];
    const categoryName = item.name || item.title;
    const articleCount = item.articles_count ?? item.count;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(item)}
      >
        <View style={[styles.accentBar, design.accentBar]} />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {categoryName}
          </Text>

          <View style={styles.badgeContainer}>
            <View style={[styles.dot, design.dot]} />

            <Text style={styles.cardCount}>
              {articleCount != null
                ? `${articleCount} Articles`
                : 'Explore'}
            </Text>
          </View>
        </View>

        <View style={[styles.bottomCorner, design.bottomCorner]} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Insights...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDark ? '#121212' : '#c9060a'}
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#c9060a" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>All Categories</Text>
            <Text style={styles.headerSub}>Lex Witness Insights</Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        <FlatList
          style={styles.list}
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? item.slug ?? index.toString()
          }
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
};

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingBottom: 80,
      backgroundColor: colors.primary,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 18,
      backgroundColor: colors.background,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -8,
      backgroundColor: isDark
        ? colors.border
        : 'rgba(0,0,0,0.05)',
    },

    headerContent: {
      flex: 1,
      marginLeft: 8,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      marginLeft: 6,
      marginTop: 6,
      letterSpacing: -0.6,
      color: colors.text,
    },

    headerSub: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginTop: 2,
      letterSpacing: 0.8,
      color: colors.primary,
    },

    headerRight: {
      width: 40,
    },

    list: {
      flex: 1,
      backgroundColor: colors.background,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },

    row: {
      justifyContent: 'space-between',
    },

    card: {
      width: '48%',
      marginVertical: 8,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      backgroundColor: colors.card,
      borderColor: colors.border,
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
      fontWeight: '600',
      lineHeight: 22,
      marginBottom: 10,
      color: colors.text,
    },

    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.background,
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
      color: colors.textMuted,
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
      backgroundColor: colors.background,
    },

    loadingText: {
      marginTop: 10,
      color: colors.textMuted,
    },
  });

export default CategoryList;