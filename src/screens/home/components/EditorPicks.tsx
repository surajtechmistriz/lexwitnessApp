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
import { useTheme } from '../../../redux/useTheme';

const { width } = Dimensions.get('window');
// Narrower card (can tweak 0.5 to 0.6 based on your layout)
const CARD_WIDTH = width * 0.52;
const IMAGE_WIDTH = CARD_WIDTH;
const IMAGE_HEIGHT = (IMAGE_WIDTH * 9) / 16;

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
  const { colors, isDark } = useTheme();
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
      style={[styles.card, {
        backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.8)',
        borderColor: isDark ? colors.border : 'rgba(255,255,255,0.9)',
        shadowColor: isDark ? '#000' : '#000',
      }]}
    >
      {/* Image */}
      <Image 
        source={{ uri: image }} 
        style={[styles.image, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} 
      />

      {/* Content */}
      <View style={[styles.content, { 
        backgroundColor: isDark ? colors.card : 'rgba(255,255,255,0.8)',
      }]}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>

        {author ? (
          <Text style={[styles.author, { color: colors.primary }]}>
            By {author}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default EditorPicks;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 4,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },

  content: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    marginBottom: 3,
  },

  author: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.8,
  },

  scroll: {
    paddingRight: 10,
    paddingLeft: 4,
  },
});