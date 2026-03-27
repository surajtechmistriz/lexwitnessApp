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
} from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface PostListProps {
  posts: any[];
  postBaseUrl?: string;
  loading?: boolean;
  emptyMessage?: string;
  onPressPost?: (post: any) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PostList({
  posts,
  postBaseUrl = '',
  loading = false,
  emptyMessage = 'No posts available.',
  onPressPost,
}: PostListProps) {
  const getImageUrl = (image?: string) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${postBaseUrl}/${image}`;
  };

  const navigation = useNavigation<NavigationProp>();

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
        <View
          key={article.id || index}
          style={[
            styles.articleItem,
            index === posts.length - 1 && styles.noBorder,
          ]}
        >
          {/* IMAGE */}
          <TouchableOpacity
            style={styles.imageContainer}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('ArticleDetail', {
                slug: article.slug,
                category: article.category?.slug || 'general',
              });
            }}
          >
            {article.image ? (
              <Image
                source={{ uri: getImageUrl(article.image) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={{ color: '#999' }}>Img</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* CONTENT */}
          <View style={styles.contentContainer}>
            {/* TITLE */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('ArticleDetail', {
                  slug: article.slug,
                  category: article.category?.slug || 'general',
                });
              }}
            >
              <Text style={styles.title} numberOfLines={2}>
                {article.title}
              </Text>
            </TouchableOpacity>

            <Text style={styles.metaText}>
              <Text style={styles.authorText}>
                {typeof article.author === 'string'
                  ? article.author
                  : article.author?.name || 'Unknown'}
              </Text>
              {' | '}
              {article.magazine?.month?.name} {article.magazine?.year}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {article.short_description || 'No description available'}
            </Text>

            {/* READ MORE */}
            <TouchableOpacity
              style={styles.readMoreContainer}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('ArticleDetail', {
                  slug: article.slug,
                  category: article.category?.slug || 'general',
                });
              }}
            >
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15 },
  loaderContainer: { py: 40, alignItems: 'center' },
  topDivider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  emptyContainer: {
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyText: { color: '#666' },
  articleItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
  },
  noBorder: { borderBottomWidth: 0 },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: '100%' },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: { flex: 1 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  authorText: { color: '#c9060a', fontWeight: '500' },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  readMoreContainer: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { color: '#c9060a', fontSize: 14, fontWeight: '500' },
});
