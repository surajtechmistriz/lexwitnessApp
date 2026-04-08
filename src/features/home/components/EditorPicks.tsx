import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Setting a fixed width so cards can sit side-by-side
const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.65; // Shows 1 full card + a peek of the next

const CARD_WIDTH = width * 0.75;

const EditorPicks = ({ image, title, author, slug, category }) => {
  const navigation = useNavigation<any>();
  const categorySlug = category?.slug ?? 'general';
console.log("Name", author)
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug,
          category: categorySlug,
        })
      }
      style={styles.card}
    >
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {author && (
          <Text style={styles.author}>
            By {author}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default EditorPicks;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 14,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom:22
  },

  image: {
    width: '100%',
    height: 160,
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    lineHeight: 22,
    marginBottom: 6,
  },

  author: {
    fontSize: 12,
    color: '#c6090a',
    fontWeight: '500',
  },
});