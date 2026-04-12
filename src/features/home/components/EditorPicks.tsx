import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
// Narrower card (can tweak 0.5 to 0.6 based on your layout)
const CARD_WIDTH = width * 0.6; // ← reduced from 0.75

interface EditorPicksProps {
  image: string;
  title: string;
  author?: string;
  slug: string;
  category?: {
    slug: string;
  };
}

const EditorPicks = ({ image, title, author, slug, category }: EditorPicksProps) => {
  const navigation = useNavigation<any>();
  const categorySlug = category?.slug ?? 'general';

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
      {/* Image */}
      <Image source={{ uri: image }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {author ? (
          <Text style={styles.author}>By {author}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default EditorPicks;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16, // Slightly smaller radius
    overflow: 'hidden',
    marginRight: 8,   // Tighter horizontal gap
    marginBottom: 12,

    // Light frosted background
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',

    // Soft shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: '100%',
    height: 140, // Slightly shorter image
    backgroundColor: '#f0f0f0',
  },

  content: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    lineHeight: 18,
    marginBottom: 4,
  },

  author: {
    fontSize: 11,
    color: '#c9060a',
    fontWeight: '500',
    opacity: 0.8,
  },
});