import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Setting a fixed width so cards can sit side-by-side
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65; // Shows 1 full card + a peek of the next

const EditorPicks = ({ image, title, author, slug, category }) => {
  const navigation = useNavigation<any>();
  const categorySlug = category?.slug ?? 'general';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug: slug,
          category: categorySlug,
        })
      }
      style={styles.cardContainer}
    >
      <Image
        source={{ uri: image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.authorText}>{author}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EditorPicks;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4, 
    overflow: 'hidden',
    width: CARD_WIDTH, // Fixed width for horizontal scrolling
    marginRight: 12,   // Space between cards
    marginBottom: 10,
    // Add a slight shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 140, // Reduced height for smaller card
  },
  textContainer: {
    padding: 10,
    height: 85, // Fixed height keeps all cards aligned
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    lineHeight: 18,
  },
  authorText: {
    fontSize: 12,
    color: '#b70000',
    fontWeight: '600',
    textTransform: 'uppercase', // Looks cleaner in a smaller card
  },
});