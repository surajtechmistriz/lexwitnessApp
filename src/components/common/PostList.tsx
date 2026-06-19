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
import { formatMonthYear } from '../../utils/helper/dateHelper';
import { useTheme } from '../../redux/useTheme';

interface PostListProps {
  posts: any[];
  postBaseUrl?: string;
  loading?: boolean;
  emptyMessage?: string;
}

//  DEFINE TYPE LOCALLY
type RootStackParamList = {
  ArticleDetail: { slug: string; category?: string };
  Author: { slug: string };
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PostList({
  posts,
  postBaseUrl = '',
  loading = false,
  emptyMessage = 'No posts available.',
}: PostListProps) {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  const getImageUrl = (image?: string) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${postBaseUrl}/${image}`;
  };

  // ------FIXED NAVIGATION FUNCTIONS------

  const handleNavigateDetail = (article: any) => {
    navigation.navigate('ArticleDetail', {
      slug: article.slug,
      category: article.category?.slug || 'general',
    });
  };

  const handleAuthorPress = (author: any) => {
    if (author?.slug) {
      navigation.navigate('Author', {
        slug: author.slug,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {posts.map((article, index) => (
        <TouchableOpacity
          key={article.id || index}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: isDark ? '#000' : '#000',
            },
          ]}
          activeOpacity={0.9}
          onPress={() => handleNavigateDetail(article)}
        >
          {/* Image Section */}
          <View
            style={[styles.imageWrapper, { backgroundColor: colors.border }]}
          >
            {article.image ? (
              <Image
                source={{ uri: getImageUrl(article.image) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text
                  style={[styles.placeholderText, { color: colors.textMuted }]}
                >
                  No Image
                </Text>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {article.title}
            </Text>

            {/* Meta Row */}
            <View style={styles.metaRow}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Array.isArray(article.authors) &&
                article.authors.length > 0 ? (
                  article.authors.map((author: any, index: number) => (
                    <TouchableOpacity
                      key={author.slug || index}
                      onPress={() => handleAuthorPress(author)}
                    >
                      <Text
                        style={[styles.authorText, { color: colors.primary }]}
                      >
                        {author?.name || 'Unknown'}
                        {index < article.authors.length - 1 ? ', ' : ''}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[styles.authorText, { color: colors.primary }]}>
                    Unknown
                  </Text>
                )}
              </View>

              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>

              <Text
                style={[styles.dateText, { color: colors.textMuted }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatMonthYear(
                  article.magazine?.month?.name,
                  article.magazine?.year,
                )}
              </Text>
            </View>

            {/* Action Indicator */}
            <View style={styles.actionRow}>
              <Text style={[styles.readMoreText, { color: colors.primary }]}>
                Read Article
              </Text>
              <View style={[styles.chevron, { borderColor: colors.primary }]} />
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
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    margin: 20,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
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
    fontSize: 10,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  authorText: {
    fontWeight: '600',
    fontSize: 12,
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  readMoreText: {
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
    transform: [{ rotate: '45deg' }],
    marginLeft: 5,
  },
});
