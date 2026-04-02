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
        <View
          key={article.id || index}
          style={[
            styles.articleItem,
            styles.row,
            index === posts.length - 1 && styles.noBorder,
          ]}
        >
          {/* IMAGE */}
          <TouchableOpacity
            style={styles.imageContainer}
            activeOpacity={0.8}
            onPress={() => handleNavigateDetail(article)}
          >
            {article.image ? (
              <Image
                source={{ uri: getImageUrl(article.image) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={{ color: '#999', fontSize: 12 }}>Img</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* CONTENT */}
          <View style={styles.contentContainer}>
            {/* TITLE */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleNavigateDetail(article)}
            >
              <Text style={styles.title} numberOfLines={2}>
                {article.title}
              </Text>
            </TouchableOpacity>

            {/* META: AUTHOR | DATE (ONE ROW FIX) */}
            <View style={styles.metaText}>
              <View style={styles.authorWrapper}>
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
              </View>

              <Text style={styles.date} numberOfLines={1}>
                {' | '}
                {article.magazine?.month?.name} {article.magazine?.year}
              </Text>
            </View>

            {/* READ MORE */}
            <TouchableOpacity
              style={styles.readMoreContainer}
              activeOpacity={0.8}
              onPress={() => handleNavigateDetail(article)}
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
  container: { paddingHorizontal: 15, marginTop:10 },
  loaderContainer: { paddingVertical: 40, alignItems: 'center' },
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
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  articleItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderStyle: 'dashed',
  },
  noBorder: { borderBottomWidth: 0 },
  imageContainer: {
    width: 90,
    height: 90,
    overflow: 'hidden',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
    marginTop: -4,
  },
  metaText: {
    flexDirection: 'row', // Force single row
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  authorWrapper: {
    flexShrink: 1, //  Allows author name to truncate if space is tight
  },
  authorText: { 
    color: '#c9060a', 
    fontWeight: '500', 
    fontSize: 13,
  },
  date: {
    fontSize: 13, 
    color: '#333',
    flexShrink: 0, //  Ensures date never gets compressed or hidden
  },
  readMoreContainer: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { color: '#c9060a', fontSize: 14, fontWeight: '500' },
});