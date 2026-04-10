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
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
    marginBottom: 22,

    //  soft glass surface
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',

    // depth
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: '100%',
    height: 170,
  },

  content: {
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    lineHeight: 22,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  author: {
    fontSize: 12,
    color: '#c9060a',
    fontWeight: '500',
    opacity: 0.85,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});