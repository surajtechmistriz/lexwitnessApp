import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { formatMonthYear } from '../../utils/helper/dateHelper';

interface PostListProps {
  posts: any[];
  postBaseUrl?: string;
  loading?: boolean;
  emptyMessage?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PostList({
  posts,
  postBaseUrl = '',
  loading = false,
  emptyMessage = 'No posts available.',
}: PostListProps) {
  const navigation = useNavigation<NavigationProp>();

  const getImageUrl = (image?: string) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${postBaseUrl}/${image}`;
  };

  const handleNavigateDetail = (article: any) => {
    navigation.navigate('ArticleDetail', {
      slug: article.slug,
      category: article.category?.slug || 'general',
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c9060a" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {posts.map((article, index) => (
        <TouchableOpacity
          key={article.id || index}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => handleNavigateDetail(article)}
        >
          {/* Image Section */}
          <View style={styles.imageWrapper}>
            {article.image ? (
              <Image
                source={{ uri: getImageUrl(article.image) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>

            {/* Meta Row */}
            <View style={styles.metaRow}>
              <TouchableOpacity
                onPress={() => {
                  if (article.author?.slug) {
                    navigation.navigate('AuthorScreen', {
                      slug: article.author.slug,
                    });
                  }
                }}
              >
                <Text style={styles.authorText} numberOfLines={1}>
                  {typeof article.author === 'string'
                    ? article.author
                    : article.author?.name || 'Unknown'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.dot}>•</Text>

 <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
  {formatMonthYear(
    article.magazine?.month?.name,
    article.magazine?.year
  )}
</Text>
            </View>

            {/* Action Indicator */}
            <View style={styles.actionRow}>
              <Text style={styles.readMoreText}>Read Article</Text>
              <View style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f9fb',
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    margin: 20,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    color: '#888',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 12,
    // Modern subtle shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 10,
  },

  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    lineHeight: 20,
  },
 metaRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
  flex: 1,
},
  authorText: {
    color: '#c9060a',
    fontWeight: '600',
    fontSize: 12,
  },
  dot: {
    marginHorizontal: 6,
    color: '#ccc',
    fontSize: 14,
  },
 dateText: {
  fontSize: 12,
  color: '#777',
  flexShrink: 1,
  maxWidth: '60%', // adjust if needed
},
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  readMoreText: {
    color: '#c9060a',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chevron: {
    width: 5,
    height: 5,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#c9060a',
    transform: [{ rotate: '45deg' }],
    marginLeft: 5,
  },
});