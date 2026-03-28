import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/* ---------- TYPES ---------- */

type HeroCardProps = {
  category: any;
  title: string;
  slug: string;
  date?: string;
  isLast?: boolean;
};

type RootStackParamList = {
  CategoryScreen: { slug: string; category: string };
  ArticleDetail: { slug: string; category: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* ---------- COMPONENT ---------- */

const ListCard = ({
  category,
  title,
  slug,
  date,
  isLast,
}: HeroCardProps) => {
  
  const navigation = useNavigation<NavigationProp>();

  // category name
  const categoryName =
    typeof category === 'string' ? category : category?.name;

  // category slug
  const categorySlug = category?.slug ?? 'general';

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* category click */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CategoryScreen', {
              slug: categorySlug,
              category: categorySlug, // ✅ required param
            })
          }
        >
          <Text style={styles.categoryText}>{categoryName}</Text>
        </TouchableOpacity>

        {/* article click */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('ArticleDetail', {
              slug: slug,
              category: categorySlug,
            })
          }
        >
          <Text style={styles.titleText}>{title}</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* separator */}
      {!isLast && <View style={styles.separator} />}
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 14,
  },
  categoryText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleText: {
    color: '#333',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 4,
  },
  dateText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#e6dddd',
    borderStyle: 'dashed',
  },
});

export default ListCard;