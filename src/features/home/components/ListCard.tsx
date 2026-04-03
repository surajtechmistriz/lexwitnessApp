import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

/* ---------- SCREEN MATH ---------- */
const { width } = Dimensions.get('window');
// Perfect 2-column width: (Screen - padding - gap) / 2
// Assuming parent padding is 12 and center gap is 12
const CONTAINER_PADDING = 24; // 12 left + 12 right from ScrollView
const GAP = 10; 
const CARD_WIDTH = (width - CONTAINER_PADDING - GAP) / 2;

/* ---------- TYPES ---------- */
type HeroCardProps = {
  category: any;
  title: string;
  slug: string;
  image: string; 
  date?: string;
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
  image,
  date,
}: HeroCardProps) => {
  
  const navigation = useNavigation<NavigationProp>();

  const categoryName = typeof category === 'string' ? category : category?.name;
  const categorySlug = category?.slug ?? 'general';

  const handlePress = () => {
    navigation.navigate('ArticleDetail', {
      slug: slug,
      category: categorySlug,
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={handlePress}
    >
      {/* Image Section - Fixed Aspect Ratio */}
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="cover"
      />

      <View style={styles.content}>
        {/* Category: Small & Bold */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryScreen', {
              slug: categorySlug,
              category: categorySlug,
            })
          }
        >
          <Text style={styles.categoryText}>{categoryName?.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* Title: Fixed height ensures 2x2 grid looks uniform */}
        <View style={styles.titleWrapper}>
           <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* Date: Pushed to bottom */}
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: CARD_WIDTH,
    marginBottom: 16, // Vertical gap between rows
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Slight shadow for a premium feel
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.75, // Standard 4:3 Magazine Ratio
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between', // Ensures date stays at bottom
  },
  categoryText: {
    color: '#C62828',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  titleWrapper: {
    height: 42, // Fixed height for 2 lines of text
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: '#1a1a1a',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  dateText: {
    color: '#999',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default ListCard;